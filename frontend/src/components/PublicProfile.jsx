import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../services/api';
import { SkeletonProfile } from './ui/Skeleton';
import ProfilePageView from './profile/ProfilePageView';
import SuspendedPublicPage from './SuspendedPublicPage';

export default function PublicProfile({ usernameOverride } = {}) {
  const params = useParams();
  const username = usernameOverride || params.username;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [suspended, setSuspended] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setSuspended(false);
    setData(null);

    ApiService.getPublicProfile(username)
      .then((res) => {
        if (res.success && res.data?.suspended) {
          setSuspended(true);
          setData(res.data);
          return;
        }
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  const profile = data?.profile;
  const links = data?.links || [];
  const appDomain = import.meta.env.VITE_APP_DOMAIN || 'linkmakeup.com';
  const landingUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/'
    : `https://${appDomain}/`;

  useEffect(() => {
    if (!profile || suspended) return;
    const displayTitle = profile.displayName
      ? profile.role
        ? `${profile.displayName} — ${profile.role}`
        : `${profile.displayName} | LinkMakeup`
      : 'LinkMakeup';
    document.title = displayTitle;

    const shareTitle = profile.displayName
      ? profile.role
        ? `${profile.displayName} · ${profile.role}`
        : profile.displayName
      : 'LinkMakeup';

    const shareDesc = profile.role
      ? `${profile.role}${profile.bio ? ` — ${profile.bio}` : ''}`
      : profile.bio || `Check out ${profile.displayName || 'this'}'s bio link page on LinkMakeup.`;

    const metaTags = [
      { property: 'og:title', content: shareTitle },
      { property: 'og:description', content: shareDesc },
      { property: 'og:image', content: profile.avatarUrl || '' },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:title', content: shareTitle },
      { name: 'twitter:description', content: shareDesc },
      { name: 'twitter:image', content: profile.avatarUrl || '' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ];

    metaTags.forEach(({ property, name, content }) => {
      if (!content) return;
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (property) element.setAttribute('property', property);
        if (name) element.setAttribute('name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    });

    return () => {
      document.title = 'LinkMakeup';
    };
  }, [profile, suspended]);

  useEffect(() => {
    if (suspended) {
      document.title = 'Page Unavailable | LinkMakeup';
      return;
    }
    if (notFound) document.title = '404 — Page Not Found | LinkMakeup';
  }, [notFound, suspended]);

  if (loading) {
    return (
      <div className="min-h-screen bg-app flex items-center justify-center">
        <SkeletonProfile />
      </div>
    );
  }

  if (suspended) {
    return (
      <SuspendedPublicPage
        username={profile?.username || username}
        displayName={profile?.displayName}
        landingUrl={landingUrl}
      />
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-app flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <span className="text-6xl font-black tracking-tight text-accent leading-none">404</span>
        <p className="text-sm font-bold tracking-[0.2em] text-accent">ERROR 404</p>
        <h1 className="text-3xl font-bold text-fg">Page Not Found</h1>
        <p className="text-fg-muted max-w-xs leading-relaxed">
          The page for <strong className="text-accent">/{username}</strong> does not exist on LinkMakeup yet.
        </p>
        <a href={landingUrl} className="px-6 py-3 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
          Create Your Own Page
        </a>
      </div>
    );
  }

  return (
    <ProfilePageView
      profile={profile}
      links={links}
      theme={profile.themeConfig}
      showFooter
      className="min-h-screen"
    />
  );
}
