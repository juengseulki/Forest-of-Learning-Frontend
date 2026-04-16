import BaseStudyModal from './BaseStudyModal';

function StudyConfirmModal({
  isOpen,
  title = '스터디를 수정할까요?',
  description = '변경한 내용으로 스터디 정보를 수정합니다.',
  confirmText = '수정하기',
  cancelText = '취소',
  onClose,
  onConfirm,
  isSubmitting = false,
}) {
  return (
    <BaseStudyModal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={onClose}
      className="study-modal__content--confirm"
    >
      <div className="study-modal__actions">
        <button
          type="button"
          className="study-modal__button study-modal__button--secondary"
          onClick={onClose}
        >
          {cancelText}
        </button>

        <button
          type="button"
          className="study-modal__button study-modal__button--primary"
          onClick={onConfirm}
          disabled={isSubmitting}
        >
          {confirmText}
        </button>
      </div>
    </BaseStudyModal>
  );
}

export default StudyConfirmModal;
