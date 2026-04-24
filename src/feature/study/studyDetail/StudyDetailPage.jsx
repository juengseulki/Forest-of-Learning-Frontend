import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../../../styles/StudyDetailPage.css';
import '../../../styles/global.css';

import ErrorPage from '../../../shared/components/ErrorPage/ErrorPage.jsx';
import { useStudyDetail } from './hooks/useStudyDetail.jsx';
import { useTranslatedStudyName } from './hooks/useTranslatedStudyName.js';
import StudyDetailContent from './components/StudyDetailContent.jsx';
import StudyDetailModals from './components/StudyDetailModals.jsx';

function StudyDetailPage() {
  const { studyId } = useParams();
  const { t } = useTranslation();

  const {
    study,
    notFound,
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

  const displayStudyName = useTranslatedStudyName(study?.name);

  if (notFound) {
    return (
      <ErrorPage title={t('studyNotFound')} desc={t('studyNotFoundDesc')} />
    );
  }

  return (
    <div className="detail-wrapper">
      <StudyDetailContent
        studyId={studyId}
        study={study}
        onRequirePassword={handleRequirePassword}
      />

      <StudyDetailModals
        studyId={studyId}
        studyName={displayStudyName}
        password={password}
        isSubmitting={isSubmitting}
        isPasswordModalOpen={isPasswordModalOpen}
        isDeleteConfirmModalOpen={isDeleteConfirmModalOpen}
        isRecordModalOpen={isRecordModalOpen}
        onChangePassword={handleChangePassword}
        onClosePasswordModal={handleClosePasswordModal}
        onSubmitPassword={handleSubmitPassword}
        onCloseDeleteConfirmModal={handleCloseDeleteConfirmModal}
        onConfirmDelete={handleConfirmDelete}
        onCloseRecordModal={handleCloseRecordModal}
        actionLabel={getActionLabel()}
      />
    </div>
  );
}

export default StudyDetailPage;
