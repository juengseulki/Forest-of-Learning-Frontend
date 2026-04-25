import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

const KST_TIMEZONE = 'Asia/Seoul';

/**
 * KST 기준 dayjs 객체로 변환
 */
export function toKST(dateInput = new Date()) {
  return dayjs(dateInput).tz(KST_TIMEZONE);
}

/**
 * 날짜만 표시
 * 예: 2026-04-25
 */
export function formatDateKST(dateInput) {
  if (!dateInput) return '';

  return toKST(dateInput).format('YYYY-MM-DD');
}

/**
 * 날짜 + 시간 표시
 * 예: 2026-04-25 오전 12:00
 */
export function formatDateTimeKST(dateInput) {
  if (!dateInput) return '';

  return toKST(dateInput).format('YYYY-MM-DD A h:mm');
}

/**
 * 이번 주 범위 계산
 * 월요일 시작 ~ 일요일 끝
 */
export function getThisWeekRange(baseDate = new Date()) {
  const current = toKST(baseDate);

  const day = current.day(); // 일요일 0, 월요일 1
  const daysToMonday = day === 0 ? 6 : day - 1;

  const monday = current.subtract(daysToMonday, 'day').startOf('day');
  const sunday = monday.add(6, 'day').endOf('day');

  return {
    weekStartDate: monday.toDate(),
    startDate: monday.format('YYYY-MM-DD'),
    endDate: sunday.format('YYYY-MM-DD'),
  };
}
