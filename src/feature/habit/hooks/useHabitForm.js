import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  createHabit,
  deleteHabit,
  verifyStudyPassword,
  checkStudySession,
} from '../../../api/habitApi.js';
import handleApiError from '../../../utils/handleApiError.jsx';
import { createDraftInput } from '../utils/habitUtils.js';

export function useHabitForm({
  studyId,
  habitList,
  onAfterCreate,
  onAfterDelete,
}) {
  const [draftHabitList, setDraftHabitList] = useState([]);
  const [draftInputs, setDraftInputs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openModal = () => {
    setDraftHabitList(habitList);
    setDraftInputs([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;

    setDraftHabitList([]);
    setDraftInputs([]);
    setIsModalOpen(false);
  };

  const addInputRow = () => {
    setDraftInputs((prevDraftInputs) => [
      ...prevDraftInputs,
      createDraftInput(),
    ]);
  };

  const changeInputRow = (id, value) => {
    setDraftInputs((prevDraftInputs) =>
      prevDraftInputs.map((input) =>
        input.id === id ? { ...input, name: value } : input
      )
    );
  };

  const deleteInputRow = (id) => {
    setDraftInputs((prevDraftInputs) =>
      prevDraftInputs.filter((input) => input.id !== id)
    );
  };

  const deleteDraftHabit = async (habitId) => {
    if (!studyId) {
      toast.error('유효한 studyId가 없어요.');
      return;
    }

    try {
      const sessionData = await checkStudySession(studyId);
      const isVerified = sessionData?.verified;

      if (!isVerified) {
        const password = window.prompt('스터디 비밀번호를 입력하세요.');
        if (!password) return;

        await verifyStudyPassword(studyId, password);
      }

      await deleteHabit(habitId);

      setDraftHabitList((prevDraftHabitList) =>
        prevDraftHabitList.filter((habit) => habit.id !== habitId)
      );

      onAfterDelete(habitId);
      toast.success('습관이 삭제되었어요.');
    } catch (error) {
      handleApiError(error, '습관 삭제에 실패했어요.');
    }
  };

  const submitHabitList = async () => {
    const habitNames = draftInputs
      .map((input) => input.name.trim())
      .filter(Boolean);

    if (habitNames.length === 0) {
      closeModal();
      return;
    }

    if (!studyId) {
      toast.error('유효한 studyId가 없어요.');
      return;
    }

    try {
      setIsSubmitting(true);

      for (const name of habitNames) {
        await createHabit(studyId, { name });
      }

      await onAfterCreate();
      closeModal();
    } catch (error) {
      handleApiError(error, '습관 생성에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    draftHabitList,
    draftInputs,
    isModalOpen,
    isSubmitting,
    openModal,
    closeModal,
    addInputRow,
    changeInputRow,
    deleteInputRow,
    deleteDraftHabit,
    submitHabitList,
  };
}
