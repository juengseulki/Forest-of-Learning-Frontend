import { useState, useCallback } from 'react';
import { createHabit, updateHabit } from '../../../api/habitApi';

const INITIAL_FORM = { name: '' };

function useHabitForm(studyId, { onSuccess } = {}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setFormData(INITIAL_FORM);
    setError(null);
  }

  const initForm = useCallback((habit) => {
    setFormData({ name: habit.name });
  }, []);

  async function submitCreate() {
    if (!formData.name.trim()) {
      setError(new Error('습관 이름을 입력해주세요.'));
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await createHabit(studyId, formData);
      resetForm();
      onSuccess?.(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function submitUpdate(habitId) {
    if (!formData.name.trim()) {
      setError(new Error('습관 이름을 입력해주세요.'));
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await updateHabit(studyId, habitId, formData);
      resetForm();
      onSuccess?.(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    formData,
    isLoading,
    error,
    handleChange,
    resetForm,
    initForm,
    submitCreate,
    submitUpdate,
  };
}

export default useHabitForm;
