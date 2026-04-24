import { useTranslation } from 'react-i18next';
import clockIcon from '../../../images/focus/ic_timer.svg';

function FocusTimerDisplay({
  showTimerDisplay,
  displayTime,
  displayDuration,
  isOvertime,
  minutes,
  seconds,
  handleMinutesChange,
  handleSecondsChange,
  handleBlurMinutes,
  handleBlurSeconds,
}) {
  const { t } = useTranslation();

  return (
    <div className="focus-timer-card__display-section">
      <div className="focus-timer-card__duration-slot">
        {showTimerDisplay && (
          <div className="focus-timer-card__duration-badge">
            <img
              src={clockIcon}
              alt={t('focusTime')}
              className="focus-timer-card__duration-icon"
            />
            <p className="focus-timer-card__duration-text">{displayDuration}</p>
          </div>
        )}
      </div>

      <div className="focus-timer-card__timer-slot">
        {showTimerDisplay ? (
          <div
            className={`focus-timer-card__time-display ${
              isOvertime ? 'is-overtime' : 'is-running'
            }`}
          >
            {isOvertime && '-'}
            {displayTime}
          </div>
        ) : (
          <div className="focus-timer-card__time-input-wrap">
            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={minutes}
              placeholder="00"
              onChange={handleMinutesChange}
              onBlur={handleBlurMinutes}
              className="focus-timer-card__time-input"
              aria-label={t('focusTime')}
            />

            <span className="focus-timer-card__colon">:</span>

            <input
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={seconds}
              placeholder="00"
              onChange={handleSecondsChange}
              onBlur={handleBlurSeconds}
              className="focus-timer-card__time-input"
              aria-label={t('focusTime')}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default FocusTimerDisplay;
