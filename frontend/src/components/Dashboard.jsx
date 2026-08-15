import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getPublicUserUrl } from '../config/env';
import ApiService from '../services/api';
import AppLayout from './layout/AppLayout';
import PageHeader from './ui/PageHeader';
import { SkeletonCard } from './ui/Skeleton';
import ProfileEditor from './ProfileEditor';
import ThemeCustomizer from './ThemeCustomizer';
import LinkManager from './LinkManager';
import LiveMobilePreview from './LiveMobilePreview';

export default function Dashboard() {
  const { profile, setProfile } = useAuth();
  const { success: toastSuccess } = useToast();
  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);

  const publicUrl = getPublicUserUrl(profile?.username);

  useEffect(() => {
    ApiService.getUserLinks()
      .then((res) => { if (res.success) setLinks(res.data || []); })
      .catch((err) => console.error('Failed to load links:', err))
      .finally(() => setLoadingLinks(false));
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toastSuccess('Link copied to clipboard');
    } catch {
      toastSuccess('Copy failed — select the URL manually');
    }
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <PageHeader
          title="Dashboard"
          description="Edit your profile, manage links, and preview your live page."
          actions={
            <>
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Copy Link
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface border border-border-strong text-fg font-semibold text-sm hover:bg-nav-hover transition-all"
              >
                Visit
              </a>
            </>
          }
        />

        <div className="mb-8 p-4 rounded-2xl bg-surface border border-border shadow-sm">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">Your live page</p>
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-base sm:text-lg font-bold text-fg underline underline-offset-2 decoration-border-strong hover:decoration-accent transition-all break-all"
          >
            {publicUrl}
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="flex flex-col gap-6">
            {loadingLinks ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <ProfileEditor profile={profile} onProfileUpdated={(updated) => setProfile({ ...profile, ...updated })} />
                <ThemeCustomizer profile={profile} onThemeUpdated={(updatedTheme) => setProfile({ ...profile, themeConfig: updatedTheme })} />
                <LinkManager links={links} onLinksUpdated={(updated) => setLinks(updated)} />
              </>
            )}
          </div>

          <div className="hidden lg:block sticky top-20">
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
