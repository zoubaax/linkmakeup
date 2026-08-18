export function localDayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toDayKey(value) {
  if (!value) return '';
  if (value instanceof Date) {
    return localDayKey(value);
  }
  return String(value).slice(0, 10);
}

/**
 * Builds a dense day-by-day series of a grouped count query,
 * filling missing days with zero counts.
 * @param {Array<{day:string|Date, [countKey]:number}>} rows
 * @param {number} days
 */
export function buildDayTrend(rows, days, { countKey = 'count' } = {}) {
  const countsByDay = new Map(rows.map((row) => [toDayKey(row.day), row[countKey]]));

  const trend = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const key = localDayKey(day);
    trend.push({ date: key, count: countsByDay.get(key) ?? 0 });
  }

  return trend;
}

/**
 * Builds a dense day-by-day series of a grouped query that already produced
 * `{ day, views, clicks }` buckets, filling missing days with zeros.
 */
export function buildDaySeries(rows, days) {
  const byDay = new Map(rows.map((row) => [toDayKey(row.day), row]));

  const trend = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const day = new Date(today);
    day.setDate(today.getDate() - offset);
    const key = localDayKey(day);
    const bucket = byDay.get(key);
    trend.push({
      date: key,
      views: bucket?.views ?? 0,
      clicks: bucket?.clicks ?? 0,
    });
  }

  return trend;
}