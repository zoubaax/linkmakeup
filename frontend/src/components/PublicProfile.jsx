import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../services/api';
import { SkeletonProfile } from './ui/Skeleton';
import ProfilePageView from './profile/ProfilePageView';

export default function PublicProfile({ usernameOverride } = {}) {
  const params = useParams();
  const username = usernameOverride || params.username;
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
      <div className="min-h-screen bg-app flex items-center justify-center">
        <SkeletonProfile />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-app flex flex-col items-center justify-center text-center px-6 py-24 gap-6">
        <span className="text-6xl">🔍</span>
        <h1 className="text-3xl font-bold text-fg">Profile Not Found</h1>
        <p className="text-fg-muted max-w-xs leading-relaxed">
          <strong className="text-accent">/{username}</strong> does not exist on LinkMakeup yet.
        </p>
        <Link to="/" className="px-6 py-3 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]">
          Create Your Own Page
        </Link>
      </div>
    );
  }

  const { profile, links } = data;

  useEffect(() => {
    if (!profile) return;
    const title = profile.displayName ? `${profile.displayName} | LinkMakeup` : 'LinkMakeup';
    document.title = title;

    const metaTags = [
      { property: 'og:title', content: profile.displayName || 'LinkMakeup' },
      { property: 'og:description', content: profile.role || profile.bio || `Check out ${profile.displayName}'s profile on LinkMakeup.` },
      { property: 'og:image', content: profile.avatarUrl || '' },
      { property: 'og:url', content: window.location.href },
      { name: 'twitter:title', content: profile.displayName || 'LinkMakeup' },
      { name: 'twitter:description', content: profile.role || profile.bio || `Check out ${profile.displayName}'s profile on LinkMakeup.` },
      { name: 'twitter:image', content: profile.avatarUrl || '' },
      { name: 'twitter:card', content: 'summary' },
    ];

    const createdTags = [];
    metaTags.forEach(({ property, name, content }) => {
      if (!content) return;
      const selector = property ? `meta[property="${property}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        if (property) element.setAttribute('property', property);
        if (name) element.setAttribute('name', name);
        document.head.appendChild(element);
        createdTags.push(element);
      }
      element.setAttribute('content', content);
    });

    return () => {
      document.title = 'LinkMakeup';
    };
  }, [profile]);

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
