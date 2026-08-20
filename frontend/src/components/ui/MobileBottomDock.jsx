import { useNavigate } from 'react-router-dom';
import { HiPlus, HiEye, HiPaintBrush, HiSparkles, HiLink } from 'react-icons/hi2';

export default function MobileBottomDock({ onOpenPreview, isThemePage, linksCount = 0, profile }) {
  const navigate = useNavigate();

  // Calculate profile setup percentage
  let setupPoints = 0;
  if (profile?.username) setupPoints += 25;
  if (profile?.avatarUrl || profile?.avatar) setupPoints += 25;
  if (profile?.bio || profile?.displayName) setupPoints += 25;
  if (linksCount > 0) setupPoints += 25;
  const setupPercent = Math.max(setupPoints, 25);

  const handleAddClick = () => {
    if (isThemePage) {
      navigate('/dashboard');
    }
    setTimeout(() => {
      const addBtn = document.getElementById('add-link-btn') || document.querySelector('[data-action="add-link"]');
      if (addBtn) addBtn.click();
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 w-[calc(100%-2rem)] max-w-sm">
      {/* Linktree-Style Setup Circle */}
      <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-surface/95 backdrop-blur-xl border border-border shadow-xl shrink-0 p-1">
        <div className="flex flex-col items-center justify-center w-11 h-11 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
          <span className="text-[10px] font-black leading-tight">{setupPercent}%</span>
          <span className="text-[7px] font-bold tracking-tight opacity-90 leading-tight">set up</span>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="flex-1 flex items-center justify-around py-2 px-3 bg-surface/95 backdrop-blur-xl border border-border shadow-2xl rounded-3xl">
        <button
          type="button"
          onClick={handleAddClick}
          className="flex flex-col items-center gap-0.5 p-1 text-fg-muted hover:text-fg transition-colors cursor-pointer"
        >
          <HiPlus className="w-5 h-5 text-accent" />
          <span className="text-[10px] font-bold">Add</span>
        </button>

        <button
          type="button"
          onClick={onOpenPreview}
          className="flex flex-col items-center gap-0.5 p-1 text-fg-muted hover:text-fg transition-colors cursor-pointer"
        >
          <HiEye className="w-5 h-5" />
          <span className="text-[10px] font-bold">Preview</span>
        </button>

        {!isThemePage ? (
          <button
            type="button"
            onClick={() => navigate('/dashboard/theme')}
            className="flex flex-col items-center gap-0.5 p-1 text-fg-muted hover:text-fg transition-colors cursor-pointer"
          >
            <HiPaintBrush className="w-5 h-5" />
            <span className="text-[10px] font-bold">Design</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex flex-col items-center gap-0.5 p-1 text-fg-muted hover:text-fg transition-colors cursor-pointer"
          >
            <HiLink className="w-5 h-5" />
            <span className="text-[10px] font-bold">Links</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => navigate('/dashboard/analytics')}
          className="flex flex-col items-center gap-0.5 p-1 text-fg-muted hover:text-fg transition-colors cursor-pointer"
        >
          <HiSparkles className="w-5 h-5 text-amber-500" />
          <span className="text-[10px] font-bold">Enhance</span>
        </button>
      </div>
    </div>
  );
}

