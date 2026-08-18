import { useState, useCallback } from 'react';
import { HiArrowDownTray } from 'react-icons/hi2';
import { useToast } from '../../contexts/ToastContext';
import { downloadBlobCsv } from '../../utils/csv';
import { downloadCsv } from './csv';

export default function ExportCsvButton({
  fetcher,
  fetchRows,
  filename,
  columns,
  label = 'Export CSV',
  className = '',
  disabled = false,
}) {
  const [exporting, setExporting] = useState(false);
  const toast = useToast();

  const handleExport = useCallback(async () => {
    if (exporting) return;
    setExporting(true);
    try {
      if (fetcher) {
        const blob = await fetcher();
        downloadBlobCsv(blob, filename);
        if (toast?.success) toast.success(`Exported CSV successfully`);
        return;
      }

      if (fetchRows) {
        const rows = await fetchRows();
        if (!rows || rows.length === 0) {
          if (toast?.error) toast.error('Nothing to export for the current filters.');
          return;
        }
        downloadCsv({ filename: filename || 'export.csv', columns, rows });
        if (toast?.success) toast.success(`Exported ${rows.length} rows.`);
      }
    } catch (err) {
      if (toast?.error) toast.error(err.message || 'Export failed');
    } finally {
      setExporting(false);
    }
  }, [fetcher, fetchRows, filename, columns, toast, exporting]);

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting || disabled}
      className={`inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-1.5 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-surface-alt transition-all disabled:opacity-60 active:scale-95 ${className}`}
    >
      <HiArrowDownTray className={`w-3.5 h-3.5 shrink-0 ${exporting ? 'animate-bounce' : ''}`} />
      <span>{exporting ? 'Exporting…' : label}</span>
    </button>
  );
}
