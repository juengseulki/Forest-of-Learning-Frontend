import BaseStudyModal from './BaseStudyModal';

function StudyRecordModal({
  isOpen,
  title = '페이지를 나갈까요?',
  description = '저장되지 않은 값은 사라집니다.',
  leaveText = '나가기',
  stayText = '계속 작성하기',
  onClose,
  onLeave,
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
          {stayText}
        </button>

        <button
          type="button"
          className="study-modal__button study-modal__button--danger"
          onClick={onLeave}
        >
          {leaveText}
        </button>
      </div>
    </BaseStudyModal>
  );
}

export default StudyRecordModal;
