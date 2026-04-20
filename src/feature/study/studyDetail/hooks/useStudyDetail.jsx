import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Toast from '../../../../shared/components/toast/Toast.jsx';
import handleApiError from '../../../../utils/handleApiError.jsx';
import {
  getStudy,
  verifyStudyPassword,
  deleteStudy,
} from '../../../../api/studyApi.js';

export function useStudyDetail(studyId) {
  const navigate = useNavigate();

  const [study, setStudy] = useState({});
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const showToast = useCallback((type, icon, message) => {
    toast(<Toast type={type} icon={icon} message={message} />, {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false,
      pauseOnHover: false,
      draggable: false,
    });
  }, []);

  const fetchStudy = useCallback(async () => {
    if (!studyId) return;

    try {
      const targetStudy = await getStudy(studyId);
      setStudy(targetStudy);
    } catch (error) {
      handleApiError(error, '스터디 정보를 불러오지 못했습니다.');
    }
  }, [studyId]);

  useEffect(() => {
    fetchStudy();
  }, [fetchStudy]);

  const handleRequirePassword = useCallback((action) => {
    setPendingAction(action);
    setPassword('');
    setIsPasswordModalOpen(true);
  }, []);

  const handleClosePasswordModal = useCallback(() => {
    setIsPasswordModalOpen(false);
    setPassword('');
    setPendingAction(null);
  }, []);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setIsDeleteConfirmModalOpen(false);
    setPassword('');
    setPendingAction(null);
  }, []);

  const handleChangePassword = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleOpenRecordModal = useCallback(() => {
    setIsRecordModalOpen(true);
  }, []);

  const handleCloseRecordModal = useCallback(() => {
    setIsRecordModalOpen(false);
  }, []);

  const getActionLabel = useCallback(() => {
    switch (pendingAction) {
      case 'edit':
        return '수정하러 가기';
      case 'delete':
        return '삭제하기';
      case 'habit':
        return '오늘의 습관으로 가기';
      case 'focus':
        return '오늘의 집중으로 가기';
      default:
        return '확인';
    }
  }, [pendingAction]);

  const moveByAction = useCallback(
    (action) => {
      if (action === 'edit') {
        navigate(`/studies/${studyId}/edit`);
        return;
      }

      if (action === 'habit') {
        navigate(`/studies/${studyId}/habit`);
        return;
      }

      if (action === 'focus') {
        navigate(`/studies/${studyId}/focus`);
      }
    },
    [navigate, studyId]
  );

  const handleSubmitPassword = useCallback(async () => {
    if (!password.trim()) {
      showToast('info', '💙', '비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (pendingAction === 'delete') {
        await verifyStudyPassword(studyId, password);
        setIsPasswordModalOpen(false);
        setIsDeleteConfirmModalOpen(true);
        return;
      }

      await verifyStudyPassword(studyId, password);

      handleClosePasswordModal();
      showToast('success', '✅', '확인되었습니다.');
      moveByAction(pendingAction);
    } catch (error) {
      showToast('danger', '❌', error.message || '오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    password,
    pendingAction,
    studyId,
    showToast,
    handleClosePasswordModal,
    moveByAction,
  ]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await deleteStudy(studyId, password);

      setIsDeleteConfirmModalOpen(false);
      setPassword('');
      setPendingAction(null);

      showToast('success', '💚', '스터디가 삭제되었습니다.');
      navigate('/');
    } catch (error) {
      showToast(
        'danger',
        '❌',
        error.message || '삭제 중 오류가 발생했습니다.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [studyId, password, showToast, navigate]);

  return {
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
    handleOpenRecordModal,
    handleCloseRecordModal,
    getActionLabel,
  };
}
