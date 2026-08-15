import { useEffect, useState } from 'react';
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
        <PageHeader
          title="Profile Details"
          description="Update your avatar, display name, bio, and status badge."
        />

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
