import { useState } from 'react';
import {
  HiXMark,
  HiQrCode,
  HiCreditCard,
  HiArrowTopRightOnSquare,
  HiClipboardDocumentCheck,
  HiShare,
} from 'react-icons/hi2';
import { FaInstagram, FaTiktok, FaWhatsapp, FaLinkedin, FaXTwitter } from 'react-icons/fa6';
import { useToast } from '../contexts/ToastContext';

export default function ShareModal({
  isOpen,
  onClose,
  profile,
  publicUrl,
  onOpenQr,
  onOpenWallet,
}) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const displayUrl = publicUrl || `https://linkmakeup.com/${profile?.username || ''}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayUrl);
      setCopied(true);
      toastSuccess('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toastError('Could not copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.displayName || profile?.username || 'LinkMakeup Profile',
          url: displayUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Check out my bio link page: ${displayUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const text = `Check out my bio link page on LinkMakeup:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(displayUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(displayUrl)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />

      {/* Share Bottom Sheet Container */}
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl animate-in slide-in-from-bottom duration-300 z-10 flex flex-col gap-5">
        {/* Header: Title & Close Button */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-fg tracking-tight">Share</h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-surface-alt border border-border flex items-center justify-center text-fg-muted hover:text-fg hover:bg-surface-muted transition-colors cursor-pointer"
              aria-label="Close share dialog"
            >
              <HiXMark className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* URL Copy Container (Favicon + System Design Tokens) */}
        <div className="flex items-center justify-between gap-3 p-2.5 pl-4 rounded-2xl bg-surface-alt border border-border/80 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
              <img src="/favicon.svg" alt="Favicon" className="w-full h-full object-contain" />
            </div>
            <span className="font-mono text-xs sm:text-sm font-bold text-fg truncate">
              {displayUrl}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xs shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <HiClipboardDocumentCheck className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <span>Copy</span>
            )}
          </button>
        </div>

        {/* Horizontal Divider */}
        <div className="h-px bg-border/60 w-full" />

        {/* Share Options Grid / Carousel */}
        <div className="flex items-start gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1">
          {/* Option 1: My Page */}
          <button
            type="button"
            onClick={() => {
              window.open(displayUrl, '_blank', 'noopener,noreferrer');
              onClose();
            }}
            className="flex flex-col items-center gap-2 group min-w-[4.25rem] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border/80 group-hover:border-accent/40 group-hover:bg-surface group-hover:scale-105 transition-all shadow-2xs flex items-center justify-center text-accent">
              <HiArrowTopRightOnSquare className="w-6 h-6 text-accent" />
            </div>
            <span className="text-[11px] font-bold text-fg text-center leading-tight">My Page</span>
          </button>

          {/* Option 2: Cards / Wallet Pass */}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenWallet) onOpenWallet();
            }}
            className="flex flex-col items-center gap-2 group min-w-[4.25rem] cursor-pointer"
          >
            <div className="relative w-14 h-14 rounded-2xl bg-surface-alt border border-border/80 group-hover:border-accent/40 group-hover:bg-surface group-hover:scale-105 transition-all shadow-2xs flex items-center justify-center text-fg">
              <HiCreditCard className="w-6 h-6 text-accent" />
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-accent text-white text-[8px] font-black uppercase tracking-wider shadow-xs">
                NEW
              </span>
            </div>
            <span className="text-[11px] font-bold text-fg text-center leading-tight">Cards</span>
          </button>

          {/* Option 3: QR code */}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenQr) onOpenQr();
            }}
            className="flex flex-col items-center gap-2 group min-w-[4.25rem] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border/80 group-hover:border-accent/40 group-hover:bg-surface group-hover:scale-105 transition-all shadow-2xs flex items-center justify-center text-fg">
              <HiQrCode className="w-6 h-6 text-accent" />
            </div>
            <span className="text-[11px] font-bold text-fg text-center leading-tight">QR code</span>
          </button>

          {/* Option 4: WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="flex flex-col items-center gap-2 group min-w-[4.25rem] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border/80 group-hover:border-accent/40 group-hover:bg-surface group-hover:scale-105 transition-all shadow-2xs flex items-center justify-center text-fg">
              <FaWhatsapp className="w-6 h-6 text-fg-muted group-hover:text-accent transition-colors" />
            </div>
            <span className="text-[11px] font-bold text-fg text-center leading-tight">WhatsApp</span>
          </button>

          {/* Option 5: X (Twitter) */}
          <button
            type="button"
            onClick={handleTwitterShare}
            className="flex flex-col items-center gap-2 group min-w-[4.25rem] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border/80 group-hover:border-accent/40 group-hover:bg-surface group-hover:scale-105 transition-all shadow-2xs flex items-center justify-center text-fg">
              <FaXTwitter className="w-6 h-6 text-fg-muted group-hover:text-accent transition-colors" />
            </div>
            <span className="text-[11px] font-bold text-fg text-center leading-tight">X</span>
          </button>

          {/* Option 6: LinkedIn */}
          <button
            type="button"
            onClick={handleLinkedInShare}
            className="flex flex-col items-center gap-2 group min-w-[4.25rem] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border/80 group-hover:border-accent/40 group-hover:bg-surface group-hover:scale-105 transition-all shadow-2xs flex items-center justify-center text-fg">
              <FaLinkedin className="w-6 h-6 text-fg-muted group-hover:text-accent transition-colors" />
            </div>
            <span className="text-[11px] font-bold text-fg text-center leading-tight">LinkedIn</span>
          </button>

          {/* Option 7: Instagram */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-2 group min-w-[4.25rem] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border/80 group-hover:border-accent/40 group-hover:bg-surface group-hover:scale-105 transition-all shadow-2xs flex items-center justify-center text-fg">
              <FaInstagram className="w-6 h-6 text-fg-muted group-hover:text-accent transition-colors" />
            </div>
            <span className="text-[11px] font-bold text-fg text-center leading-tight">Instagram</span>
          </button>

          {/* Option 8: TikTok */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-2 group min-w-[4.25rem] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border/80 group-hover:border-accent/40 group-hover:bg-surface group-hover:scale-105 transition-all shadow-2xs flex items-center justify-center text-fg">
              <FaTiktok className="w-6 h-6 text-fg-muted group-hover:text-accent transition-colors" />
            </div>
            <span className="text-[11px] font-bold text-fg text-center leading-tight">TikTok</span>
          </button>

          {/* Option 9: Native Share */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-2 group min-w-[4.25rem] cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-alt border border-border/80 group-hover:border-accent/40 group-hover:bg-surface group-hover:scale-105 transition-all shadow-2xs flex items-center justify-center text-fg">
              <HiShare className="w-6 h-6 text-fg-muted group-hover:text-accent transition-colors" />
            </div>
            <span className="text-[11px] font-bold text-fg text-center leading-tight">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
