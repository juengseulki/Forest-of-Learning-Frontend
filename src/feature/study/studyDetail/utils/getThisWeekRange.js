function formatLocalDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

export function getThisWeekRange(baseDate = new Date()) {
  const current = new Date(baseDate);
  const day = current.getDay();

  const daysToMonday = day === 0 ? 6 : day - 1;

  const monday = new Date(current);
  monday.setDate(current.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  return {
    weekStartDate: monday,
    startDate: formatLocalDateTime(monday),
    endDate: formatLocalDateTime(sunday),
  };
}
