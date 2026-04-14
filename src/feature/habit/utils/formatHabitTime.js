export function formatHabitTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const period = hours < 12 ? '오전' : '오후';

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  return `${year}-${month}-${day} ${period} ${hours}:${minutes}`;
}
