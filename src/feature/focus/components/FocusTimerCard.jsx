import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusTimer } from '../hooks/useFocusTimer';
import FocusTimerDisplay from './FocusTimerDisplay.jsx';
import { useFocusPoint } from '../hooks/useFocusPoint.js';
import FocusTimerControls from './FocusTimerControls.jsx';
import {
  showPauseToast,
  showTargetToast,
  showPointToast,
} from '../utils/focusToastUtils.jsx';
import './FocusTimerCard.css';

function FocusTimerCard({ studyId, onSessionComplete }) {
  const { t } = useTranslation();

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

  useEffect(() => {
    if (isOvertime && !hasShownTargetToastRef.current) {
      showTargetToast();
      hasShownTargetToastRef.current = true;
    }
  }, [isOvertime]);

  function handlePauseWithToast() {
    handlePause();
    showPauseToast();
  }

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

  function handleResetWithToast() {
    handleReset();
    hasShownTargetToastRef.current = false;
  }

  const showTimerDisplay = isRunning || isPaused || isCompleted;

  return (
    <div className="focus-timer-card common-card">
      <p className="focus-timer-card__label">{t('focusTitle')}</p>

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
