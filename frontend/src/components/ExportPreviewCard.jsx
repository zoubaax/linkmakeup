import { forwardRef } from 'react';
import LiveMobilePreview from './LiveMobilePreview';
import ProfileBrandingFooter from './profile/ProfileBrandingFooter';

const ExportPreviewCard = forwardRef(function ExportPreviewCard({ profile, links }, ref) {
  return (
    <div
      ref={ref}
      className="inline-flex flex-col items-center bg-[#f4f4f5] p-8 rounded-[2rem]"
    >
      <LiveMobilePreview profile={profile} links={links} />
      <ProfileBrandingFooter linkTarget="_blank" className="text-zinc-500" />
    </div>
  );
});

export default ExportPreviewCard;
