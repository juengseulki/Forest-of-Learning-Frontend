export function getWeekDays(weekStart) {
  if (!weekStart) return [];

  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0);

  const weekDays = [];

  for (let i = 0; i < 7; i += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + i);
    current.setHours(0, 0, 0, 0);

    const year = current.getFullYear();
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const day = String(current.getDate()).padStart(2, '0');

    weekDays.push(`${year}-${month}-${day}`);
  }

  return weekDays;
}
