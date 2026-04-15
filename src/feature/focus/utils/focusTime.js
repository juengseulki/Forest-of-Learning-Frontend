// 초를 MM:SS 형식으로 변환
export function formatSeconds(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const minutes = String(Math.floor(safe / 60)).padStart(2, '0');
  const seconds = String(safe % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// 시작 시각과 종료 시각 생성
export function createSessionTimes(durationSeconds) {
  const start = new Date();
  const end = new Date(start.getTime() + durationSeconds * 1000);

  return {
    start,
    end,
  };
}

// 현재 시각 기준 남은 초 계산
export function getDiffSeconds(plannedEndAt, effectiveNow) {
  if (!plannedEndAt) return 0;
  return Math.round((plannedEndAt - effectiveNow) / 1000);
}

// 실제 공부한 분 계산
export function getActualMinutes(startedTime, effectiveNow, totalPausedMs = 0) {
  if (!startedTime) return 0;

  return Math.round((effectiveNow - startedTime - totalPausedMs) / 60000);
}
