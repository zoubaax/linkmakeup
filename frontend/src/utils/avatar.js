const GRADIENTS = [
  ['#8b5cf6', '#d946ef'],
  ['#f472b6', '#f59e0b'],
  ['#38bdf8', '#6366f1'],
  ['#34d399', '#22d3ee'],
  ['#fb7185', '#f97316'],
  ['#a78bfa', '#38bdf8'],
];

function hashCode(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(seed = '', fallback = '?') {
  const local = seed.trim().split('@')[0].replace(/[^a-zA-Z0-9\s_.-]/g, '').trim();
  const words = local.split(/[\s_.-]+/).filter(Boolean);
  if (!words.length) return fallback;
  const letters = words.slice(0, 2).map((w) => w[0].toUpperCase());
  return letters.join('');
}

export function generateAvatarDataUrl(seed = 'user') {
  const [from, to] = GRADIENTS[hashCode(seed) % GRADIENTS.length];
  const initials = getInitials(seed, '?');
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">`,
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">`,
    `<stop offset="0" stop-color="${from}"/>`,
    `<stop offset="1" stop-color="${to}"/>`,
    `</linearGradient></defs>`,
    `<rect width="96" height="96" fill="url(#g)"/>`,
    `<text x="48" y="50" font-family="system-ui, sans-serif" font-size="34" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${initials}</text>`,
    `</svg>`,
  ].join('');
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const DUMMY_NAMES = new Set(['Google Authenticated User', 'Google User']);