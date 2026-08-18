import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  HiQrCode,
  HiPhoto,
  HiCodeBracket,
  HiSquare2Stack,
  HiClipboardDocument,
  HiArrowTopRightOnSquare,
  HiArrowDownTray,
  HiChevronDown,
  HiShare,
  HiCreditCard,
} from 'react-icons/hi2';
import { useToast } from '../contexts/ToastContext';
import { buildEmbedCode, exportPreviewNode } from '../utils/pageExport';
import ExportPreviewCard from './ExportPreviewCard';
import WalletCardModal from './WalletCardModal';
import Logo from './ui/Logo';

function ActionButton({ children, onClick, variant = 'secondary', className = '', disabled = false }) {
  const styles =
    variant === 'primary'
      ? 'bg-primary text-primary-fg hover:bg-primary-hover shadow-xs'
      : 'bg-surface border border-border-strong text-fg hover:bg-nav-hover shadow-2xs';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex w-full sm:w-auto items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export default function LivePageShareBar({ profile, links, publicUrl }) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [exportOpen, setExportOpen] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [exporting, setExporting] = useState('');
  const menuRef = useRef(null);
  const exportRef = useRef(null);
  const qrSvgRef = useRef(null);

  const embedCode = buildEmbedCode({ profile, publicUrl });

  const handleSharePage = async () => {
    const shareTitle = profile?.displayName
      ? profile.role
        ? `${profile.displayName} · ${profile.role}`
        : profile.displayName
      : 'LinkMakeup';

    const shareText = profile?.role
      ? `${profile.role}${profile.bio ? ` — ${profile.bio}` : ''}`
      : profile?.bio || `Check out my bio link page on LinkMakeup`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: publicUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  useEffect(() => {
    if (!exportOpen) return undefined;
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setExportOpen(false);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [exportOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      toastSuccess('Link copied to clipboard');
    } catch {
      toastError('Could not copy link');
    }
  };

  const handleCopyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      toastSuccess('Embed code copied');
    } catch {
      toastError('Could not copy embed code');
    }
  };

  const downloadQrCode = async () => {
    try {
      const svgElement = qrSvgRef.current?.querySelector('svg');
      if (!svgElement) throw new Error('QR code not ready');

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1024;
      canvas.height = 1024;

      if (!ctx) return;

      // Fill white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 1024, 1024);

      // Clone SVG and convert embedded image to Base64 data URL
      const clonedSvg = svgElement.cloneNode(true);
      const svgImage = clonedSvg.querySelector('image');

      let logoDataUrl = null;
      try {
        const logoResp = await fetch('/favicon.svg');
        if (logoResp.ok) {
          const blob = await logoResp.blob();
          logoDataUrl = await new Promise((res) => {
            const r = new FileReader();
            r.onloadend = () => res(r.result);
            r.readAsDataURL(blob);
          });
        }
      } catch (err) {
        console.warn('Could not fetch favicon.svg for QR download:', err);
      }

      if (svgImage && logoDataUrl) {
        svgImage.setAttribute('href', logoDataUrl);
      }

      const svgData = new XMLSerializer().serializeToString(clonedSvg);
      const qrImg = new Image();

      qrImg.onload = () => {
        ctx.drawImage(qrImg, 112, 112, 800, 800);
        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${profile?.username || 'linkmakeup'}-qr.png`;
        link.href = pngUrl;
        link.click();
        toastSuccess('QR Code downloaded as PNG');
      };

      qrImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
    } catch (err) {
      console.error('QR download error:', err);
      toastError(err.message || 'Failed to download QR code');
    }
  };

  const runExport = async (type) => {
    setExportOpen(false);
    if (type === 'qr') {
      setQrOpen(true);
      return;
    }
    if (type === 'embed') {
      setEmbedOpen(true);
      return;
    }

    setExporting(type);
    try {
      await exportPreviewNode(exportRef.current, {
        format: type,
        filenameBase: `${profile?.username || 'page'}-linkmakeup`,
      });
      toastSuccess(`${type.toUpperCase()} downloaded`);
    } catch (err) {
      toastError(err.message || 'Export failed');
    } finally {
      setExporting('');
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed left-[-10000px] top-0 pointer-events-none"
      >
        <ExportPreviewCard ref={exportRef} profile={profile} links={links} />
      </div>

      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-surface border border-border/80 shadow-2xs">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Left: Live Page Info & Sleek URL Pill */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              {/* Pulsing Live Badge */}
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Live Bio Page
              </span>
            </div>

            {/* Sleek URL Pill */}
            <div className="inline-flex items-center gap-2 max-w-full p-1.5 pl-3.5 pr-2 rounded-xl bg-surface-alt border border-border/80 shadow-2xs group hover:border-accent/40 transition-colors">
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs sm:text-sm font-bold text-fg hover:text-accent transition-colors truncate"
              >
                {publicUrl}
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                title="Copy URL"
                className="p-1.5 rounded-lg text-fg-muted hover:text-fg hover:bg-surface transition-colors shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
            <ActionButton variant="primary" onClick={handleSharePage}>
              <HiShare className="w-4 h-4 shrink-0" />
              Share page
            </ActionButton>

            {/* Wallet Pass Button */}
            <ActionButton onClick={() => setWalletOpen(true)}>
              <HiCreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              Wallet Pass
            </ActionButton>

            {/* Quick QR Code Button */}
            <ActionButton onClick={() => setQrOpen(true)}>
              <HiQrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              QR Code
            </ActionButton>

            <ActionButton onClick={handleCopyLink}>
              <HiClipboardDocument className="w-4 h-4 shrink-0 text-fg-muted" />
              Copy link
            </ActionButton>

            <ActionButton onClick={() => window.open(publicUrl, '_blank', 'noopener,noreferrer')}>
              <HiArrowTopRightOnSquare className="w-4 h-4 shrink-0 text-fg-muted" />
              Visit page
            </ActionButton>

            <div className="relative" ref={menuRef}>
              <ActionButton onClick={() => setExportOpen((open) => !open)} className="min-w-[7.5rem]" disabled={Boolean(exporting)}>
                <HiArrowDownTray className="w-4 h-4 shrink-0 text-fg-muted" />
                {exporting ? 'Exporting…' : 'Export'}
                <HiChevronDown className={`w-3.5 h-3.5 transition-transform shrink-0 ${exportOpen ? 'rotate-180' : ''}`} />
              </ActionButton>

              {exportOpen && (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-60 rounded-2xl border border-border bg-surface shadow-xl p-1.5 animate-scale-in">
                  <button type="button" onClick={() => runExport('qr')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-nav-hover transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <HiQrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-fg">QR Code</span>
                      <span className="block text-[10px] text-fg-subtle">Scan or download PNG</span>
                    </div>
                  </button>

                  <button type="button" onClick={() => runExport('png')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-nav-hover transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      <HiPhoto className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-fg">PNG image</span>
                      <span className="block text-[10px] text-fg-subtle">Live preview capture</span>
                    </div>
                  </button>

                  <button type="button" onClick={() => runExport('svg')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-nav-hover transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                      <HiSquare2Stack className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-fg">SVG vector</span>
                      <span className="block text-[10px] text-fg-subtle">Clickable links included</span>
                    </div>
                  </button>

                  <button type="button" onClick={() => runExport('embed')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-nav-hover transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
                      <HiCodeBracket className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-fg">Embed code</span>
                      <span className="block text-[10px] text-fg-subtle">Iframe + copyright line</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal Dialog */}
      {qrOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-overlay"
            aria-label="Close QR Code modal"
            onClick={() => setQrOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="QR Code"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-sm rounded-3xl border border-border bg-surface shadow-2xl p-6 text-center animate-scale-in">
              <div className="flex items-center justify-between gap-3 mb-4">
                <Logo height={22} />
                <button type="button" onClick={() => setQrOpen(false)} className="p-1.5 rounded-full text-fg-muted hover:text-fg hover:bg-nav-hover">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* QR Code Card Frame */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center mb-5" ref={qrSvgRef}>
                {profile?.avatarUrl && (
                  <img
                    src={profile.avatarUrl}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs mb-3"
                    referrerPolicy="no-referrer"
                  />
                )}
                <QRCodeSVG
                  value={publicUrl}
                  size={200}
                  level="H"
                  marginSize={1}
                  fgColor="#0F172A"
                  bgColor="#FFFFFF"
                  imageSettings={{
                    src: '/favicon.svg',
                    height: 38,
                    width: 38,
                    excavate: true,
                  }}
                />
                <p className="mt-4 text-xs font-bold text-slate-900">{profile?.displayName || 'LinkMakeup'}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-0.5">{publicUrl}</p>
              </div>

              {/* QR Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={downloadQrCode}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-xs shadow-xs transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PNG QR Code
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2.5 px-4 rounded-xl border border-border bg-surface-alt hover:bg-nav-hover font-semibold text-xs text-fg transition-colors"
                >
                  Copy Page Link
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Embed Code Modal Dialog */}
      {embedOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-overlay"
            aria-label="Close embed dialog"
            onClick={() => setEmbedOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Embed your page"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg rounded-3xl border border-border bg-surface shadow-2xl p-5 animate-scale-in">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-bold text-fg">Embed your page</h3>
                  <p className="text-xs text-fg-subtle mt-1">Paste this on your site. Includes a copyright line below the iframe.</p>
                </div>
                <button type="button" onClick={() => setEmbedOpen(false)} className="p-2 rounded-full text-fg-muted hover:text-fg hover:bg-nav-hover">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <pre className="max-h-56 overflow-auto rounded-2xl bg-surface-alt border border-border p-3 text-[11px] leading-relaxed text-fg-muted whitespace-pre-wrap break-all">
                {embedCode}
              </pre>
              <div className="mt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setEmbedOpen(false)} className="px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-fg-muted hover:bg-nav-hover">
                  Close
                </button>
                <button type="button" onClick={handleCopyEmbed} className="px-4 py-2.5 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover text-sm font-bold">
                  Copy embed code
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Wallet Pass Modal */}
      {walletOpen && (
        <WalletCardModal
          profile={profile}
          publicUrl={publicUrl}
          onClose={() => setWalletOpen(false)}
        />
      )}
    </>
  );
}
