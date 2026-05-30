/**
 * Маппит конкретное время (HH:MM) на категорию времени суток.
 * Используется для dresscodes.js и lookTrends.js.
 *
 * 07:00–11:59 → morning
 * 12:00–16:59 → afternoon
 * 17:00–21:59 → evening
 * 22:00–06:59 → night
 */
export function mapTimeToCategory(timeStr) {
  if (!timeStr) return 'evening';
  const [h] = timeStr.split(':').map(Number);
  if (h >= 7 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 22) return 'evening';
  return 'night';
}
