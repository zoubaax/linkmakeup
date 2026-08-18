function escapeCsvValue(value) {
  if (value === null || value === undefined) return '';
  const stringValue = value instanceof Date ? value.toISOString() : String(value);
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Serializes an array of objects to CSV text. The column list is derived from
 * the keys of the first row (or explicitly provided via `columns`).
 */
export function toCsv(rows, columns = null) {
  if (!Array.isArray(rows) || rows.length === 0) return '';

  const headerColumns = columns || Object.keys(rows[0]);

  const header = headerColumns.map(escapeCsvValue).join(',');
  const body = rows.map((row) => headerColumns.map((column) => escapeCsvValue(row[column])).join(','));

  return [header, ...body].join('\r\n');
}

/** Sends rows as an attachment CSV response. */
export function sendCsv(res, filename, rows, columns = null) {
  const csv = toCsv(rows, columns);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
}