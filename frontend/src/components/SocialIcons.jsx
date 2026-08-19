export const PLATFORM_PRESETS = [
  { id: 'instagram', name: 'Instagram', baseUrl: 'https://instagram.com/', color: 'from-pink-500 to-purple-600', icon: 'instagram' },
  { id: 'linkedin', name: 'LinkedIn', baseUrl: 'https://linkedin.com/in/', color: 'from-blue-600 to-cyan-600', icon: 'linkedin' },
  { id: 'github', name: 'GitHub', baseUrl: 'https://github.com/', color: 'from-slate-700 to-slate-900', icon: 'github' },
  { id: 'twitter', name: 'X (Twitter)', baseUrl: 'https://x.com/', color: 'from-slate-800 to-slate-950', icon: 'twitter' },
  { id: 'youtube', name: 'YouTube', baseUrl: 'https://youtube.com/@', color: 'from-red-600 to-rose-700', icon: 'youtube' },
  { id: 'tiktok', name: 'TikTok', baseUrl: 'https://tiktok.com/@', color: 'from-cyan-500 to-pink-500', icon: 'tiktok' },
  { id: 'snapchat', name: 'Snapchat', baseUrl: 'https://snapchat.com/add/', color: 'from-yellow-400 to-amber-500', icon: 'snapchat' },
  { id: 'discord', name: 'Discord', baseUrl: 'https://discord.gg/', color: 'from-indigo-500 to-blue-600', icon: 'discord' },
  { id: 'whatsapp', name: 'WhatsApp', baseUrl: 'https://wa.me/', color: 'from-emerald-500 to-teal-600', icon: 'whatsapp' },
  { id: 'telegram', name: 'Telegram', baseUrl: 'https://t.me/', color: 'from-sky-400 to-blue-500', icon: 'telegram' },
  { id: 'reddit', name: 'Reddit', baseUrl: 'https://reddit.com/user/', color: 'from-orange-600 to-red-600', icon: 'reddit' },
  { id: 'threads', name: 'Threads', baseUrl: 'https://threads.net/@', color: 'from-slate-800 to-zinc-950', icon: 'threads' },
  { id: 'twitch', name: 'Twitch', baseUrl: 'https://twitch.tv/', color: 'from-purple-600 to-violet-700', icon: 'twitch' },
  { id: 'kick', name: 'Kick', baseUrl: 'https://kick.com/', color: 'from-emerald-500 to-green-600', icon: 'kick' },
  { id: 'wattpad', name: 'Wattpad', baseUrl: 'https://wattpad.com/user/', color: 'from-orange-500 to-amber-600', icon: 'wattpad' },
  { id: 'substack', name: 'Substack', baseUrl: 'https://substack.com/@', color: 'from-amber-600 to-orange-700', icon: 'substack' },
  { id: 'medium', name: 'Medium', baseUrl: 'https://medium.com/@', color: 'from-slate-800 to-emerald-900', icon: 'medium' },
  { id: 'patreon', name: 'Patreon', baseUrl: 'https://patreon.com/', color: 'from-rose-500 to-red-600', icon: 'patreon' },
  { id: 'steam', name: 'Steam', baseUrl: 'https://steamcommunity.com/id/', color: 'from-slate-700 to-blue-950', icon: 'steam' },
  { id: 'bluesky', name: 'Bluesky', baseUrl: 'https://bsky.app/profile/', color: 'from-sky-400 to-blue-500', icon: 'bluesky' },
  { id: 'pinterest', name: 'Pinterest', baseUrl: 'https://pinterest.com/', color: 'from-red-600 to-red-700', icon: 'pinterest' },
  { id: 'spotify', name: 'Spotify', baseUrl: 'https://open.spotify.com/', color: 'from-emerald-500 to-emerald-700', icon: 'spotify' },
  { id: 'behance', name: 'Behance', baseUrl: 'https://www.behance.net/', color: 'from-blue-600 to-indigo-700', icon: 'behance' },
  { id: 'dribbble', name: 'Dribbble', baseUrl: 'https://dribbble.com/', color: 'from-pink-500 to-rose-600', icon: 'dribbble' },
  { id: 'figma', name: 'Figma', baseUrl: 'https://www.figma.com/', color: 'from-violet-600 to-purple-700', icon: 'figma' },
  { id: 'phone', name: 'Phone', baseUrl: '', color: 'from-emerald-500 to-teal-600', icon: 'phone' },
  { id: 'email', name: 'Email', baseUrl: '', color: 'from-amber-500 to-orange-600', icon: 'email' },
  { id: 'portfolio', name: 'Portfolio', baseUrl: 'https://', color: 'from-violet-600 to-fuchsia-600', icon: 'portfolio' },
];

export function getPlatformPreset(id) {
  return PLATFORM_PRESETS.find((p) => p.id === id) || { id, name: id, baseUrl: 'https://', icon: id };
}

export const DEFAULT_SUBTITLES = {
  instagram: 'Follow me on Instagram',
  linkedin: "Let's connect",
  github: 'Explore my code',
  twitter: 'Follow on X',
  youtube: 'Watch my videos',
  tiktok: 'Watch my TikToks',
  snapchat: 'Add me on Snapchat',
  discord: 'Join my Discord server',
  whatsapp: 'Send me a message',
  telegram: 'Chat on Telegram',
  reddit: 'Join the discussion on Reddit',
  threads: 'Follow on Threads',
  twitch: 'Watch me live on Twitch',
  kick: 'Watch my Kick stream',
  wattpad: 'Read my stories on Wattpad',
  substack: 'Read my newsletter on Substack',
  medium: 'Read my articles on Medium',
  patreon: 'Support me on Patreon',
  steam: 'Add me on Steam',
  bluesky: 'Follow me on Bluesky',
  website: 'Visit my website',
  portfolio: 'View my work',
  email: 'Send me an email',
  pinterest: 'See my boards',
  spotify: 'Listen with me',
  behance: 'See my designs',
  dribbble: 'See my shots',
  figma: 'See my designs',
  phone: 'Call me',
};

export function getDefaultSubtitle(iconName, title) {
  const key = (iconName || title || '').toLowerCase();
  for (const [platform, subtitle] of Object.entries(DEFAULT_SUBTITLES)) {
    if (key.includes(platform)) return subtitle;
  }
  return 'Visit this link';
}

export function getPlatformContainerStyle(iconName) {
  return 'bg-surface-muted text-fg border border-border';
}

export function getPlatformIcon(iconName, className = "w-4 h-4") {
  const name = (iconName || '').toLowerCase();

  if (name.includes('spotify')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72.96.42 1.5-.3.54-.96.72-1.5.42z"/>
      </svg>
    );
  }

  if (name.includes('instagram')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    );
  }

  if (name.includes('linkedin')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
      </svg>
    );
  }

  if (name.includes('github')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    );
  }

  if (name.includes('twitter') || name.includes('x')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    );
  }

  if (name.includes('youtube')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }

  if (name.includes('tiktok')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.82.57-1.31 1.56-1.28 2.57.01 1.04.58 2.01 1.48 2.53.94.55 2.14.54 3.07-.01.88-.52 1.43-1.5 1.44-2.52.01-4.78.01-9.56 0-14.34z"/>
      </svg>
    );
  }

  if (name.includes('whatsapp')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
      </svg>
    );
  }

  if (name.includes('portfolio') || name.includes('work')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }

  if (name.includes('email') || name.includes('mail')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }

  if (name.includes('phone') || name.includes('tel')) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.684l1.5 4.493a1 1 0 01-.502 1.21l-2.257 1.128a11.042 11.042 0 005.516 5.516l1.128-2.257a1 1 0 011.21-.502l4.493 1.5A1 1 0 0121 15.72V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    );
  }

  if (name.includes('behance')) {
    return <span className={`${className} inline-flex items-center justify-center font-black leading-none`}>Bē</span>;
  }

  if (name.includes('dribbble')) {
    return <span className={`${className} inline-flex items-center justify-center font-black leading-none`}>◉</span>;
  }

  if (name.includes('figma')) {
    return <span className={`${className} inline-flex items-center justify-center font-black leading-none`}>F</span>;
  }

  if (name.includes('snapchat')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.012 2c-3.52 0-5.748 2.518-5.748 5.27 0 1.637.766 2.977 1.328 3.844.225.348.33.568.225.877-.165.488-.997.877-1.657 1.102-.45.157-.772.487-.66.93.127.51.78.84 1.56.975 1.23.21 2.07 1.24 1.86 2.43-.18.99-1.44 1.62-2.43 1.29-.54-.18-1.08.03-1.32.48-.27.51.06 1.38.75 1.74 1.89.99 3.93 1.41 6.12 1.41s4.23-.42 6.12-1.41c.69-.36 1.02-1.23.75-1.74-.24-.45-.78-.66-1.32-.48-.99.33-2.25-.3-2.43-1.29-.21-1.19.63-2.22 1.86-2.43.78-.135 1.433-.465 1.56-.975.112-.443-.21-.773-.66-.93-.66-.225-1.492-.614-1.657-1.102-.105-.309 0-.529.225-.877.562-.867 1.328-2.207 1.328-3.844 0-2.752-2.228-5.27-5.748-5.27z"/>
      </svg>
    );
  }

  if (name.includes('discord')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
      </svg>
    );
  }

  if (name.includes('telegram')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.128.832.941z"/>
      </svg>
    );
  }

  if (name.includes('reddit')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.11 3.11 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.687-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.562-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.094z"/>
      </svg>
    );
  }

  if (name.includes('threads')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.186 24.004c-3.16 0-5.835-1.037-7.737-3.08-1.854-1.993-2.793-4.738-2.793-8.16 0-3.473.955-6.262 2.84-8.29C6.375 2.392 9.07 1.34 12.247 1.34c3.21 0 5.86 1.05 7.662 3.037 1.637 1.8 2.457 4.28 2.457 7.37 0 .42-.036.85-.107 1.28-.27 1.62-.977 2.94-2.099 3.93-1.08 1.003-2.52 1.545-4.285 1.61-1.574.06-2.905-.33-3.957-1.16-.766-.607-1.293-1.44-1.57-2.48l-.05-.18a3.78 3.78 0 0 1-1.41 1.23c-.63.34-1.35.52-2.14.52-1.3 0-2.38-.43-3.21-1.28-.83-.85-1.25-1.98-1.25-3.37 0-1.46.47-2.65 1.4-3.55.93-.9 2.18-1.36 3.72-1.36 1.13 0 2.12.24 2.95.71l.03.02v-.4c0-1.12-.29-1.96-.86-2.5-.57-.54-1.44-.81-2.61-.81-1.28 0-2.49.33-3.6.99-.27.16-.6.07-.76-.2-.16-.27-.07-.6.2-.76 1.3-.78 2.73-1.17 4.25-1.17 1.55 0 2.76.38 3.6 1.14.84.76 1.26 1.93 1.26 3.51v4.75c0 .91.31 1.62.92 2.1.61.48 1.45.71 2.5.67 1.26-.05 2.27-.45 3.01-1.19.74-.74 1.21-1.74 1.4-2.98.05-.32.08-.65.08-.98 0-2.61-.69-4.66-2.05-6.1-1.42-1.5-3.56-2.29-6.37-2.29-2.66 0-4.9.87-6.47 2.58-1.54 1.68-2.32 3.99-2.32 6.87 0 2.9.77 5.23 2.29 6.94 1.53 1.7 3.7 2.57 6.27 2.57 1.83 0 3.47-.44 4.88-1.31.28-.17.64-.08.81.2.17.28.08.64-.2.81-1.63 1.01-3.51 1.52-5.6 1.52zm-1.85-11.4c-1.07 0-1.9.3-2.47.89-.57.59-.85 1.37-.85 2.32 0 .9.27 1.62.81 2.16.54.54 1.24.81 2.1.81.65 0 1.23-.17 1.73-.5.5-.33.87-.8 1.1-1.4.08-.22.12-.46.12-.72v-.65c-.68-.61-1.54-.91-2.59-.91z"/>
      </svg>
    );
  }

  if (name.includes('twitch')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.571 1.429L1.429 4.143v15.714h5v3.571l3.571-3.571h3.571L21.429 12V1.429H11.571zm8.429 9.857l-2.857 2.857h-3.571l-2.5 2.5v-2.5h-3.571V2.857h12.5v8.429zM15.714 6.429h-1.429v4.286h1.429V6.429zm-4.286 0h-1.429v4.286h1.429V6.429z"/>
      </svg>
    );
  }

  if (name.includes('kick')) {
    return <span className={`${className} inline-flex items-center justify-center font-black text-[11px] leading-none tracking-tighter text-current`}>KICK</span>;
  }

  if (name.includes('wattpad')) {
    return <span className={`${className} inline-flex items-center justify-center font-black text-sm leading-none text-current`}>W</span>;
  }

  if (name.includes('substack')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.539 0H1.46v2.836h21.08V0z"/>
      </svg>
    );
  }

  if (name.includes('medium')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42c1.87 0 3.38 2.88 3.38 6.42zm2.99 0c0 3.06-.44 5.54-.99 5.54-.55 0-1-.2.48-1-5.54s.45-5.54.99-5.54c.55 0 1 2.48 1 5.54z"/>
      </svg>
    );
  }

  if (name.includes('patreon')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.386.002c-4.764 0-8.64 3.876-8.64 8.64 0 4.75 3.876 8.613 8.64 8.613 4.75 0 8.614-3.864 8.614-8.613C24 3.878 20.136 0 15.386 0zm-15.386.002h3.877v23.998H0V.002z"/>
      </svg>
    );
  }

  if (name.includes('steam')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.03 4.524 4.524s-2.03 4.524-4.524 4.524c-.104 0-.205-.008-.308-.016l-4.086 2.923c.005.066.012.13.012.197 0 1.954-1.587 3.541-3.541 3.541-1.637 0-3.023-1.115-3.431-2.633L.367 15.938C1.884 20.615 6.27 24 11.979 24c6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
      </svg>
    );
  }

  if (name.includes('bluesky')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566 1.01 0 1.87 0 5.2c0 3.329 1.488 12.016 2.222 13.9 1.34 3.447 4.148 4.288 6.556 2.113 2.164-1.956 2.766-3.784 3.222-5.113.456 1.329 1.058 3.157 3.222 5.113 2.408 2.175 5.216 1.334 6.556-2.113C22.512 17.216 24 8.529 24 5.2c0-3.33-2.566-4.19-5.202-2.395C16.046 4.747 13.087 8.686 12 10.8z"/>
      </svg>
    );
  }

  if (name.includes('pinterest')) {
    return (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
      </svg>
    );
  }

  // Default Globe/Website Icon
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}
