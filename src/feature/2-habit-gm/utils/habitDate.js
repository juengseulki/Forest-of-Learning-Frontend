import { format, eachDayOfInterval, parseISO, isToday } from 'date-fns';
import { ko } from "date-fns/locale/ko";

// Date → "yyyy-MM-dd" 문자열
export function toDateString(date) {
  return format(date, 'yyyy-MM-dd');
}

// 오늘 날짜 문자열
export function getTodayString() {
  return toDateString(new Date());
}

// 두 날짜 사이 날짜 배열 반환
export function getDateRange(startDate, endDate) {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;

  return eachDayOfInterval({ start, end }).map((date) => ({
    date,
    dateString: toDateString(date),
    label: format(date, 'M/d', { locale: ko }),
    isToday: isToday(date),
  }));
}

// 이번 주 날짜 범위 반환 (월 ~ 일)
export function getCurrentWeekRange() {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    startDate: toDateString(monday),
    endDate: toDateString(sunday),
  };
}

// "2025년 7월 1일 (화)" 형식으로 변환
export function formatDisplayDate(dateString) {
  return format(parseISO(dateString), 'yyyy년 M월 d일 (E)', { locale: ko });
}