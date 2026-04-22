import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyStudyPassword } from '../../api/studyApi.js';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import PasswordModal from '../../feature/study/shared/modal/StudyPasswordModal.jsx';

function ProtectedStudyRoute({ children }) {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(() => {
    return sessionStorage.getItem(`study-auth-${studyId}`) === 'true';
  });

  async function handleVerify() {
    if (!password.trim()) {
      toast.error(t('enterPassword'));
      return;
    }

    try {
      setIsSubmitting(true);

      await verifyStudyPassword(studyId, password);

      sessionStorage.setItem(`study-auth-${studyId}`, 'true');
      setIsVerified(true);
      setPassword('');
    } catch (error) {
      toast.error(t('errorPasswordMismatch'));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleExit() {
    navigate('/');
  }

  function handleChangePassword(e) {
    setPassword(e.target.value);
  }

  if (!isVerified) {
    return (
      <PasswordModal
        isOpen={true}
        studyName={t('passwordPlaceholder')}
        password={password}
        isSubmitting={isSubmitting}
        onChangePassword={handleChangePassword}
        onSubmit={handleVerify}
        onClose={handleExit}
        actionLabel={t('confirm')}
      />
    );
  }

  return children;
}

export default ProtectedStudyRoute;
