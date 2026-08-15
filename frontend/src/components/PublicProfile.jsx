import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../services/api';
import { getPlatformIcon } from './SocialIcons';
import { env } from '../config/env';
import AppLayout from './layout/AppLayout';
import { SkeletonProfile } from './ui/Skeleton';

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
      <AppLayout>
        <SkeletonProfile />
      </AppLayout>
    );
  }

  if (notFound) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
          <span className="text-6xl">🔍</span>
          <h1 className="text-3xl font-bold text-fg">Profile Not Found</h1>
          <p className="text-fg-muted max-w-xs leading-relaxed">
            <strong className="text-accent">/{username}</strong> does not exist on LinkMakeup yet.
          </p>
          <Link to="/" className="px-6 py-3 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
            Create Your Own Page
          </Link>
        </div>
      </AppLayout>
    );
  }

  const { profile, links } = data;

  return (
    <AppLayout>
      <div className="py-12 px-4">
        <div className="max-w-sm mx-auto flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700" />
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="relative w-full h-full rounded-full object-cover border-2 border-app bg-surface-muted"
            />
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-fg">{profile.displayName}</h1>
            {profile.bio && <p className="text-fg-muted text-sm leading-relaxed mt-2 max-w-xs">{profile.bio}</p>}
            <div className="mt-3 inline-block px-3 py-0.5 rounded-full bg-surface border border-border text-accent text-xs font-mono font-semibold">
              {profile.username}.{env.appDomain}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 mt-2">
            {links.length === 0 ? (
              <p className="text-center text-fg-subtle text-sm">No links added yet.</p>
            ) : (
              links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between px-5 py-4 rounded-2xl bg-surface border border-border hover:border-accent hover:-translate-y-0.5 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-surface-alt flex items-center justify-center text-accent shrink-0">
                      {getPlatformIcon(link.icon || link.title, 'w-4 h-4')}
                    </div>
                    <span className="font-bold text-sm text-fg">{link.title}</span>
                  </div>
                  <svg className="w-4 h-4 text-fg-subtle group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              ))
            )}
          </div>

          <Link to="/discussions" className="mt-4 flex items-center gap-1 text-fg-subtle text-xs hover:text-fg-muted transition-colors">
            Powered by <span className="font-bold text-accent">LinkMakeup</span>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
