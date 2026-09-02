/** Intelligent search helpers – fuzzy, alias-aware, token-aware scoring
 * Used by LinkManager platform picker and Admin command palette / tables.
 * Zero-dependency, <1kb gzip.
 */

// ---------- normalization ----------
export function normalizeQuery(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9@._-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(str) {
  const n = normalizeQuery(str);
  if (!n) return [];
  return n.split(' ').filter(Boolean);
}

// ---------- string distance helpers ----------
function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let cur = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

function editSimilarity(a, b) {
  if (!a || !b) return 0;
  const d = levenshtein(a, b);
  const max = Math.max(a.length, b.length);
  return max === 0 ? 1 : 1 - d / max;
}

// subsequence fuzzy (characters appear in order)
function subsequenceScore(query, target) {
  let qi = 0, ti = 0, matches = 0;
  while (qi < query.length && ti < target.length) {
    if (query[qi] === target[ti]) { matches++; qi++; }
    ti++;
  }
  return matches / query.length;
}

// ---------- generic scoring ----------
/**
 * Score a single query token against a set of target strings.
 * Returns 0..100. Higher is better. 0 means no match.
 */
export function scoreTokenAgainstTargets(token, targets) {
  const t = normalizeQuery(token);
  if (!t) return 0;
  let best = 0;
  for (const raw of targets) {
    const target = normalizeQuery(raw);
    if (!target) continue;
    if (target === t) best = Math.max(best, 100); // exact
    else if (target.startsWith(t)) best = Math.max(best, 92); // prefix
    else if (target.includes(t)) best = Math.max(best, 80); // substring
    else {
      // word-prefix (any word starts with token)
      const words = target.split(' ');
      if (words.some((w) => w.startsWith(t))) best = Math.max(best, 75);
      // fuzzy edit distance – only for tokens >=3 chars to avoid noise
      if (t.length >= 3) {
        // check each word
        for (const w of words) {
          const sim = editSimilarity(t, w);
          if (sim >= 0.72) best = Math.max(best, Math.round(55 + sim * 20)); // 69-75
          else if (sim >= 0.62 && w.length >= 4) best = Math.max(best, Math.round(40 + sim * 15));
        }
        // also overall subsequence for abbreviations like "ig" -> "instagram"
        if (t.length >= 2 && t.length <= 4) {
          const sub = subsequenceScore(t, target.replace(/\s/g, ''));
          if (sub === 1) best = Math.max(best, 68);
        }
      }
    }
    if (best === 100) break;
  }
  return best;
}

/**
 * Score multi-token query against targets set. Tokens are ANDed but we allow partial.
 * Returns { score: 0..100, matchedTokens, totalTokens }
 */
export function scoreQueryAgainstTargets(query, targets) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return { score: 100, matchedTokens: 0, totalTokens: 0 };
  const scores = tokens.map((tok) => scoreTokenAgainstTargets(tok, targets));
  const matched = scores.filter((s) => s > 0).length;
  if (matched === 0) return { score: 0, matchedTokens: 0, totalTokens: tokens.length };
  // require at least half tokens to match for multi-token queries
  if (tokens.length > 1 && matched < Math.ceil(tokens.length / 2)) {
    // penalize heavily
    const avg = scores.reduce((a, b) => a + b, 0) / tokens.length;
    return { score: Math.round(avg * 0.45), matchedTokens: matched, totalTokens: tokens.length };
  }
  const avg = scores.reduce((a, b) => a + b, 0) / tokens.length;
  // bonus if all tokens matched
  const bonus = matched === tokens.length ? 6 : 0;
  return { score: Math.min(100, Math.round(avg + bonus)), matchedTokens: matched, totalTokens: tokens.length };
}

// ---------- highlight ----------
export function highlightMatch(text, query) {
  const tokens = tokenize(query);
  if (!tokens.length || !text) return [{ text, match: false }];
  const lower = String(text).toLowerCase();
  // build intervals for all token occurrences
  const intervals = [];
  for (const tok of tokens) {
    const t = tok.toLowerCase();
    let idx = 0;
    while ((idx = lower.indexOf(t, idx)) !== -1) {
      intervals.push([idx, idx + t.length]);
      idx += t.length;
    }
  }
  if (!intervals.length) return [{ text, match: false }];
  intervals.sort((a, b) => a[0] - b[0]);
  // merge
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const cur = intervals[i];
    if (cur[0] <= prev[1]) prev[1] = Math.max(prev[1], cur[1]);
    else merged.push(cur);
  }
  const parts = [];
  let cursor = 0;
  for (const [s, e] of merged) {
    if (cursor < s) parts.push({ text: String(text).slice(cursor, s), match: false });
    parts.push({ text: String(text).slice(s, e), match: true });
    cursor = e;
  }
  if (cursor < String(text).length) parts.push({ text: String(text).slice(cursor), match: false });
  return parts;
}

// ---------- platform-specific ----------
export const PLATFORM_ALIASES = {
  github: ['gh', 'git'],
  portfolio: ['website', 'site', 'web', 'personal site', 'cv'],
  email: ['mail', 'gmail', 'outlook'],
  linkedin: ['linked in', 'li'],
  instagram: ['ig', 'insta', 'gram'],
  twitter: ['x', 'tweet', 'twitter/x', 'x twitter'],
  whatsapp: ['wa', 'whats app'],
  youtube: ['yt', 'ytb', 'video'],
  tiktok: ['tik tok', 'tt'],
  telegram: ['tg', 'tele'],
  snapchat: ['snap', 'sc'],
  discord: ['dc', 'discord server'],
  phone: ['tel', 'call', 'mobile', 'cell'],
  reddit: ['r/', 'subreddit'],
  threads: ['thread'],
  twitch: ['stream', 'twich'],
  kick: ['kick stream'],
  wattpad: ['wp', 'stories'],
  substack: ['newsletter', 'sub stack'],
  medium: ['blog', 'article'],
  patreon: ['patron'],
  steam: ['gaming'],
  bluesky: ['bsky', 'blue sky'],
  pinterest: ['pin', 'pins'],
  spotify: ['music', 'spot'],
  behance: ['be hance', 'portfolio design'],
  dribbble: ['dribble', 'shots'],
  figma: ['design'],
  gitlab: ['gl'],
  stackoverflow: ['stack overflow', 'so', 'stack'],
  producthunt: ['product hunt', 'ph'],
  devto: ['dev.to', 'dev'],
  hashnode: ['hash node'],
  codepen: ['code pen', 'pen'],
  kaggle: ['data', 'ml'],
  buymeacoffee: ['buy me a coffee', 'bmac', 'coffee'],
  kofi: ['ko-fi', 'kofi coffee'],
  soundcloud: ['sound cloud', 'sc music'],
  applemusic: ['apple music', 'itunes'],
  gumroad: ['gum road'],
  appstore: ['app store', 'ios', 'iphone'],
  googleplay: ['google play', 'play store', 'android'],
  notion: ['notes', 'workspace'],
  website: ['site', 'web', 'url', 'link'],
};

export function getPlatformSearchTargets(preset) {
  const aliases = PLATFORM_ALIASES[preset.id] || [];
  return [preset.name, preset.id, ...aliases];
}

export function scorePlatformPreset(preset, query) {
  if (!query.trim()) return 100;
  const targets = getPlatformSearchTargets(preset);
  const { score } = scoreQueryAgainstTargets(query, targets);
  // tiny boost for short popular platforms when query is alias exactly
  const q = normalizeQuery(query);
  const aliases = (PLATFORM_ALIASES[preset.id] || []).map(normalizeQuery);
  if (aliases.includes(q)) return Math.max(score, 95);
  return score;
}

export function filterAndRankPresets(presets, query, { minScore = 35 } = {}) {
  const q = query.trim();
  if (!q) return presets.map((p) => ({ preset: p, score: 100 }));
  const scored = presets
    .map((p) => ({ preset: p, score: scorePlatformPreset(p, q) }))
    .filter((x) => x.score >= minScore)
    .sort((a, b) => b.score - a.score || a.preset.name.localeCompare(b.preset.name));
  return scored;
}

// ---------- command palette ----------
export function scoreCommand(item, query) {
  const targets = [item.label, item.hint, item.id];
  const { score } = scoreQueryAgainstTargets(query, targets);
  return score;
}
