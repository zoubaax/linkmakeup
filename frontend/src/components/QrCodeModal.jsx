import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { HiXMark, HiArrowDownTray, HiClipboardDocumentCheck } from 'react-icons/hi2';
import { useToast } from '../contexts/ToastContext';
import Logo from './ui/Logo';

export default function QrCodeModal({ profile, publicUrl, onClose }) {
  const { success: toastSuccess, error: toastError } = useToast();
  const qrSvgRef = useRef(null);

  const username = profile?.username || 'user';
  const displayName = profile?.displayName || username;
  const targetUrl = publicUrl || `https://linkmakeup.com/${username}`;

  const downloadQrCode = async () => {
    try {
      const svgElement = qrSvgRef.current?.querySelector('svg');
      if (!svgElement) throw new Error('QR code element not found');

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1024;
      canvas.height = 1024;

      if (!ctx) return;

      // Draw white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, 1024, 1024);

      // Clone SVG and replace image href if needed
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
        link.download = `${username}-qr.png`;
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      toastSuccess('Link copied to clipboard!');
    } catch {
      toastError('Could not copy link');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close modal backdrop"
      />

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-border bg-surface shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between gap-3 mb-4">
          <Logo height={22} />
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors cursor-pointer"
            aria-label="Close QR dialog"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Card Frame */}
        <div
          ref={qrSvgRef}
          className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center mb-5"
        >
          {profile?.avatarUrl && (
            <img
              src={profile.avatarUrl}
              alt="Avatar"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-2xs mb-3"
              referrerPolicy="no-referrer"
            />
          )}
          <QRCodeSVG
            value={targetUrl}
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
          <p className="mt-4 text-xs font-bold text-slate-900">{displayName}</p>
          <p className="text-[10px] font-mono text-slate-500 mt-0.5 truncate max-w-full">
            {targetUrl}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={downloadQrCode}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-fg hover:bg-primary-hover font-bold text-xs shadow-xs transition-transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <HiArrowDownTray className="w-4 h-4" />
            <span>Download PNG QR Code</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 rounded-xl border border-border bg-surface-alt hover:bg-surface-muted font-semibold text-xs text-fg transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <HiClipboardDocumentCheck className="w-4 h-4 text-fg-muted" />
            <span>Copy Page Link</span>
          </button>
        </div>
      </div>
    </div>
  );
}
