import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusTimer } from '../hooks/useFocusTimer.js';
import { useCompleteFocus } from '../hooks/useCompleteFocus.js';
import FocusTimerDisplay from './FocusTimerDisplay.jsx';
import FocusTimerControls from './FocusTimerControls.jsx';
import {
  showPauseToast,
  showTargetToast,
  showPointToast,
} from '../utils/focusToastUtils.jsx';
import { calculateFocusToastPoint } from '../utils/focusReward.js';
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
  } = useFocusTimer();

  const completeFocusMutation = useCompleteFocus(studyId, onSessionComplete);
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
    if (!session || completeFocusMutation.isPending) return;

    const { firstPoint, secondPoint, totalPoint } = calculateFocusToastPoint(
      session,
      actualMinutes
    );

    showPointToast(firstPoint, secondPoint, totalPoint);

    const sessionPayload = handleFinish();

    if (studyId && sessionPayload) {
      completeFocusMutation.mutate(sessionPayload);
    }
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
        isSaving={completeFocusMutation.isPending}
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
