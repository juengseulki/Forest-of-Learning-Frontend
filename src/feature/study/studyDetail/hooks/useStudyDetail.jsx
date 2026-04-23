import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Toast from '../../../../shared/components/toast/Toast.jsx';
import handleApiError from '../../../../utils/handleApiError.jsx';
import {
  getStudy,
  verifyStudyPassword,
  deleteStudy,
} from '../../../../api/studyApi.js';
import { useStudy } from '../../../../contexts/StudyContext';

export function useStudyDetail(studyId) {
  const navigate = useNavigate();
  const { state, dispatch } = useStudy();
  const { t } = useTranslation();

  const [study, setStudy] = useState({});
  const [notFound, setNotFound] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  const parsedStudyId = Number(studyId);

  const studyFromStore = useMemo(() => {
    return state.studies.find((item) => item.id === parsedStudyId);
  }, [state.studies, parsedStudyId]);

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

  useEffect(() => {
    if (studyFromStore) {
      setStudy(studyFromStore);
      return;
    }

    if (!studyId) return;

    const fetchStudy = async () => {
      try {
        const targetStudy = await getStudy(studyId);
        setStudy(targetStudy);

        dispatch({
          type: 'SET_STUDIES',
          payload: [...state.studies, targetStudy],
        });
      } catch (error) {
        if (error.status === 404 || error.code === 'NOT_FOUND') {
          setNotFound(true);
        } else {
          handleApiError(error, t('studyInfoLoadFail'));
        }
      }
    };

    fetchStudy();
  }, [studyId, studyFromStore, dispatch, state.studies, t]);

  const getActionLabel = useCallback(() => {
    switch (pendingAction) {
      case 'edit':
        return t('goToEdit');
      case 'delete':
        return t('delete');
      case 'habit':
        return t('goToHabit');
      case 'focus':
        return t('goToFocus');
      case 'record':
        return t('viewPointLog');
      default:
        return t('confirm');
    }
  }, [pendingAction, t]);

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
        return;
      }

      if (action === 'record') {
        setIsRecordModalOpen(true);
      }
    },
    [navigate, studyId]
  );

  const handleRequirePassword = useCallback(
    (action) => {
      const isVerified =
        sessionStorage.getItem(`study-auth-${studyId}`) === 'true';

      // edit는 항상 비밀번호 모달을 띄운다.
      if (isVerified && (action === 'habit' || action === 'focus')) {
        moveByAction(action);
        return;
      }

      setPendingAction(action);
      setPassword('');
      setIsPasswordModalOpen(true);
    },
    [studyId, moveByAction]
  );

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

  const handleSubmitPassword = useCallback(async () => {
    if (!password.trim()) {
      showToast('info', '💙', t('enterPassword'));
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

      if (pendingAction === 'habit' || pendingAction === 'focus') {
        sessionStorage.setItem(`study-auth-${studyId}`, 'true');
      }

      handleClosePasswordModal();
      moveByAction(pendingAction);
    } catch (error) {
      showToast('danger', '❌', error.message || t('commonError'));
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
    t,
  ]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      setIsSubmitting(true);
      await deleteStudy(studyId, password);

      dispatch({
        type: 'SET_STUDIES',
        payload: state.studies.filter((item) => item.id !== parsedStudyId),
      });

      dispatch({
        type: 'SET_RECENT',
        payload: state.recentStudies.filter(
          (item) => item.id !== parsedStudyId
        ),
      });

      setIsDeleteConfirmModalOpen(false);
      setPassword('');
      setPendingAction(null);

      showToast('success', '💚', t('deleteSuccess'));
      navigate('/');
    } catch (error) {
      showToast('danger', '❌', error.message || t('deleteFail'));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    studyId,
    password,
    dispatch,
    state.studies,
    state.recentStudies,
    parsedStudyId,
    showToast,
    navigate,
    t,
  ]);

  return {
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
    handleOpenRecordModal,
    handleCloseRecordModal,
    getActionLabel,
  };
}
