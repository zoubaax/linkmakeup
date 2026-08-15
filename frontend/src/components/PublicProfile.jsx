import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../services/api';
import { getPlatformIcon } from './SocialIcons';

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    ApiService.getPublicProfile(username)
      .then((res) => { if (res.success && res.data) setData(res.data); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-warm-border border-t-terra animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center text-center px-6 gap-6 font-sans">
        <span className="font-serif text-6xl">🔍</span>
        <h1 className="font-serif text-3xl font-bold text-charcoal">Profile Not Found</h1>
        <p className="text-charcoal-soft max-w-xs leading-relaxed">
          <strong className="text-terra">/{username}</strong> does not exist on LinkMakeup yet.
        </p>
        <Link to="/"
          className="px-6 py-3 rounded-xl bg-terra hover:bg-terra-dark text-white font-bold text-sm transition-colors">
          Create Your Own Page →
        </Link>
      </div>
    );
  }

  const { profile, links } = data;

  return (
    <div className="min-h-screen bg-cream font-sans py-12 px-4">
      <div className="max-w-sm mx-auto flex flex-col items-center gap-6">

        {/* Avatar */}
        <div className="relative w-24 h-24">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-terra to-amber-warm" />
          <img src={profile.avatarUrl} alt={profile.displayName}
            className="relative w-full h-full rounded-full object-cover border-3 border-cream bg-cream-dark" />
        </div>

        {/* Info */}
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-charcoal">{profile.displayName}</h1>
          {profile.bio && (
            <p className="text-charcoal-soft text-sm leading-relaxed mt-2 max-w-xs">{profile.bio}</p>
          )}
          <div className="mt-3 inline-block px-3 py-0.5 rounded-full bg-cream-dark border border-warm-border text-terra text-xs font-mono font-semibold">
            {profile.username}.linkmakeup.com
          </div>
        </div>

        {/* Links */}
        <div className="w-full flex flex-col gap-3 mt-2">
          {links.length === 0 ? (
            <p className="text-center text-stone text-sm">No links added yet.</p>
          ) : (
            links.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer"
                className="group flex items-center justify-between px-5 py-4 rounded-2xl bg-white border border-warm-border shadow-sm hover:border-terra hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-cream-dark flex items-center justify-center text-terra shrink-0">
                    {getPlatformIcon(link.icon || link.title, 'w-4 h-4')}
                  </div>
                  <span className="font-bold text-sm text-charcoal">{link.title}</span>
                </div>
                <svg className="w-4 h-4 text-stone group-hover:text-terra transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        <Link to="/" className="mt-4 flex items-center gap-1 text-stone text-xs hover:text-charcoal transition-colors">
          Powered by{' '}
          <span className="font-serif font-bold italic text-terra">LinkMakeup</span>
        </Link>
      </div>
    </div>
  );
}
