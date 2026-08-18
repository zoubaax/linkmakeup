export function downloadBlobCsv(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadCsvText(text, filename) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  downloadBlobCsv(blob, filename);
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/** Serializes JSON rows to CSV text (header derived from first row). */
export function rowsToCsv(rows, columns = null) {
  if (!Array.isArray(rows) || rows.length === 0) return '';
  const headerColumns = columns || Object.keys(rows[0]);
  const header = headerColumns.map(escapeCsvValue).join(',');
  const body = rows.map((row) => headerColumns.map((column) => escapeCsvValue(row[column])).join(','));
  return [header, ...body].join('\r\n');
}