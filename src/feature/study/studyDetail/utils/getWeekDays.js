export function getWeekDays(weekStart) {
  if (!weekStart) return [];

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return date.toISOString().split('T')[0];
  });
}
