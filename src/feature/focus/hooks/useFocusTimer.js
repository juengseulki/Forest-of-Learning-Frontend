import { useEffect, useMemo, useRef, useState } from 'react';
import { useFocusPoint } from './useFocusPoint';
import { TIMER_STATUS } from '../utils/focusConstants';
import { addPoints } from '../../../api/pointApi';

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

export function useFocusTimer(studyId, setPointData) {
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
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [session?.status, studyId, calculateFirstReward, setPointData]);

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
      basePoint: 0,
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
  const handleFinish = () => {
    if (!session) return;

    const finalReward = calculateFinalReward(
      session.durationMinutes,
      actualMinutes
    );
    const overtimePoint = finalReward.overtimePoint;

    // 1차 보상: 설정 시간이 끝나면 3점
    const firstRewardPoint = actualMinutes >= session.durationMinutes ? 3 : 0;

    const totalEarned = firstRewardPoint + overtimePoint;

    const updated = {
      ...session,
      status: TIMER_STATUS.COMPLETED,
      basePoint: firstRewardPoint,
      overtimePoint: overtimePoint,
      totalPoint: totalEarned,
    };

    // API로 포인트 지급
    addPoints(studyId, totalEarned)
      .then((data) => {
        saveStoredSession(updated);
        setSession(updated);
        if (setPointData && updated) {
          setPointData(data);
        }
        saveStoredSession(updated);
        setMessage('포인트가 추가되었습니다!');
      })
      .catch((err) => {
        console.error('포인트 추가 실패:', err);
        setMessage('포인트 반영 실패');
      });

    setSession(updated);
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
