import { useTranslation } from 'react-i18next';
import BaseStudyModal from './BaseStudyModal';

function StudyUnsavedChangesModal({
  isOpen,
  title,
  description,
  leaveText,
  stayText,
  onClose,
  onLeave,
}) {
  const { t } = useTranslation();

  return (
    <BaseStudyModal
      isOpen={isOpen}
      title={title || t('leavePage')}
      description={description || t('leavePageDescription')}
      onClose={onClose}
      className="study-modal__content--confirm"
    >
      <div className="study-modal__actions">
        <button
          type="button"
          className="study-modal__button study-modal__button--secondary"
          onClick={onClose}
        >
          {stayText || t('continueWriting')}
        </button>

        <button
          type="button"
          className="study-modal__button study-modal__button--danger"
          onClick={onLeave}
        >
          {leaveText || t('exit')}
        </button>
      </div>
    </BaseStudyModal>
  );
}

export default StudyUnsavedChangesModal;
