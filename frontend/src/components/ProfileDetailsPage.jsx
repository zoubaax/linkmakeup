import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';
import AppLayout from './layout/AppLayout';
import PageHeader from './ui/PageHeader';
import ProfileEditor from './ProfileEditor';
import LiveMobilePreview from './LiveMobilePreview';

export default function ProfileDetailsPage() {
  const { profile, setProfile } = useAuth();
  const [links, setLinks] = useState([]);

  useEffect(() => {
    ApiService.getUserLinks()
      .then((res) => { if (res.success) setLinks(res.data || []); })
      .catch((err) => console.error('Failed to load links:', err));
  }, []);

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <PageHeader
            title="Profile Identity"
            description="Manage your avatar photo, shape, display name, job title, bio, and status pill."
          />
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface-alt hover:bg-nav-hover text-xs font-semibold text-fg transition-colors shrink-0 shadow-2xs"
          >
            <svg className="w-4 h-4 text-fg-muted" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Design & Links</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          <ProfileEditor
            profile={profile}
            onProfileUpdated={(updated) => setProfile((current) => ({ ...current, ...updated }))}
          />

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
