import { useEffect, useMemo, useState } from 'react';
import { useFocusPoint } from './useFocusPoint';
import { TIMER_STATUS } from '../utils/focusConstants';
import { completeFocus } from '../../../api/focus/focusApi';
import handleApiError from '../../../utils/handleApiError.jsx';
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

export function useFocusTimer(studyId, onSessionComplete) {
  const { calculateFirstReward, calculateFinalReward } = useFocusPoint();

  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const [session, setSession] = useState(() => getStoredSession());
  const [message, setMessage] = useState('');
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

    if (Number(value) > 59) {
      setSeconds('59');
      return;
    }

    setSeconds(value);
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

        // 이미 보상 저장된 경우 → 중복 방지
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
          totalPoint: reward.basePoint + reward.targetBonusPoint,
        };

        saveStoredSession(updated);
        setMessage('기준 시간 도달!');

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
    return getDiffSeconds(plannedEnd, effectiveNow);
  }, [plannedEnd, effectiveNow]);

  const actualMinutes = useMemo(() => {
    return getActualMinutes(
      startedTime,
      effectiveNow,
      session?.totalPausedMs ?? 0
    );
  }, [startedTime, effectiveNow, session]);

  const mode = diffSeconds >= 0 ? 'COUNTDOWN' : 'OVERTIME';
  const displayTime = formatSeconds(Math.abs(diffSeconds));

  const isRunning = session?.status === TIMER_STATUS.RUNNING;
  const isPaused = session?.status === TIMER_STATUS.PAUSED;
  const isCompleted = session?.status === TIMER_STATUS.COMPLETED;
  const isOvertime = isRunning && mode === 'OVERTIME';

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
      totalPausedMs: session.totalPausedMs + pausedMs,
      plannedEndAt: new Date(
        new Date(session.plannedEndAt).getTime() + pausedMs
      ).toISOString(),
    };

    setNow(currentNow);
    saveStoredSession(updated);
    setSession(updated);
  };

  const handleFinish = async () => {
    if (!session) return;

    const sessionPayload = {
      durationMinutes: Math.floor(session.durationSeconds / 60),
      durationSeconds: session.durationSeconds % 60,
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
    setMessage('집중 종료!');

    if (studyId) {
      try {
        const result = await completeFocus(studyId, {
          sessionData: sessionPayload,
        });

        setMessage('포인트가 추가되었습니다!');
        onSessionComplete?.(result);
      } catch (err) {
        handleApiError(err, '집중 세션 저장에 실패했습니다.');
        setMessage('포인트 반영 실패');
      }
    }
  };

  const handleReset = () => {
    clearStoredSession();
    setSession(null);
    setMessage('');
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
    message,
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

    TIMER_STATUS,
  };
}
