import { forwardRef } from 'react';
import LiveMobilePreview from './LiveMobilePreview';
import { getCopyrightLine, getMarketingSiteUrl } from '../utils/pageExport';

const ExportPreviewCard = forwardRef(function ExportPreviewCard({ profile, links }, ref) {
  return (
    <div
      ref={ref}
      className="inline-flex flex-col items-center bg-[#f4f4f5] p-8 rounded-[2rem]"
    >
      <LiveMobilePreview profile={profile} links={links} />
      <a
        href={getMarketingSiteUrl()}
        target="_blank"
        rel="noreferrer"
        className="mt-5 text-[11px] text-zinc-500 font-medium tracking-wide hover:text-zinc-700 transition-colors"
      >
        {getCopyrightLine()}
      </a>
    </div>
  );
});

export default ExportPreviewCard;
