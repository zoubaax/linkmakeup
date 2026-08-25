import { useNavigate } from 'react-router-dom';
import {
  HiArrowUpTray,
  HiPlus,
  HiUser,
  HiPencil,
  HiPaintBrush,
  HiChartBar,
  HiEye,
} from 'react-icons/hi2';
import { useToast } from '../../contexts/ToastContext';
import { getPlatformIcon } from '../SocialIcons';
import { getProfileAvatarUrl } from '../../utils/cloudinary';

function getAvatarShapeClass(shape) {
  if (shape === 'square') return 'rounded-lg';
  if (shape === 'rounded' || shape === 'squircle') return 'rounded-2xl';
  return 'rounded-full';
}

export default function MobileStudioHeader({ profile, links = [], publicUrl, title = 'Links', onOpenPreview, onAddLink, onOpenShare }) {
  const navigate = useNavigate();

  const handleShare = () => {
    if (onOpenShare) {
      onOpenShare();
    }
  };

  const handleAddLinkClick = () => {
    if (onAddLink) {
      onAddLink();
      return;
    }
    const addBtn = document.getElementById('add-link-btn');
    if (addBtn) {
      addBtn.click();
    } else {
      navigate('/dashboard');
      setTimeout(() => {
        const btn = document.getElementById('add-link-btn');
        if (btn) btn.click();
      }, 150);
    }
  };

  // Render user's active configured links (up to 4)
  const activeUserLinks = (links || []).filter((l) => l.active !== false).slice(0, 4);

  return (
    <div className="md:hidden flex flex-col gap-3 bg-surface p-4 border-b border-border/80">
      {/* User Profile Card Row + Share Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar Container */}
          <div
            onClick={() => navigate('/dashboard/profile')}
            className={`relative w-14 h-14 ${getAvatarShapeClass(profile?.avatarShape)} ring-1 ring-border/60 shrink-0 overflow-hidden cursor-pointer flex items-center justify-center text-fg-muted font-bold text-xl hover:ring-accent transition-all shadow-2xs`}
          >
            {profile?.avatarUrl ? (
              <img
                src={getProfileAvatarUrl(profile.avatarUrl)}
                alt="Avatar"
                className="w-full h-full object-cover"
                loading="eager"
                decoding="async"
              />
            ) : (
              <HiUser className="w-7 h-7 opacity-60" />
            )}
          </div>

          {/* Username & Bio & Dynamic User Links Shortcuts */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <h2 className="text-base font-extrabold text-fg truncate leading-tight">
              {profile?.displayName || profile?.username || 'User'}
            </h2>

            <button
              type="button"
              onClick={() => navigate('/dashboard/profile')}
              className="text-xs text-fg-subtle hover:text-accent font-medium text-left truncate cursor-pointer transition-colors"
            >
              {profile?.role ? (
                profile?.bio ? `${profile.role} · ${profile.bio}` : profile.role
              ) : (
                profile?.bio || 'Add bio / role'
              )}
            </button>

            {/* Dynamic Social Icons Row (Respecting User Configured Links + Design System Colors) */}
            <div className="flex items-center gap-1.5 pt-1">
              {activeUserLinks.map((link) => (
                <button
                  key={link._id || link.id || link.url}
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="relative w-6 h-6 rounded-lg bg-surface-alt border border-border/80 flex items-center justify-center text-fg hover:border-accent/40 hover:text-accent hover:scale-105 transition-all cursor-pointer shadow-2xs"
                  title={link.title || link.platform}
                >
                  <div className="w-3 h-3 flex items-center justify-center text-fg-muted">
                    {getPlatformIcon(link.platform || link.icon || link.url, 'w-3 h-3')}
                  </div>
                </button>
              ))}

              {/* Keep Add Button */}
              <button
                type="button"
                onClick={handleAddLinkClick}
                className="w-6 h-6 rounded-lg border border-dashed border-border text-fg-subtle hover:text-accent hover:border-accent/60 hover:bg-surface-alt transition-colors cursor-pointer flex items-center justify-center"
                title="Add Link"
              >
                <HiPlus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Share Button (Vertically Centered & Compact) */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-alt border border-border/80 text-fg hover:bg-surface hover:border-accent/40 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
          aria-label="Share"
          title="Share Profile"
        >
          <HiArrowUpTray className="w-3.5 h-3.5 text-accent" />
          <span>Share</span>
        </button>
      </div>

      {/* Action Bar Row: Profile, Design, Analytics, Preview */}
      <div className="flex items-center gap-2 pt-1 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => navigate('/dashboard/profile')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surface-alt border border-border/80 hover:bg-surface hover:border-accent/40 text-fg transition-all shrink-0 shadow-2xs cursor-pointer active:scale-95"
        >
          <HiPencil className="w-3.5 h-3.5 text-fg-muted" />
          <span>Profile</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/dashboard/theme')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surface-alt border border-border/80 hover:bg-surface hover:border-accent/40 text-fg transition-all shrink-0 shadow-2xs cursor-pointer active:scale-95"
        >
          <HiPaintBrush className="w-3.5 h-3.5 text-fg-muted" />
          <span>Design</span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/dashboard/analytics')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surface-alt border border-border/80 hover:bg-surface hover:border-accent/40 text-fg transition-all shrink-0 shadow-2xs cursor-pointer active:scale-95"
        >
          <HiChartBar className="w-3.5 h-3.5 text-accent" />
          <span>Analytics</span>
        </button>

        <button
          type="button"
          onClick={onOpenPreview}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surface-alt border border-border/80 hover:bg-surface hover:border-accent/40 text-fg transition-all shrink-0 shadow-2xs cursor-pointer active:scale-95"
        >
          <HiEye className="w-3.5 h-3.5 text-accent" />
          <span>Preview</span>
        </button>
      </div>
    </div>
  );
}
