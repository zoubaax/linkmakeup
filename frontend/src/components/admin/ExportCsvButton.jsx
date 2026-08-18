<<<<<<< Updated upstream
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { downloadCsv } from './csv';

export default function ExportCsvButton({ filename, columns, fetchRows, label = 'Export CSV' }) {
  const [exporting, setExporting] = useState(false);
  const { success, error } = useToast();

  const handleExport = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const rows = await fetchRows();
      if (!rows || rows.length === 0) {
        error('Nothing to export for the current filters.');
        return;
      }
      downloadCsv({ filename, columns, rows });
      success(`Exported ${rows.length} row${rows.length === 1 ? '' : 's'}.`);
    } catch (err) {
      error(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  };
=======
import { useState, useCallback } from 'react';
import { HiArrowDownTray } from 'react-icons/hi2';
import { useToast } from '../../contexts/ToastContext';
import { downloadBlobCsv } from '../../utils/csv';

export default function ExportCsvButton({
  fetcher,
  filename,
  label = 'Export CSV',
  className = '',
  disabled = false,
}) {
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  const handleExport = useCallback(async () => {
    if (!fetcher) return;
    setExporting(true);
    try {
      const blob = await fetcher();
      downloadBlobCsv(blob, filename);
      toast.success(`Exported to ${filename}`);
    } catch (err) {
      toast.error(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  }, [fetcher, filename, toast]);
>>>>>>> Stashed changes

  return (
    <button
      type="button"
<<<<<<< Updated upstream
      disabled={exporting}
      onClick={handleExport}
      className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-colors disabled:opacity-50"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {exporting ? 'Exporting…' : label}
    </button>
  );
}
=======
      onClick={handleExport}
      disabled={exporting || disabled}
      className={`inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-all disabled:opacity-60 active:scale-95 ${className}`}
    >
      <HiArrowDownTray className={`w-3.5 h-3.5 shrink-0 ${exporting ? 'animate-bounce' : ''}`} />
      <span>{exporting ? 'Exporting…' : label}</span>
    </button>
  );
}
>>>>>>> Stashed changes
