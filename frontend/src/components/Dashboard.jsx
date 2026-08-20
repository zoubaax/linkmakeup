import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPublicUserUrl } from '../config/env';
import ApiService from '../services/api';
import AppLayout from './layout/AppLayout';
import { SkeletonCard } from './ui/Skeleton';
import ThemeCustomizer from './ThemeCustomizer';
import LinkManager from './LinkManager';
import LiveMobilePreview from './LiveMobilePreview';
import LivePageShareBar from './LivePageShareBar';
import { normalizeThemeConfig } from '../utils/themePresets';
import { HiDevicePhoneMobile, HiXMark } from 'react-icons/hi2';

import MobileStudioHeader from './layout/MobileStudioHeader';
import ShareModal from './ShareModal';
import WalletCardModal from './WalletCardModal';
import QrCodeModal from './QrCodeModal';

export default function Dashboard() {
  const { profile, setProfile } = useAuth();
  const location = useLocation();

  const isThemePage = location.pathname.includes('/theme');

  const [links, setLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const publicUrl = getPublicUserUrl(profile?.username);

  useEffect(() => {
    ApiService.getUserLinks()
      .then((res) => { if (res.success) setLinks(res.data || []); })
      .catch((err) => console.error('Failed to load links:', err))
      .finally(() => setLoadingLinks(false));
  }, []);

  return (
    <AppLayout>
      {/* Mobile Studio Profile Header */}
      <MobileStudioHeader
        profile={profile}
        links={links}
        publicUrl={publicUrl}
        title={isThemePage ? 'Design' : 'Links'}
        onOpenPreview={() => setShowMobilePreview(true)}
        onOpenShare={() => setShowShareModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-6 space-y-6">
        {/* Desktop Live Share Bar */}
        <div className="hidden md:block">
          <LivePageShareBar profile={profile} links={links} publicUrl={publicUrl} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-6 lg:gap-8 items-start">
          <div className="flex flex-col gap-6 min-w-0">
            {loadingLinks ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : isThemePage ? (
              <ThemeCustomizer
                profile={profile}
                onThemeUpdated={(updatedTheme) =>
                  setProfile((current) => ({
                    ...current,
                    themeConfig: normalizeThemeConfig(updatedTheme),
                  }))
                }
              />
            ) : (
              <LinkManager links={links} onLinksUpdated={(updated) => setLinks(updated)} />
            )}
          </div>

          {/* Desktop Sticky Live Mobile Preview */}
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

      {/* Share Bottom Sheet Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        profile={profile}
        publicUrl={publicUrl}
        onOpenWallet={() => setShowWalletModal(true)}
        onOpenQr={() => setShowQrModal(true)}
      />

      {/* QR Code Modal */}
      {showQrModal && (
        <QrCodeModal
          profile={profile}
          publicUrl={publicUrl}
          onClose={() => setShowQrModal(false)}
        />
      )}

      {/* Wallet Pass Modal */}
      {showWalletModal && (
        <WalletCardModal
          profile={profile}
          publicUrl={publicUrl}
          onClose={() => setShowWalletModal(false)}
        />
      )}

      {/* Mobile Slide-Over / Modal Preview */}
      {showMobilePreview && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end p-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-3xl p-4 max-h-[88vh] overflow-y-auto relative flex flex-col items-center shadow-2xl">
            <div className="w-full flex items-center justify-between mb-4 px-2">
              <span className="text-sm font-bold text-fg flex items-center gap-2">
                <HiDevicePhoneMobile className="w-4 h-4 text-accent" />
                Live Mobile Preview
              </span>
              <button
                type="button"
                onClick={() => setShowMobilePreview(false)}
                className="p-2 rounded-full text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors cursor-pointer"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
            <LiveMobilePreview profile={profile} links={links} />
          </div>
        </div>
      )}
    </AppLayout>
  );
}