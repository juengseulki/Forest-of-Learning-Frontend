function FocusIconButton({
  onClick,
  disabled = false,
  desktopInactiveSrc,
  desktopActiveSrc,
  mobileInactiveSrc,
  mobileActiveSrc,
  alt,
}) {
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
          alt={alt}
          className="focus-timer-card__control-icon focus-timer-card__control-icon--desktop icon-inactive"
        />
      )}

      {!disabled && desktopActiveSrc && (
        <img
          src={desktopActiveSrc}
          alt={alt}
          className="focus-timer-card__control-icon focus-timer-card__control-icon--desktop icon-active"
        />
      )}

      {mobileInactiveSrc && (
        <img
          src={mobileInactiveSrc}
          alt={alt}
          className="focus-timer-card__control-icon focus-timer-card__control-icon--mobile icon-inactive"
        />
      )}

      {!disabled && mobileActiveSrc && (
        <img
          src={mobileActiveSrc}
          alt={alt}
          className="focus-timer-card__control-icon focus-timer-card__control-icon--mobile icon-active"
        />
      )}
    </button>
  );
}

export default FocusIconButton;
