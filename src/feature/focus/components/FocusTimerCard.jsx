import { useEffect, useRef } from 'react';
import { useFocusTimer } from '../hooks/useFocusTimer';
import FocusTimerDisplay from './FocusTimerDisplay';
import { useFocusPoint } from '../hooks/useFocusPoint';
import FocusTimerControls from './FocusTimerControls';
import {
  showPauseToast,
  showTargetToast,
  showPointToast,
} from '../utils/focusToastUtils.jsx';
import './FocusTimerCard.css';

function FocusTimerCard({ studyId, onSessionComplete }) {
  const {
    minutes,
    seconds,
    totalSeconds,
    handleMinutesChange,
    handleSecondsChange,
    handleBlurMinutes,
    handleBlurSeconds,

    session,
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
  } = useFocusTimer(studyId, onSessionComplete);

  const { calculateFinalReward } = useFocusPoint();

  const hasShownTargetToastRef = useRef(false);

  // 💚 설정시간 끝났을 때
  useEffect(() => {
    if (isOvertime && !hasShownTargetToastRef.current) {
      showTargetToast();
      hasShownTargetToastRef.current = true;
    }
  }, [isOvertime]);

  // ⏸ 일시중지
  function handlePauseWithToast() {
    handlePause();
    showPauseToast();
  }

  // 🎉 종료 + 포인트
  function handleFinishWithToast() {
    if (!session) return;

    const firstPoint =
      (session.basePoint ?? 0) + (session.targetBonusPoint ?? 0);
    const finalReward = calculateFinalReward(
      session.durationMinutes,
      actualMinutes
    );
    const secondPoint = finalReward.overtimePoint;
    const totalPoint = firstPoint + secondPoint;

    showPointToast(firstPoint, secondPoint, totalPoint);

    handleFinish();
  }

  // 🔄 리셋
  function handleResetWithToast() {
    handleReset();
    hasShownTargetToastRef.current = false;
  }

  const showTimerDisplay = isRunning || isPaused || isCompleted;

  return (
    <div className="focus-timer-card">
      <p className="focus-timer-card__label">오늘의 집중</p>

      <FocusTimerDisplay
        showTimerDisplay={showTimerDisplay}
        displayTime={displayTime}
        displayDuration={displayDuration}
        isOvertime={isOvertime}
        minutes={minutes}
        seconds={seconds}
        handleMinutesChange={handleMinutesChange}
        handleSecondsChange={handleSecondsChange}
        handleBlurMinutes={handleBlurMinutes}
        handleBlurSeconds={handleBlurSeconds}
      />

      <FocusTimerControls
        session={session}
        totalSeconds={totalSeconds}
        isRunning={isRunning}
        isPaused={isPaused}
        isCompleted={isCompleted}
        isOvertime={isOvertime}
        handleStart={handleStart}
        handlePause={handlePauseWithToast}
        handleResume={handleResume}
        handleFinish={handleFinishWithToast}
        handleReset={handleResetWithToast}
      />
    </div>
  );
}

export default FocusTimerCard;
