import { useParams } from 'react-router-dom';

import '../../../styles/StudyDetailPage.css';
import '../../../styles/global.css';

import StudyInfoSection from './components/StudyInfoSection.jsx';
import StudyActionButtonGroup from './components/actionSection/StudyActionButtonGroup.jsx';
import StudyLinkGroup from './components/actionSection/StudyLinkGroup.jsx';
import EmojiSection from './components/emoji/EmojiSection.jsx';
import HabitRecord from './components/HabitRecord.jsx';
import StudyPasswordModal from '../shared/modal/StudyPasswordModal.jsx';
import StudyConfirmModal from '../shared/modal/StudyConfirmModal.jsx';
import StudyRecordModal from '../shared/modal/StudyRecordModal.jsx';
import { useStudyDetail } from './hooks/useStudyDetail.jsx';

function StudyDetailPage() {
  const { studyId } = useParams();

  const {
    study,
    password,
    isSubmitting,
    isPasswordModalOpen,
    isDeleteConfirmModalOpen,
    isRecordModalOpen,
    handleRequirePassword,
    handleClosePasswordModal,
    handleCloseDeleteConfirmModal,
    handleChangePassword,
    handleSubmitPassword,
    handleConfirmDelete,
    handleCloseRecordModal,
    getActionLabel,
  } = useStudyDetail(studyId);

  return (
    <div className="detail-wrapper">
      <div className="detail-container common-panel">
        <section className="detail-top-section">
          <div className="detail-left">
            <EmojiSection studyId={studyId} />
            <StudyInfoSection study={study} studyId={studyId} />
          </div>

          <div className="detail-right">
            <StudyActionButtonGroup
              onEditClick={() => handleRequirePassword('edit')}
              onDeleteClick={() => handleRequirePassword('delete')}
              onRecordClick={() => handleRequirePassword('record')}
              study={study}
            />

            <StudyLinkGroup
              onHabitClick={() => handleRequirePassword('habit')}
              onFocusClick={() => handleRequirePassword('focus')}
            />
          </div>
        </section>

        <HabitRecord studyId={studyId} />
      </div>

      <StudyPasswordModal
        isOpen={isPasswordModalOpen}
        studyName={study.name}
        password={password}
        isSubmitting={isSubmitting}
        onChangePassword={handleChangePassword}
        onClose={handleClosePasswordModal}
        onSubmit={handleSubmitPassword}
        actionLabel={getActionLabel()}
        description="권한이 필요해요!"
      />

      <StudyConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        title="스터디를 삭제할까요?"
        description="삭제하면 복구할 수 없습니다."
        confirmText="삭제하기"
        cancelText="취소"
        onClose={handleCloseDeleteConfirmModal}
        onConfirm={handleConfirmDelete}
      />

      <StudyRecordModal
        isOpen={isRecordModalOpen}
        title="포인트 기록"
        closeText="닫기"
        onClose={handleCloseRecordModal}
      />
    </div>
  );
}

export default StudyDetailPage;
