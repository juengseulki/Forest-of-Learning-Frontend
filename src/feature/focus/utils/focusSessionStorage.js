import { FOCUS_STORAGE_KEY, TIMER_STATUS } from './focusConstants.js';

// localStorage에서 세션을 읽어오는 함수
export function getStoredSession() {
  try {
    const raw = localStorage.getItem(FOCUS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;

    if (!parsed) return null;

    // 완료된 세션은 다시 복원하지 않음
    if (parsed.status === TIMER_STATUS.COMPLETED) {
      localStorage.removeItem(FOCUS_STORAGE_KEY);
      return null;
    }

    // 너무 오래된 세션은 비정상 복원 방지용으로 제거
    const startedAt = new Date(parsed.startedAt).getTime();
    const now = Date.now();
    const diffHours = (now - startedAt) / (1000 * 60 * 60);

    if (diffHours > 6) {
      localStorage.removeItem(FOCUS_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(FOCUS_STORAGE_KEY);
    return null;
  }
}

// 세션 저장
export function saveStoredSession(session) {
  localStorage.setItem(FOCUS_STORAGE_KEY, JSON.stringify(session));
}

// 세션 제거
export function clearStoredSession() {
  localStorage.removeItem(FOCUS_STORAGE_KEY);
}
