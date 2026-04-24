import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

export function formatHabitTime(currentTime) {
  if (!currentTime) return '';

  return dayjs(currentTime).format('YYYY-MM-DD A h:mm');
}
