import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ApiService from '../services/api';
import { getPublicUserUrl } from '../config/env';
import { trackPageView, trackLinkClick } from '../utils/analytics';
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
          trackPageView(username);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [username]);

  const profile = data?.profile;
  const links = data?.links || [];
  const profileId = profile?.id;
  const appDomain = import.meta.env.VITE_APP_DOMAIN || 'linkmakeup.com';
  const landingUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/'
    : `https://${appDomain}/`;

  useEffect(() => {
    if (!profile || suspended) return;
    const displayTitle = profile.displayName
      ? profile.role
        ? `${profile.displayName} — ${profile.role} | Link Make Up`
        : `${profile.displayName} | Link Make Up`
      : 'Link Make Up';
    document.title = displayTitle;

    const shareTitle = profile.displayName
      ? profile.role
        ? `${profile.displayName} · ${profile.role}`
        : profile.displayName
      : 'Link Make Up';

    const shareDesc = profile.role
      ? `${profile.role}${profile.bio ? ` — ${profile.bio}` : ''}`
      : profile.bio || `Explore ${profile.displayName || profile.username || 'this'}'s professional digital identity and links on Link Make Up.`;

    const canonicalUrl = getPublicUserUrl(profile.username || username);
    const hasSufficientContent = Boolean(profile.displayName || profile.bio || links.length > 0);

    const metaTags = [
      { property: 'og:title', content: shareTitle },
      { property: 'og:description', content: shareDesc },
      { property: 'og:image', content: profile.avatarUrl || 'https://linkmakeup.com/logo-d.png' },
      { property: 'og:url', content: canonicalUrl },
      { property: 'og:site_name', content: 'Link Make Up' },
      { name: 'twitter:title', content: shareTitle },
      { name: 'twitter:description', content: shareDesc },
      { name: 'twitter:image', content: profile.avatarUrl || 'https://linkmakeup.com/logo-d.png' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'robots', content: hasSufficientContent ? 'index, follow, max-image-preview:large' : 'noindex, follow' },
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

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // ProfilePage JSON-LD Schema
    const schemaId = 'profile-page-jsonld';
    let scriptTag = document.getElementById(schemaId);
    if (scriptTag) scriptTag.remove();

    if (hasSufficientContent) {
      const profileSchema = {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        'mainEntity': {
          '@type': 'Person',
          'name': profile.displayName || profile.username,
          'alternateName': profile.username,
          'description': profile.bio || profile.role || '',
          'image': profile.avatarUrl || '',
          'url': canonicalUrl,
          'jobTitle': profile.role || undefined
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Link Make Up',
          'url': 'https://linkmakeup.com'
        }
      };
      scriptTag = document.createElement('script');
      scriptTag.id = schemaId;
      scriptTag.type = 'application/ld+json';
      scriptTag.text = JSON.stringify(profileSchema);
      document.head.appendChild(scriptTag);
    }

    return () => {
      document.title = 'Link Make Up';
      const tag = document.getElementById(schemaId);
      if (tag) tag.remove();
    };
  }, [profile, links, suspended]);

  useEffect(() => {
    if (suspended) {
      document.title = 'Page Unavailable | Link Make Up';
      return;
    }
    if (notFound) document.title = '404 — Page Not Found | Link Make Up';
  }, [notFound, suspended]);

  const handleLinkClick = useCallback((link) => {
    trackLinkClick(username, link.id);
  }, [username]);

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
          The page for <strong className="text-accent">/{username}</strong> does not exist on Link Make Up yet.
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
      onLinkClick={handleLinkClick}
    />
  );
}
