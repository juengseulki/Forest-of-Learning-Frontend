import useFocusTimerForm from '../../hooks/useFocusTimerForm';
import FocusToast from '../FocusToast';
import playIcon from '../../../../images/icon/ic_play.svg';

import pauseActive from '../../../../images/focus/pause-active.png';
import pauseInactive from '../../../../images/focus/pause-inactive.png';
import pauseMobileActive from '../../../../images/focus/pause-mobile-active.png';
import pauseMobileInactive from '../../../../images/focus/pause-mobile-inactive.png';

import resetActive from '../../../../images/focus/reset-active.png';
import resetInactive from '../../../../images/focus/reset-inactive.png';
import resetMobileActive from '../../../../images/focus/reset-mobile-active.png';
import resetMobileInactive from '../../../../images/focus/reset-mobile-inactive.png';

import './FocusTimerCard.css';

function FocusTimerCard() {
  const {
    minutes,
    seconds,
    isEditing,
    isRunning,
    timerStatus,
    totalSeconds,
    handleMinutesChange,
    handleSecondsChange,
    handleBlurMinutes,
    handleBlurSeconds,
    handleStart,
    handleStop,
    displayMinutes,
    displaySec,
    toast,
    setToast,
  } = useFocusTimerForm();

  const isOvertime = timerStatus === 'overtime';

  const handleReset = () => {
    // 아직 reset 로직 없으면 임시로 stop 연결
    handleStop();
  };

  return (
    <div className="focus-timer-card">
      <p className="focus-timer-card__label">오늘의 집중</p>

      {isRunning ? (
        <div
          className={`focus-timer-card__time-display ${
            isOvertime ? 'is-overtime' : 'is-running'
          }`}
        >
          {isOvertime && '-'}
          {displayMinutes}:{displaySec}
        </div>
      ) : (
        <div className="focus-timer-card__time-input-wrap">
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={minutes}
            onChange={handleMinutesChange}
            onBlur={handleBlurMinutes}
            disabled={!isEditing}
            className="focus-timer-card__time-input"
          />

          <span className="focus-timer-card__colon">:</span>

          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={seconds}
            onChange={handleSecondsChange}
            onBlur={handleBlurSeconds}
            disabled={!isEditing}
            className="focus-timer-card__time-input"
          />
        </div>
      )}

      <div className="focus-timer-card__button-wrap">
        {isRunning ? (
          <div className="focus-timer-card__control-wrap">
            <button
              type="button"
              className="focus-timer-card__icon-button focus-timer-card__icon-button--left"
              onClick={handleReset}
            >
              <img
                src={resetActive}
                alt="reset"
                className="focus-timer-card__control-icon focus-timer-card__control-icon--desktop"
              />
              <img
                src={resetMobileActive}
                alt="reset"
                className="focus-timer-card__control-icon focus-timer-card__control-icon--mobile"
              />
            </button>

            <button
              type="button"
              className="focus-timer-card__button focus-timer-card__button--stop"
              onClick={handleStop}
            >
              <span className="focus-timer-card__button-content">
                <span>Stop</span>
              </span>
            </button>

            <button
              type="button"
              className="focus-timer-card__icon-button focus-timer-card__icon-button--right"
              onClick={handleStop}
            >
              <img
                src={pauseActive}
                alt="pause"
                className="focus-timer-card__control-icon focus-timer-card__control-icon--desktop"
              />
              <img
                src={pauseMobileActive}
                alt="pause"
                className="focus-timer-card__control-icon focus-timer-card__control-icon--mobile"
              />
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="focus-timer-card__button"
            onClick={handleStart}
            disabled={totalSeconds === 0}
          >
            <span className="focus-timer-card__button-content">
              <img
                src={playIcon}
                alt=""
                className="focus-timer-card__button-icon"
              />
              <span>Start!</span>
            </span>
          </button>
        )}
      </div>

      {toast && (
        <FocusToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default FocusTimerCard;
