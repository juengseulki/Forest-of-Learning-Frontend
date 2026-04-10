import useFocusTimerForm from '../../hooks/useFocusTimerForm';
import playIcon from '../../../../images/icon/ic_play.svg';
import pauseIcon from '../../../../images/icon/ic_pause.svg';
import './FocusTimerCard.css';

function FocusTimerCard() {
  const {
    minutes,
    seconds,
    isEditing,
    isRunning,
    totalSeconds,
    handleMinutesChange,
    handleSecondsChange,
    handleBlurMinutes,
    handleBlurSeconds,
    handleStart,
    handleStop,
  } = useFocusTimerForm();

  return (
    <div className="focus-timer-card">
      <p className="focus-timer-card__label">오늘의 집중</p>

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

      <div className="focus-timer-card__button-wrap">
        {isRunning ? (
          <button
            type="button"
            className="focus-timer-card__button"
            onClick={handleStop}
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
    </div>
  );
}

export default FocusTimerCard;
