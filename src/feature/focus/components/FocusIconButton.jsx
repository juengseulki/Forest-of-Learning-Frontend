import { useTranslation } from 'react-i18next';

function FocusIconButton({
  onClick,
  disabled = false,
  desktopInactiveSrc,
  desktopActiveSrc,
  mobileInactiveSrc,
  mobileActiveSrc,
  altKey,
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      className="focus-timer-card__icon-button"
      onClick={onClick}
      disabled={disabled}
    >
      {desktopInactiveSrc && (
        <img
          src={desktopInactiveSrc}
          alt={t(altKey)}
          className="focus-timer-card__control-icon focus-timer-card__control-icon--desktop icon-inactive"
        />
      )}

      {!disabled && desktopActiveSrc && (
        <img
          src={desktopActiveSrc}
          alt={t(altKey)}
          className="focus-timer-card__control-icon focus-timer-card__control-icon--desktop icon-active"
        />
      )}

      {mobileInactiveSrc && (
        <img
          src={mobileInactiveSrc}
          alt={t(altKey)}
          className="focus-timer-card__control-icon focus-timer-card__control-icon--mobile icon-inactive"
        />
      )}

      {!disabled && mobileActiveSrc && (
        <img
          src={mobileActiveSrc}
          alt={t(altKey)}
          className="focus-timer-card__control-icon focus-timer-card__control-icon--mobile icon-active"
        />
      )}
    </button>
  );
}

export default FocusIconButton;
