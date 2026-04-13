import { useEffect, useRef } from 'react';
import { useFocusTimer } from '../hooks/useFocusTimer';
import FocusTimerDisplay from './FocusTimerDisplay';
import { useFocusPoint } from '../hooks/useFocusPoint';
import FocusTimerControls from './FocusTimerControls';
import {
  showPauseToast,
  showTargetToast,
  showPointToast,
} from '../utils/focusToast.jsx';
import './FocusTimerCard.css';

function FocusTimerCard() {
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
    isRunning,
    isPaused,
    isCompleted,
    isOvertime,

    handleStart,
    handlePause,
    handleResume,
    handleFinish,
    handleReset,
  } = useFocusTimer();

  const { calculateFirstReward, calculateFinalReward } = useFocusPoint();

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
    const durationMinutes = Math.floor(totalSeconds / 60);
    const actualMinutes = session;

    if (actualMinutes >= durationMinutes) {
      const firstReward = calculateFirstReward(durationMinutes);
      const finalReward = calculateFinalReward(durationMinutes, actualMinutes);

      const totalPoint =
        firstReward.basePoint +
        firstReward.targetBonusPoint +
        finalReward.overtimePoint;

      showPointToast(totalPoint);
    }

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
