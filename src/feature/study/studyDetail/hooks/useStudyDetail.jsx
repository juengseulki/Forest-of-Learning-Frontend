import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Toast from '@/shared/components/toast/Toast.jsx';
import handleApiError from '@/utils/handleApiError.jsx';
import { getStudy, verifyStudyPassword, deleteStudy } from '@/api/studyApi.js';

function resolveStudyResponse(response) {
  return response?.data ?? response ?? {};
}

export function useStudyDetail(studyId) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const parsedStudyId = Number(studyId);

  const [password, setPassword] = useState('');
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

  const {
    data: study = {},
    isError,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['study', parsedStudyId],
    queryFn: async () => {
      const response = await getStudy(parsedStudyId);
      return resolveStudyResponse(response);
    },
    enabled: Boolean(parsedStudyId),
    retry: false,
    onError: (error) => {
      if (error.status === 404 || error.code === 'NOT_FOUND') return;
      handleApiError(error, t('studyInfoLoadFail'));
    },
  });

  const notFound =
    isError && (error?.status === 404 || error?.code === 'NOT_FOUND');

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

  const moveByAction = useCallback(
    (action) => {
      if (action === 'edit') {
        navigate(`/studies/${parsedStudyId}/edit`);
        return;
      }

      if (action === 'habit') {
        navigate(`/studies/${parsedStudyId}/habit`);
        return;
      }

      if (action === 'focus') {
        navigate(`/studies/${parsedStudyId}/focus`);
        return;
      }

      if (action === 'record') {
        setIsRecordModalOpen(true);
      }
    },
    [navigate, parsedStudyId]
  );

  const verifyPasswordMutation = useMutation({
    mutationFn: () => verifyStudyPassword(parsedStudyId, password),

    onSuccess: () => {
      if (pendingAction === 'delete') {
        setIsPasswordModalOpen(false);
        setIsDeleteConfirmModalOpen(true);
        return;
      }

      if (
        pendingAction === 'edit' ||
        pendingAction === 'habit' ||
        pendingAction === 'focus'
      ) {
        sessionStorage.setItem(`study-auth-${parsedStudyId}`, 'true');
      }

      handleClosePasswordModal();
      moveByAction(pendingAction);
    },

    onError: (error) => {
      showToast('danger', '❌', error.message || t('commonError'));
    },
  });

  const deleteStudyMutation = useMutation({
    mutationFn: () => deleteStudy(parsedStudyId, password),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['studies'] });
      queryClient.removeQueries({ queryKey: ['study', parsedStudyId] });

      setIsDeleteConfirmModalOpen(false);
      setPassword('');
      setPendingAction(null);

      showToast('success', '💚', t('deleteSuccess'));
      navigate('/');
    },

    onError: (error) => {
      showToast('danger', '❌', error.message || t('deleteFail'));
    },
  });

  const isSubmitting =
    verifyPasswordMutation.isPending || deleteStudyMutation.isPending;

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

  const handleRequirePassword = useCallback(
    (action) => {
      const isVerified =
        sessionStorage.getItem(`study-auth-${parsedStudyId}`) === 'true';

      if (
        isVerified &&
        (action === 'edit' || action === 'habit' || action === 'focus')
      ) {
        moveByAction(action);
        return;
      }

      setPendingAction(action);
      setPassword('');
      setIsPasswordModalOpen(true);
    },
    [parsedStudyId, moveByAction]
  );

  const handleSubmitPassword = useCallback(() => {
    if (!password.trim()) {
      showToast('info', '💙', t('enterPassword'));
      return;
    }

    verifyPasswordMutation.mutate();
  }, [password, showToast, t, verifyPasswordMutation]);

  const handleConfirmDelete = useCallback(() => {
    deleteStudyMutation.mutate();
  }, [deleteStudyMutation]);

  return {
    study,
    notFound,
    isLoading,
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
