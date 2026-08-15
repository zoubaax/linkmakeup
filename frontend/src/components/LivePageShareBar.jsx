import { useEffect, useRef, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { buildEmbedCode, exportPreviewNode } from '../utils/pageExport';
import ExportPreviewCard from './ExportPreviewCard';

function ActionButton({ children, onClick, variant = 'secondary', className = '', disabled = false }) {
  const styles =
    variant === 'primary'
      ? 'bg-primary text-primary-fg hover:bg-primary-hover'
      : 'bg-surface border border-border-strong text-fg hover:bg-nav-hover';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex w-full sm:w-auto items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export default function LivePageShareBar({ profile, links, publicUrl }) {
  const { success: toastSuccess, error: toastError } = useToast();
  const [exportOpen, setExportOpen] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [exporting, setExporting] = useState('');
  const menuRef = useRef(null);
  const exportRef = useRef(null);

  const embedCode = buildEmbedCode({ profile, publicUrl });

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

  const runExport = async (type) => {
    setExportOpen(false);
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

      <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-1">Your live page</p>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm sm:text-lg font-bold text-fg underline underline-offset-2 decoration-border-strong hover:decoration-accent transition-all break-all"
            >
              {publicUrl}
            </a>
            <p className="text-[11px] text-fg-subtle mt-1.5">Share your page or export a preview with a copyright line.</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
            <ActionButton onClick={handleCopyLink}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy link
            </ActionButton>

            <ActionButton variant="primary" onClick={() => window.open(publicUrl, '_blank', 'noopener,noreferrer')}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit
            </ActionButton>

            <div className="relative" ref={menuRef}>
              <ActionButton onClick={() => setExportOpen((open) => !open)} className="min-w-[7.5rem]" disabled={Boolean(exporting)}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {exporting ? 'Exporting…' : 'Export'}
                <svg className={`w-3.5 h-3.5 transition-transform ${exportOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </ActionButton>

              {exportOpen && (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-56 rounded-2xl border border-border bg-surface shadow-xl p-1.5 animate-scale-in">
                  <button type="button" onClick={() => runExport('png')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-nav-hover transition-colors">
                    <span className="block text-sm font-semibold text-fg">PNG image</span>
                    <span className="block text-[11px] text-fg-subtle">Live preview capture</span>
                  </button>
                  <button type="button" onClick={() => runExport('svg')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-nav-hover transition-colors">
                    <span className="block text-sm font-semibold text-fg">SVG vector</span>
                    <span className="block text-[11px] text-fg-subtle">Clickable links included</span>
                  </button>
                  <button type="button" onClick={() => runExport('embed')} className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-nav-hover transition-colors">
                    <span className="block text-sm font-semibold text-fg">Embed code</span>
                    <span className="block text-[11px] text-fg-subtle">Iframe + copyright line</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
    </>
  );
}
