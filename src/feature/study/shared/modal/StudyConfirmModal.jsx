import { useTranslation } from 'react-i18next';
import BaseStudyModal from './BaseStudyModal';

function StudyConfirmModal({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  onClose,
  onConfirm,
  isSubmitting = false,
}) {
  const { t } = useTranslation();

  return (
    <BaseStudyModal
      isOpen={isOpen}
      title={title || t('deleteStudyTitle')}
      description={description || t('deleteStudyDescription')}
      onClose={onClose}
      className="study-modal__content--confirm"
    >
      <div className="study-modal__actions">
        <button
          type="button"
          className="study-modal__button study-modal__button--secondary"
          onClick={onClose}
        >
          {cancelText || t('cancel')}
        </button>

        <button
          type="button"
          className="study-modal__button study-modal__button--primary"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {confirmText || t('confirm')}
        </button>
      </div>
    </BaseStudyModal>
  );
}

export default StudyConfirmModal;
