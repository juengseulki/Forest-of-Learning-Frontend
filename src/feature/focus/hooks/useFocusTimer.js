import { useEffect, useMemo, useState } from 'react';
import { TIMER_STATUS } from '../utils/focusConstants.js';
import {
  clearStoredSession,
  getStoredSession,
  saveStoredSession,
} from '../utils/focusSessionStorage';
import {
  createSessionTimes,
  formatSeconds,
  getActualMinutes,
  getDiffSeconds,
} from '../utils/focusTime';
import { calculateFirstReward } from '../utils/focusReward.js';

export function useFocusTimer() {
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const [session, setSession] = useState(() => getStoredSession());
  const [now, setNow] = useState(() => Date.now());

  const totalSeconds = useMemo(() => {
    return Number(minutes || 0) * 60 + Number(seconds || 0);
  }, [minutes, seconds]);

  const handleMinutesChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMinutes(value);
  };

  const handleSecondsChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2);
    setSeconds(Number(value) > 59 ? '59' : value);
  };

  const handleBlurMinutes = () => {
    setMinutes((prev) => String(Number(prev || 0)).padStart(2, '0'));
  };

  const handleBlurSeconds = () => {
    setSeconds((prev) => {
      const safe = Math.min(Number(prev || 0), 59);
      return String(safe).padStart(2, '0');
    });
  };

  const displayDuration = useMemo(() => {
    if (!session) return '';

    const totalDurationSeconds =
      (session.durationMinutes ?? 0) * 60 + (session.durationSeconds ?? 0);

    return formatSeconds(totalDurationSeconds);
  }, [session]);

  useEffect(() => {
    if (!session || session.status !== TIMER_STATUS.RUNNING) return;

    const timer = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);

      setSession((prev) => {
        if (!prev || prev.status !== TIMER_STATUS.RUNNING) return prev;
        if (prev.firstSaved) return prev;

        const totalPausedMs = prev.totalPausedMs ?? 0;
        const realElapsedMinutes = Math.floor(
          (currentNow - new Date(prev.startedAt).getTime() - totalPausedMs) /
            60000
        );

        if (realElapsedMinutes < prev.durationMinutes) return prev;

        const reward = calculateFirstReward(prev.durationMinutes);

        const updated = {
          ...prev,
          firstSaved: true,
          basePoint: reward.basePoint,
          targetBonusPoint: reward.targetBonusPoint,
          totalPoint: reward.firstRewardPoint,
        };

        saveStoredSession(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.status]);

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
    return getDiffSeconds(plannedEnd, effectiveNow);
  }, [plannedEnd, effectiveNow]);

  const actualMinutes = useMemo(() => {
    return getActualMinutes(
      startedTime,
      effectiveNow,
      session?.totalPausedMs ?? 0
    );
  }, [startedTime, effectiveNow, session?.totalPausedMs]);

  const mode = diffSeconds >= 0 ? 'COUNTDOWN' : 'OVERTIME';
  const displayTime = formatSeconds(Math.abs(diffSeconds));

  const isRunning = session?.status === TIMER_STATUS.RUNNING;
  const isPaused = session?.status === TIMER_STATUS.PAUSED;
  const isCompleted = session?.status === TIMER_STATUS.COMPLETED;
  const isOvertime = (isRunning || isPaused) && mode === 'OVERTIME';

  const handleStart = () => {
    if (totalSeconds === 0) return;

    clearStoredSession();

    const { start, end } = createSessionTimes(totalSeconds);

    const newSession = {
      durationMinutes: Math.floor(totalSeconds / 60),
      durationSeconds: totalSeconds % 60,
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
    saveStoredSession(newSession);
    setSession(newSession);
  };

  const handlePause = () => {
    if (!session) return;

    const updated = {
      ...session,
      status: TIMER_STATUS.PAUSED,
      pausedAt: new Date().toISOString(),
    };

    setNow(Date.now());
    saveStoredSession(updated);
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
      totalPausedMs: (session.totalPausedMs ?? 0) + pausedMs,
      plannedEndAt: new Date(
        new Date(session.plannedEndAt).getTime() + pausedMs
      ).toISOString(),
    };

    setNow(currentNow);
    saveStoredSession(updated);
    setSession(updated);
  };

  const handleFinish = () => {
    if (!session) return null;

    const sessionPayload = {
      durationMinutes: session.durationMinutes,
      durationSeconds: session.durationSeconds,
      totalTargetSeconds:
        session.durationMinutes * 60 + session.durationSeconds,
      startedAt: session.startedAt,
      totalPausedMs: session.totalPausedMs || 0,
    };

    const updated = {
      ...session,
      status: TIMER_STATUS.COMPLETED,
    };

    saveStoredSession(updated);
    setSession(updated);

    return sessionPayload;
  };

  const handleReset = () => {
    clearStoredSession();
    setSession(null);
    setNow(Date.now());
    setMinutes('00');
    setSeconds('00');
  };

  return {
    minutes,
    seconds,
    totalSeconds,
    handleMinutesChange,
    handleSecondsChange,
    handleBlurMinutes,
    handleBlurSeconds,

    session,
    mode,
    displayTime,
    displayDuration,
    actualMinutes,
    isRunning,
    isPaused,
    isCompleted,
    isOvertime,

    handleStart,
    handlePause,
    handleResume,
    handleFinish,
    handleReset,
  };
}
