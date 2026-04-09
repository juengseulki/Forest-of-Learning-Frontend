import { useEffect } from 'react';
import './HabitForm.css';

function HabitForm({
  editTarget,
  formData,
  isLoading,
  error,
  onChange,
  onSubmitCreate,
  onSubmitUpdate,
  onCancel,
  initForm,
}) {
  const isEditMode = Boolean(editTarget);

  useEffect(() => {
    if (editTarget) {
      initForm(editTarget);
    }
  }, [editTarget, initForm]);

  function handleSubmit() {
    if (isEditMode) {
      onSubmitUpdate(editTarget.id);
    } else {
      onSubmitCreate();
    }
  }

  return (
    <div className="habit-form">
      <input
        className="habit-form__input"
        type="text"
        name="name"
        value={formData.name}
        onChange={onChange}
        placeholder="습관 이름을 입력하세요"
        disabled={isLoading}
        maxLength={30}
      />

      {error && (
        <p className="habit-form__error">{error.message ?? '오류가 발생했습니다.'}</p>
      )}

      <div className="habit-form__actions">
        <button className="habit-form__btn habit-form__btn--cancel" onClick={onCancel} disabled={isLoading}>
          취소
        </button>
        <button className="habit-form__btn habit-form__btn--submit" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? '저장 중...' : isEditMode ? '수정' : '추가'}
        </button>
      </div>
    </div>
  );
}

export default HabitForm;