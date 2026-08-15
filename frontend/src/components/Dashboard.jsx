import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPublicUserUrl } from '../config/env';
import ApiService from '../services/api';
import AppLayout from './layout/AppLayout';
import PageHeader from './ui/PageHeader';
import { SkeletonCard } from './ui/Skeleton';
import ThemeCustomizer from './ThemeCustomizer';
import LinkManager from './LinkManager';
import LiveMobilePreview from './LiveMobilePreview';
import LivePageShareBar from './LivePageShareBar';
import { normalizeThemeConfig } from '../utils/themePresets';

export default function Dashboard() {
  const { profile, setProfile } = useAuth();
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  const publicUrl = getPublicUserUrl(profile?.username);

  useEffect(() => {
    ApiService.getUserLinks()
      .then((res) => { if (res.success) setLinks(res.data || []); })
      .catch((err) => console.error('Failed to load links:', err))
      .finally(() => setLoadingLinks(false));
  }, []);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <PageHeader
            title="Design & Links Studio"
            description="Customize your page layout, themes, colors, and manage all your links."
          />
          <Link
            to="/dashboard/profile"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface-alt hover:bg-nav-hover text-xs font-semibold text-fg transition-colors shrink-0 shadow-2xs"
          >
            <span>Edit Profile Identity</span>
            <svg className="w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <LivePageShareBar profile={profile} links={links} publicUrl={publicUrl} />

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-6 lg:gap-8 items-start">
          <div className="flex flex-col gap-6 min-w-0">
            {loadingLinks ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <ThemeCustomizer profile={profile} onThemeUpdated={(updatedTheme) => setProfile((current) => ({ ...current, themeConfig: normalizeThemeConfig(updatedTheme) }))} />
                <LinkManager links={links} onLinksUpdated={(updated) => setLinks(updated)} />
              </>
            )}
          </div>

          <div className="hidden md:block sticky top-20">
            <div className="text-center mb-4">
              <span className="px-3 py-1 rounded-full bg-surface border border-border text-xs text-fg-muted font-medium">
                Live Preview
              </span>
            </div>
            <LiveMobilePreview profile={profile} links={links} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}