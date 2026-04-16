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
import handleApiError from '../../../utils/handleApiError.jsx';
import {
  getStudy,
  verifyStudyPassword,
  deleteStudy,
} from '../../../api/studyApi.js';
import StudyPasswordModal from '../../study/shared/modal/StudyPasswordModal.jsx';

function StudyDetailPage() {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const params = useParams();
  console.log('params:', params);

  console.log('studyId:', studyId);
  const [study, setStudy] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (!studyId) return;

    const fetchStudyData = async () => {
      try {
        const targetStudy = await getStudy(studyId);
        setStudy(targetStudy);
      } catch (error) {
        handleApiError(error, '스터디 정보를 불러오지 못했습니다.');
      }
    };

    fetchStudyData();
  }, [studyId]);

  const showToast = (type, icon, message) => {
    toast(<Toast type={type} icon={icon} message={message} />, {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false,
      pauseOnHover: false,
      draggable: false,
    });
  };

  const handleRequirePassword = (action) => {
    setPendingAction(action);
    setPassword('');
    setIsPasswordModalOpen(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPassword('');
    setPendingAction(null);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmitPassword = async () => {
    if (!password.trim()) {
      showToast('info', '💙', '비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (pendingAction === 'delete') {
        await deleteStudy(studyId, password);
        handleClosePasswordModal();
        showToast('success', '💚', '스터디가 삭제되었습니다.');
        navigate('/');
        return;
      }

      await verifyStudyPassword(studyId, password);

      handleClosePasswordModal();
      showToast('success', '✅', '확인되었습니다.');

      if (pendingAction === 'edit') {
        navigate(`/studies/${studyId}/edit`);
        return;
      }

      if (pendingAction === 'habit') {
        navigate(`/studies/${studyId}/habit`);
        return;
      }

      if (pendingAction === 'focus') {
        navigate(`/studies/${studyId}/focus`);
      }
    } catch (error) {
      showToast('danger', '❌', error.message || '오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="detail-wrapper">
      <div className="detail-container">
        <section className="detail-top-section">
          <div className="detail-left">
            <EmojiSection studyId={studyId} />
            <StudyInfoSection study={study} studyId={studyId} />
          </div>

          <div className="detail-right">
            <StudyActionButtonGroup
              onEditClick={() => handleRequirePassword('edit')}
              onDeleteClick={() => handleRequirePassword('delete')}
            />

            <StudyLinkGroup
              studyId={studyId}
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
      />
    </div>
  );
}

export default StudyDetailPage;
