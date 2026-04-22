import './StudyModal.css';
/* 기록용 주석입니다. */
function BaseStudyModal({
  isOpen,
  title,
  description,
  rightText,
  onClose,
  children,
  className = '',
}) {
  if (!isOpen) return null;

  return (
    <div className="study-modal" onClick={onClose}>
      <div
        className={`study-modal__content ${className}`.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="study-modal__header">
          <div className="study-modal__header-spacer" />
          <h2 className="study-modal__title">{title}</h2>
          {rightText ? (
            <button
              type="button"
              className="study-modal__close"
              onClick={onClose}
            >
              {rightText}
            </button>
          ) : (
            <div className="study-modal__header-spacer" />
          )}
        </div>

        {description ? (
          <p className="study-modal__description">{description}</p>
        ) : null}

        <div className="study-modal__body">{children}</div>
      </div>
    </div>
  );
}

export default BaseStudyModal;
