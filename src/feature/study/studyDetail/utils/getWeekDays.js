import { toKST } from '@/utils/date.js';

export function getWeekDays(weekStart) {
  if (!weekStart) return [];

  const start = toKST(weekStart).startOf('day');

  const weekDays = [];

  for (let i = 0; i < 7; i += 1) {
    const current = start.add(i, 'day');

    weekDays.push(current.format('YYYY-MM-DD'));
  }

  return weekDays;
}
