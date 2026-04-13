import playIcon from '../../../images/icon/ic_play.svg';
import pauseIcon from '../../../images/icon/ic_pause.svg';

import pauseActive from '../../../images/focus/pause-active.png';
import pauseInactive from '../../../images/focus/pause-inactive.png';
import pauseMobileActive from '../../../images/focus/pause-mobile-active.png';
import pauseMobileInactive from '../../../images/focus/pause-mobile-inactive.png';

import resetActive from '../../../images/focus/reset-active.png';
import resetInactive from '../../../images/focus/reset-inactive.png';
import resetMobileActive from '../../../images/focus/reset-mobile-active.png';
import resetMobileInactive from '../../../images/focus/reset-mobile-inactive.png';

import FocusIconButton from './FocusIconButton';

function FocusTimerControls({
  session,
  totalSeconds,
  isRunning,
  isPaused,
  isCompleted,
  isOvertime,
  handleStart,
  handlePause,
  handleResume,
  handleFinish,
  handleReset,
}) {
  let content = null;

  if (!session) {
    content = (
      <button
        type="button"
        className="focus-timer-card__button focus-timer-card__button--start"
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
    );
  } else if (isCompleted) {
    content = (
      <button
        type="button"
        className="focus-timer-card__button focus-timer-card__button--start"
        onClick={handleReset}
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
    );
  } else if (isPaused) {
    content = (
      <div className="focus-timer-card__control-wrap">
        <FocusIconButton
          disabled
          alt="pause"
          desktopInactiveSrc={pauseInactive}
          mobileInactiveSrc={pauseMobileInactive}
        />

        <button
          type="button"
          className="focus-timer-card__button focus-timer-card__button--start"
          onClick={handleResume}
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

        <FocusIconButton
          onClick={handleReset}
          alt="reset"
          desktopInactiveSrc={resetInactive}
          desktopActiveSrc={resetActive}
          mobileInactiveSrc={resetMobileInactive}
          mobileActiveSrc={resetMobileActive}
        />
      </div>
    );
  } else if (isRunning && isOvertime) {
    content = (
      <button
        type="button"
        className="focus-timer-card__button focus-timer-card__button--stop"
        onClick={handleFinish}
      >
        <span className="focus-timer-card__button-content">
          <img
            src={pauseIcon}
            alt=""
            className="focus-timer-card__button-icon"
          />
          <span>Stop</span>
        </span>
      </button>
    );
  } else if (isRunning) {
    content = (
      <div className="focus-timer-card__control-wrap">
        <FocusIconButton
          onClick={handlePause}
          alt="pause"
          desktopInactiveSrc={pauseInactive}
          desktopActiveSrc={pauseActive}
          mobileInactiveSrc={pauseMobileInactive}
          mobileActiveSrc={pauseMobileActive}
        />

        <button
          type="button"
          className="focus-timer-card__button focus-timer-card__button--start-disabled"
          disabled
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

        <FocusIconButton
          onClick={handleReset}
          alt="reset"
          desktopInactiveSrc={resetInactive}
          desktopActiveSrc={resetActive}
          mobileInactiveSrc={resetMobileInactive}
          mobileActiveSrc={resetMobileActive}
        />
      </div>
    );
  }

  return <div className="focus-timer-card__controls-slot">{content}</div>;
}

export default FocusTimerControls;
