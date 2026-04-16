import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Toast from '../../../shared/components/toast/Toast';
import '../../../styles/StudyDetailPage.css';
import '../../../styles/global.css';

import StudyInfoSection from './components/StudyInfoSection.jsx';
import StudyActionButtonGroup from './components/actionSection/StudyActionButtonGroup.jsx';
import StudyLinkGroup from './components/actionSection/StudyLinkGroup.jsx';
import EmojiSection from './components/emoji/EmojiSection.jsx';
import HabitRecord from './components/HabitRecord.jsx';
import { getStudy, deleteStudy } from '../../../api/studyApi.js';
import StudyPasswordModal from '../../study/shared/modal/StudyPasswordModal.jsx';
import StudyConfirmModal from '../../study/shared/modal/StudyConfirmModal.jsx';

function StudyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [study, setStudy] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        const targetStudy = await getStudy(id);
        setStudy(targetStudy);
      } catch (error) {
        console.error('스터디 로딩 실패!', error);
        toast(
          <Toast
            type="danger"
            icon="❌"
            message="스터디 정보를 불러오지 못했습니다."
          />,
          {
            position: 'bottom-center',
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false,
            pauseOnHover: false,
            draggable: false,
          }
        );
      }
    };

    fetchStudyData();
  }, [id]);

  const handleDeleteStudy = async () => {
    try {
      await deleteStudy(id);
      setIsDeleteModalOpen(false);
      toast(
        <Toast type="success" icon="💚" message="스터디가 삭제되었습니다." />,
        {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
        }
      );
      navigate('/');
    } catch (error) {
      console.error('삭제 실패', error);
      toast(
        <Toast type="danger" icon="❗" message="스터디 삭제에 실패했습니다." />,
        {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
        }
      );
    }
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setPassword('');
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPassword('');
    setPendingAction(null);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleRequirePassword = (action) => {
    setPendingAction(action);
    handleOpenPasswordModal();
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmitPassword = async () => {
    if (!password.trim()) {
      toast(
        <Toast type="info" icon="💙" message="비밀번호를 입력해주세요." />,
        {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
        }
      );
      return;
    }

    try {
      setIsSubmitting(true);

      // API 연결 전 임시 처리
      if (password === study.password) {
        toast(<Toast type="success" icon="✅" message="확인되었습니다." />, {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
        });

        const nextAction = pendingAction;
        handleClosePasswordModal();

        if (nextAction === 'edit') {
          navigate(`/studies/${id}/edit`);
          return;
        }

        if (nextAction === 'habit') {
          navigate(`/studies/${id}/habit`);
          return;
        }

        if (nextAction === 'focus') {
          navigate(`/studies/${id}/focus`);
          return;
        }

        return;
      }

      toast(
        <Toast
          type="danger"
          icon="❌"
          message="비밀번호가 일치하지 않습니다."
        />,
        {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
        }
      );
    } catch (error) {
      console.error('비밀번호 확인 실패', error);
      toast(<Toast type="danger" icon="❗" message="오류가 발생했습니다." />, {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        pauseOnHover: false,
        draggable: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="detail-wrapper">
      <div className="detail-container">
        <section className="detail-top-section">
          <div className="detail-left">
            <EmojiSection studyId={id} />
            <StudyInfoSection study={study} studyId={id} />
          </div>

          <div className="detail-right">
            <StudyActionButtonGroup
              onEditClick={() => handleRequirePassword('edit')}
              onDeleteClick={handleOpenDeleteModal}
            />

            <StudyLinkGroup
              studyId={id}
              onHabitClick={() => handleRequirePassword('habit')}
              onFocusClick={() => handleRequirePassword('focus')}
            />
          </div>
        </section>

        <HabitRecord studyId={id} />
      </div>

      <StudyPasswordModal
        isOpen={isPasswordModalOpen}
        studyName={study.name}
        password={password}
        isSubmitting={isSubmitting}
        onChangePassword={handleChangePassword}
        onClose={handleClosePasswordModal}
        onSubmit={handleSubmitPassword}
      />

      <StudyConfirmModal
        isOpen={isDeleteModalOpen}
        title="스터디를 삭제할까요?"
        description="삭제하면 복구할 수 없습니다."
        confirmText="삭제하기"
        cancelText="취소"
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteStudy}
      />
    </div>
  );
}

export default StudyDetailPage;
