import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Toast from '../shared/components/toast/Toast';
import StudyForm from '../feature/study/components/StudyForm';
import StudyUnsavedChangesModal from '../feature/study/shared/modal/StudyUnsavedChangesModal';
import StudyConfirmModal from '../feature/study/shared/modal/StudyConfirmModal';
import { updateStudy } from '../api/studyApi';

function StudyEditPage() {
  const navigate = useNavigate();
  const { studyId } = useParams();
  const { setHeaderAction } = useOutletContext();

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenLeaveModal = () => {
    setIsLeaveModalOpen(true);
  };

  const handleCloseLeaveModal = () => {
    setIsLeaveModalOpen(false);
  };

  const handleLeavePage = () => {
    setIsLeaveModalOpen(false);
    navigate(-1);
  };

  const handleValidSubmit = (formData) => {
    setPendingFormData(formData);
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirmEdit = async () => {
    if (!pendingFormData) return;

    try {
      setIsSubmitting(true);

      await updateStudy(studyId, pendingFormData);

      setIsConfirmModalOpen(false);

      toast(
        <Toast type="success" icon="✅" message="스터디가 수정되었습니다." />,
        {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
        }
      );

      navigate(`/studies/${studyId}`);
    } catch (error) {
      console.error('스터디 수정 실패', error);
      toast(
        <Toast type="danger" icon="❗" message="스터디 수정에 실패했습니다." />,
        {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    setHeaderAction(() => handleOpenLeaveModal);

    return () => {
      setHeaderAction(null);
    };
  }, [setHeaderAction]);

  return (
    <div className="study-edit-page">
      <StudyForm isEditMode={true} onValidSubmit={handleValidSubmit} />

      <StudyUnsavedChangesModal
        isOpen={isLeaveModalOpen}
        onClose={handleCloseLeaveModal}
        onLeave={handleLeavePage}
      />

      <StudyConfirmModal
        isOpen={isConfirmModalOpen}
        title="스터디를 수정할까요?"
        description="수정 전 내용은 저장되지 않고, 변경한 내용으로 덮어씌워집니다."
        confirmText="수정하기"
        cancelText="취소"
        onClose={handleCloseConfirmModal}
        onConfirm={handleConfirmEdit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default StudyEditPage;
