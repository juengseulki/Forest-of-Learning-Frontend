// 시간 포맷 함수
export function formatHabitTime(currentTime) {
  if (!currentTime) return '';

  const now = new Date(currentTime);

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const isPm = now.getHours() >= 12;
  const period = isPm ? '오후' : '오전';
  const hour = ((now.getHours() + 11) % 12) + 1;
  const minute = String(now.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${date} ${period} ${hour}:${minute}`;
}
