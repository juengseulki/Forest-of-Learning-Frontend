import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { verifyStudyPassword, checkStudySession } from '../../api/studyApi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import PasswordModal from '../../feature/study/shared/modal/StudyPasswordModal';

function ProtectedStudyRoute({ children }) {
  const { studyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasSessionStorage = sessionStorage.getItem(`study-auth-${studyId}`) === 'true';
  const [status, setStatus] = useState(hasSessionStorage ? 'checking' : 'unverified');

  useEffect(() => {
    if (status !== 'checking') return;

    checkStudySession(studyId)
      .then((data) => {
        if (data?.verified) {
          setStatus('verified');
        } else {
          sessionStorage.removeItem(`study-auth-${studyId}`);
          setStatus('unverified');
        }
      })
      .catch(() => {
        sessionStorage.removeItem(`study-auth-${studyId}`);
        setStatus('unverified');
      });
  }, [studyId, status]);

  async function handleVerify() {
    if (!password.trim()) {
      toast.error(t('enterPassword'));
      return;
    }

    try {
      setIsSubmitting(true);

      await verifyStudyPassword(studyId, password);

      sessionStorage.setItem(`study-auth-${studyId}`, 'true');
      setStatus('verified');
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

  if (status === 'checking') return null;

  if (status === 'unverified') {
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
