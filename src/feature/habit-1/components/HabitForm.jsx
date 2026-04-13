import trashIcon from '../../../images/icon/ic_trash.svg';

function HabitForm({
  isOpen,
  draftHabitList,
  draftInputs,
  isSubmitting,
  onClose,
  onDeleteDraftHabit,
  onAddInputRow,
  onChangeInputRow,
  onDeleteInputRow,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="habit-modal" onClick={onClose}>
      <div
        className="habit-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="habit-modal__title">습관 목록</h3>

        <div className="habit-form__list">
          {draftHabitList.map((habit) => (
            <div key={habit.id} className="habit-form__row">
              <div className="habit-form__item">
                <span className="habit-form__item-name">{habit.name}</span>
              </div>

              <button
                type="button"
                className="habit-form__action-btn habit-form__action-btn--delete"
                onClick={() => onDeleteDraftHabit(habit.id)}
                disabled={isSubmitting}
              >
                <img src={trashIcon} alt="삭제" />
              </button>
            </div>
          ))}

          {draftInputs.map((input) => (
            <div key={input.id} className="habit-form__row">
              <div className="habit-form__item habit-form__item--input">
                <input
                  type="text"
                  className="habit-form__input"
                  placeholder="__________________"
                  value={input.name}
                  onChange={(e) => onChangeInputRow(input.id, e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="button"
                className="habit-form__action-btn habit-form__action-btn--delete"
                onClick={() => onDeleteInputRow(input.id)}
                disabled={isSubmitting}
              >
                <img src={trashIcon} alt="입력 삭제" />
              </button>
            </div>
          ))}

          {draftHabitList.length === 0 && draftInputs.length === 0 && (
            <div className="habit-empty habit-empty--modal">
              <p className="habit-empty__title">등록된 습관이 없어요</p>
              <p className="habit-empty__desc">플러스를 눌러 추가해보세요</p>
            </div>
          )}
        </div>

        <button
          type="button"
          className="habit-form__add-btn"
          onClick={onAddInputRow}
          disabled={isSubmitting}
        >
          +
        </button>

        <div className="habit-modal__footer">
          <button
            type="button"
            className="habit-modal__cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </button>

          <button
            type="button"
            className="habit-modal__submit"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '수정 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitForm;
