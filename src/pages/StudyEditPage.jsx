import { useEffect, useState } from 'react';
import {
  useNavigate,
  useOutletContext,
  useParams,
  useLocation,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { showToast } from '@/shared/utils/showToast.jsx';
import StudyForm from '../feature/study/components/StudyForm.jsx';
import StudyUnsavedChangesModal from '../feature/study/shared/modal/StudyUnsavedChangesModal.jsx';
import StudyConfirmModal from '../feature/study/shared/modal/StudyConfirmModal.jsx';
import { updateStudy, getStudy } from '../api/studyApi.js';

function StudyEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { studyId } = useParams();
  const { setHeaderAction } = useOutletContext();

  // 변수는 한 번씩만 선언
  const [initialData, setInitialData] = useState(location.state?.study || null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 데이터가 없을 경우 서버에서 불러오는 로직
  useEffect(() => {
    if (!initialData && studyId) {
      const fetchStudy = async () => {
        try {
          const data = await getStudy(studyId);
          setInitialData(data);
        } catch (error) {
          console.error('데이터 로드 실패', error);
        }
      };
      fetchStudy();
    }
  }, [studyId, initialData]);

  const handleOpenLeaveModal = () => setIsLeaveModalOpen(true);
  const handleCloseLeaveModal = () => setIsLeaveModalOpen(false);
  const handleLeavePage = () => {
    setIsLeaveModalOpen(false);
    navigate(-1);
  };

  const handleValidSubmit = (formData) => {
    setPendingFormData(formData);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => setIsConfirmModalOpen(false);

  const handleConfirmEdit = async () => {
    if (!pendingFormData) return;

    try {
      setIsSubmitting(true);
      await updateStudy(studyId, pendingFormData);
      setIsConfirmModalOpen(false);

      showToast('success', '✅', t('editSuccess'));

      navigate(`/studies/${studyId}`);
    } catch (error) {
      console.error('스터디 수정 실패', error);
      showToast('danger', '❗', t('editFail'));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setHeaderAction(() => handleOpenLeaveModal);
    return () => setHeaderAction(null);
  }, [setHeaderAction]);

  return (
    <div className="study-edit-page">
      {initialData ? (
        <StudyForm
          isEditMode={true}
          initialData={initialData}
          onValidSubmit={handleValidSubmit}
        />
      ) : (
        <div className="loading-container">
          <p>{t('loadingStudy')}</p>
        </div>
      )}

      <StudyUnsavedChangesModal
        isOpen={isLeaveModalOpen}
        onClose={handleCloseLeaveModal}
        onLeave={handleLeavePage}
      />

      <StudyConfirmModal
        isOpen={isConfirmModalOpen}
        title={t('editConfirmTitle')}
        description={t('editConfirmDesc')}
        confirmText={t('edit')}
        cancelText={t('cancel')}
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default StudyEditPage;
