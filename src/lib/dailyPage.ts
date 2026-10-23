const TIME_ZONE = 'Europe/Kyiv';

/** Whole days since 1970-01-01 for the calendar date in Kyiv, so the pick changes at Kyiv midnight. */
export function kyivDayNumber(now: Date = new Date()): number {
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  const [y, m, d] = ymd.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

/**
 * Page (1-based, newest first) holding today's testimony.
 * Walks the testimonies oldest -> newest, one per day, then starts over. The order is fixed
 * by position from the oldest, so the pick for a day only changes when a testimony is added.
 */
export function dailyPage(totalItems: number, itemsPerPage: number, now: Date = new Date()): number {
  if (totalItems <= 0) return 1;
  const oldestFirstIndex = kyivDayNumber(now) % totalItems;
  const newestFirstOffset = totalItems - 1 - oldestFirstIndex;
  return Math.floor(newestFirstOffset / itemsPerPage) + 1;
}
