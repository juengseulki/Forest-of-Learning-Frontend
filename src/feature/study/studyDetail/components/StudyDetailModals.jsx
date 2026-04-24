import { useTranslation } from 'react-i18next';

import StudyPasswordModal from '../../shared/modal/StudyPasswordModal.jsx';
import StudyConfirmModal from '../../shared/modal/StudyConfirmModal.jsx';
import StudyRecordModal from '../../shared/modal/StudyRecordModal.jsx';

function StudyDetailModals({
  studyId,
  studyName,
  password,
  isSubmitting,
  isPasswordModalOpen,
  isDeleteConfirmModalOpen,
  isRecordModalOpen,
  onChangePassword,
  onClosePasswordModal,
  onSubmitPassword,
  onCloseDeleteConfirmModal,
  onConfirmDelete,
  onCloseRecordModal,
  actionLabel,
}) {
  const { t } = useTranslation();

  return (
    <>
      <StudyPasswordModal
        isOpen={isPasswordModalOpen}
        studyName={studyName}
        password={password}
        isSubmitting={isSubmitting}
        onChangePassword={onChangePassword}
        onClose={onClosePasswordModal}
        onSubmit={onSubmitPassword}
        actionLabel={actionLabel}
        description={t('passwordRequired')}
      />

      <StudyConfirmModal
        isOpen={isDeleteConfirmModalOpen}
        title={t('deleteStudyTitle')}
        description={t('deleteStudyDescription')}
        confirmText={t('delete')}
        cancelText={t('cancel')}
        onClose={onCloseDeleteConfirmModal}
        onConfirm={onConfirmDelete}
        isSubmitting={isSubmitting}
      />

      <StudyRecordModal
        isOpen={isRecordModalOpen}
        title={t('pointRecord')}
        closeText={t('close')}
        onClose={onCloseRecordModal}
        studyId={Number(studyId)}
      />
    </>
  );
}

export default StudyDetailModals;
