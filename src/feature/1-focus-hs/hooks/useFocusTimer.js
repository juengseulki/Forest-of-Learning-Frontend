import { useState, useEffect, useMemo, useRef } from 'react';
import { useFocusPoint } from './useFocusPoint';

const TIMER_STATUS = {
  RUNNING: 1,
  PAUSED: 2,
  COMPLETED: 3,
};

export function useFocusTimer() {
  const STORAGE_KEY = 'focus-session-test';

  const { calculateFirstReward, calculateFinalReward } = useFocusPoint();

  function getStoredSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;

      if (!parsed) return null;

      // 수정: 완료된 세션은 다시 불러오지 않도록 정리
      if (parsed.status === TIMER_STATUS.COMPLETED) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      // 수정: 너무 오래된 세션은 비정상 복원 방지를 위해 제거
      const startedAt = new Date(parsed.startedAt).getTime();
      const now = Date.now();
      const diffHours = (now - startedAt) / (1000 * 60 * 60);

      if (diffHours > 6) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return parsed;
    } catch {
      // 수정: 파싱 에러가 나면 저장값 자체를 정리
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  function saveSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function formatSeconds(totalSeconds) {
    const safe = Math.max(0, totalSeconds);
    const minutes = String(Math.floor(safe / 60)).padStart(2, '0');
    const seconds = String(safe % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  const [durationMinutes, setDurationMinutes] = useState(1);
  const [session, setSession] = useState(() => getStoredSession());
  const [message, setMessage] = useState('');
  // 수정: 현재 시각은 초기 렌더에서 한 번만 계산되도록 함수 형태로 전달
  const [now, setNow] = useState(() => Date.now());

  const savingRef = useRef(false);

  useEffect(() => {
    if (!session || session.status !== TIMER_STATUS.RUNNING) return;

    const timer = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);

      setSession((prev) => {
        if (!prev || prev.status !== TIMER_STATUS.RUNNING) return prev;
        if (prev.firstSaved || savingRef.current) return prev;

        const totalPausedMs = prev.totalPausedMs ?? 0;
        const realElapsedMinutes = Math.floor(
          (currentNow - new Date(prev.startedAt).getTime() - totalPausedMs) /
            60000
        );

        if (realElapsedMinutes < prev.durationMinutes) return prev;

        savingRef.current = true;

        const reward = calculateFirstReward(prev.durationMinutes);

        const updated = {
          ...prev,
          firstSaved: true,
          basePoint: reward.basePoint,
          targetBonusPoint: reward.targetBonusPoint,
          totalPoint: reward.basePoint + reward.targetBonusPoint,
        };

        saveSession(updated);
        setMessage('기준 시간 도달!');

        savingRef.current = false;

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.status, calculateFirstReward]);

  const effectiveNow = useMemo(() => {
    if (!session) return now;

    if (session.status === TIMER_STATUS.PAUSED && session.pausedAt) {
      return new Date(session.pausedAt).getTime();
    }

    return now;
  }, [session, now]);

  const plannedEnd = useMemo(() => {
    if (!session) return null;
    return new Date(session.plannedEndAt).getTime();
  }, [session]);

  const startedTime = useMemo(() => {
    if (!session) return null;
    return new Date(session.startedAt).getTime();
  }, [session]);

  const diffSeconds = useMemo(() => {
    if (!plannedEnd) return 0;
    return Math.round((plannedEnd - effectiveNow) / 1000);
  }, [plannedEnd, effectiveNow]);

  const actualMinutes = useMemo(() => {
    if (!startedTime) return 0;

    return Math.round(
      (effectiveNow - startedTime - (session?.totalPausedMs ?? 0)) / 60000
    );
  }, [startedTime, effectiveNow, session]);

  const mode = diffSeconds >= 0 ? 'COUNTDOWN' : 'OVERTIME';
  const displayTime = formatSeconds(Math.abs(diffSeconds));

  const handleStart = () => {
    // 수정: 새로 시작할 때 이전 테스트 세션 흔적을 먼저 정리
    clearSession();

    const start = new Date(Math.floor(Date.now() / 1000) * 1000);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    const newSession = {
      durationMinutes,
      startedAt: start.toISOString(),
      plannedEndAt: end.toISOString(),
      status: TIMER_STATUS.RUNNING,
      firstSaved: false,
      basePoint: 0,
      targetBonusPoint: 0,
      overtimePoint: 0,
      totalPoint: 0,
      totalPausedMs: 0,
      pausedAt: null,
    };

    setNow(start.getTime());
    saveSession(newSession);
    setSession(newSession);
    setMessage('시작!');
  };

  const handlePause = () => {
    if (!session) return;

    const updated = {
      ...session,
      status: TIMER_STATUS.PAUSED,
      pausedAt: new Date().toISOString(),
    };

    setNow(Date.now());
    saveSession(updated);
    setSession(updated);
  };

  const handleResume = () => {
    if (!session || !session.pausedAt) return;

    const currentNow = Date.now();
    const pausedMs = currentNow - new Date(session.pausedAt).getTime();

    const updated = {
      ...session,
      status: TIMER_STATUS.RUNNING,
      pausedAt: null,
      totalPausedMs: session.totalPausedMs + pausedMs,
      plannedEndAt: new Date(
        new Date(session.plannedEndAt).getTime() + pausedMs
      ).toISOString(),
    };

    setNow(currentNow);
    saveSession(updated);
    setSession(updated);
  };

  const handleFinish = () => {
    if (!session) return;

    const actual = actualMinutes;
    const finalReward = calculateFinalReward(session.durationMinutes, actual);

    const updated = {
      ...session,
      status: TIMER_STATUS.COMPLETED,
      overtimePoint: finalReward.overtimePoint,
      totalPoint:
        session.basePoint +
        session.targetBonusPoint +
        finalReward.overtimePoint,
    };

    saveSession(updated);
    setSession(updated);
  };

  const handleReset = () => {
    clearSession();
    setSession(null);
    setMessage('');
    // 수정: reset 직후 타이머 기준 시각도 현재로 다시 맞춤
    setNow(Date.now());
  };

  return {
    session,
    message,
    durationMinutes,
    setDurationMinutes,
    displayTime,
    mode,
    actualMinutes,
    handleStart,
    handlePause,
    handleResume,
    handleFinish,
    handleReset,
    TIMER_STATUS,
  };
}
