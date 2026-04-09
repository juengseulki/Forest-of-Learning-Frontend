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
      return raw ? JSON.parse(raw) : null;
    } catch {
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
  const [now, setNow] = useState(Date.now());

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
  }, [session?.status]);

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
    return Math.floor((plannedEnd - now) / 1000);
  }, [plannedEnd, now]);

  const actualMinutes = useMemo(() => {
    if (!startedTime) return 0;
    return Math.floor(
      (now - startedTime - (session?.totalPausedMs ?? 0)) / 60000
    );
  }, [startedTime, now, session]);

  const mode = diffSeconds >= 0 ? 'COUNTDOWN' : 'OVERTIME';
  const displayTime = formatSeconds(Math.abs(diffSeconds));

  const handleStart = () => {
    const start = new Date();
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

    saveSession(newSession);
    setSession(newSession);
    setMessage('시작!');
  };

  const handlePause = () => {
    const updated = {
      ...session,
      status: TIMER_STATUS.PAUSED,
      pausedAt: new Date().toISOString(),
    };

    saveSession(updated);
    setSession(updated);
  };

  const handleResume = () => {
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
