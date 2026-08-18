function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  let string = String(value);
  if (/^[=+\-@]/.test(string) && !/^-?\d+(\.\d+)?$/.test(string)) {
    string = `'${string}`;
  }
  if (/[",\n\r]/.test(string)) {
    string = `"${string.replace(/"/g, '""')}"`;
  }
  return string;
}

export function downloadCsv({ filename, columns, rows }) {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(',');
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsvValue(row[column.key])).join(','));
  const csv = [header, ...lines].join('\n');

  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
