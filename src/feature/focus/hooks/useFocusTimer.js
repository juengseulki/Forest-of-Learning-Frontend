import { useEffect, useMemo, useRef, useState } from 'react';
import { useFocusPoint } from './useFocusPoint';
import { TIMER_STATUS } from '../utils/focusConstants';
import { completeFocus } from '../../../api/focus/focusApi';
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

export function useFocusTimer(studyId) {
  const { calculateFirstReward, calculateFinalReward } = useFocusPoint();

  // 현재 UI에서 사용하는 입력값
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  // 저장된 세션이 있으면 복원
  const [session, setSession] = useState(() => getStoredSession());

  // 토스트나 상태 메시지용
  const [message, setMessage] = useState('');

  // 현재 시각은 lazy initializer로 한 번만 계산
  const [now, setNow] = useState(() => Date.now());

  // 1차 보상 중복 저장 방지
  const savingRef = useRef(false);

  // 입력값 총 초
  const totalSeconds = useMemo(() => {
    return Number(minutes || 0) * 60 + Number(seconds || 0);
  }, [minutes, seconds]);

  // 입력값 변경
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

  // blur 시 2자리 포맷
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
    if (!session?.durationSeconds) return '';
    return formatSeconds(session.durationSeconds);
  }, [session]);

  // 타이머가 RUNNING일 때 현재 시각 갱신 + 기준 시간 도달 보상 저장
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

        saveStoredSession(updated);
        setMessage('기준 시간 도달!');

        savingRef.current = false;
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.status, calculateFirstReward]);

  // PAUSED일 때는 멈춘 시점 시간 유지
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

  // 현재 UI 분기용 상태
  const isRunning = session?.status === TIMER_STATUS.RUNNING;
  const isPaused = session?.status === TIMER_STATUS.PAUSED;
  const isCompleted = session?.status === TIMER_STATUS.COMPLETED;
  const isOvertime = isRunning && mode === 'OVERTIME';

  // 시작
  const handleStart = () => {
    if (totalSeconds === 0) return;

    // 새로 시작할 때 이전 테스트 세션 흔적 제거
    clearStoredSession();

    const { start, end } = createSessionTimes(totalSeconds);

    const newSession = {
      durationMinutes: Math.floor(totalSeconds / 60),
      durationSeconds: totalSeconds,
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

  // 일시정지
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

  // 재개
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

  // 종료
  const handleFinish = async () => {
    if (!session) return;

    const completedAt = new Date().toISOString();

    const finalReward = calculateFinalReward(
      session.durationMinutes,
      actualMinutes
    );

    const totalPoint =
      session.basePoint +
      session.targetBonusPoint +
      finalReward.overtimePoint;

    const updated = {
      ...session,
      status: TIMER_STATUS.COMPLETED,
      overtimePoint: finalReward.overtimePoint,
      totalPoint,
    };

    saveStoredSession(updated);
    setSession(updated);
    setMessage('집중 종료!');

    if (studyId) {
      try {
        await completeFocus(studyId, {
          duration: session.durationSeconds,
          earnedPoint: totalPoint,
          startedAt: session.startedAt,
          completedAt,
        });
      } catch (err) {
        console.error('집중 세션 저장 실패:', err);
      }
    }
  };

  // 초기화
  const handleReset = () => {
    clearStoredSession();
    setSession(null);
    setMessage('');
    setNow(Date.now());
    setMinutes('00');
    setSeconds('00');
  };

  return {
    // 입력값
    minutes,
    seconds,
    totalSeconds,
    handleMinutesChange,
    handleSecondsChange,
    handleBlurMinutes,
    handleBlurSeconds,

    // 세션/표시값
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

    // 액션
    handleStart,
    handlePause,
    handleResume,
    handleFinish,
    handleReset,

    // 상수
    TIMER_STATUS,
  };
}
