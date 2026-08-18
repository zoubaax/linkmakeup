import { useState } from 'react';

export default function LiveProfilePreview({ username = 'mohammed' }) {
  const [profile] = useState({
    displayName: 'Mohammed Zoubaa',
    bio: 'Software Engineer & Product Creator. Building LinkMakeup 🚀',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    links: [
      { id: 1, title: '💻 GitHub Portfolio', url: 'https://github.com/zoubaax', icon: 'github', clicks: '1.4k' },
      { id: 2, title: '💼 LinkedIn Profile', url: 'https://linkedin.com', icon: 'linkedin', clicks: '980' },
      { id: 3, title: '⚡ Personal Website', url: 'https://linkmakeup.com', icon: 'globe', clicks: '2.1k' },
      { id: 4, title: '🐦 X (Twitter)', url: 'https://x.com', icon: 'twitter', clicks: '640' },
    ],
  });

  return (
    <div className="relative mx-auto w-full max-w-[340px] aspect-[9/18] bg-slate-950 rounded-[44px] p-3 border-4 border-slate-800 shadow-2xl shadow-violet-950/40 ring-1 ring-slate-700/50">
      {/* Dynamic Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-12 h-1 bg-slate-800 rounded-full" />
      </div>

      {/* Screen Body */}
      <div className="w-full h-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-[34px] pt-8 px-4 pb-4 overflow-y-auto flex flex-col items-center justify-between text-center select-none">
        
        {/* Profile Card Header */}
        <div className="w-full flex flex-col items-center mt-2">
          {/* Subdomain URL Badge */}
          <div className="mb-4 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] font-mono font-semibold text-violet-300">
            {username || 'mohammed'}.linkmakeup.com
          </div>

          {/* Avatar */}
          <div className="relative group mb-3">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full blur opacity-60 group-hover:opacity-100 transition duration-300" />
            <img
              src={profile.avatar}
              alt={profile.displayName}
              className="relative w-20 h-20 rounded-full object-cover border-2 border-slate-900 shadow-md"
            />
          </div>

          {/* Name & Bio */}
          <h3 className="font-bold text-white text-lg tracking-tight">{profile.displayName}</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed">
            {profile.bio}
          </p>
        </div>

        {/* Public Links List */}
        <div className="w-full flex flex-col gap-2.5 my-6">
          {profile.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="group relative w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-violet-500/50 hover:bg-slate-850 transition-all duration-200 flex items-center justify-between shadow-sm"
            >
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                {link.title}
              </span>
              <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
