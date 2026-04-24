import { useTranslation } from 'react-i18next';

function HabitForm({
  isOpen,
  draftHabitList = [],
  draftInputs = [],
  isSubmitting = false,
  onClose,
  onDeleteDraftHabit,
  onAddInputRow,
  onChangeInputRow,
  onDeleteInputRow,
  onSubmit,
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="habit-modal" onClick={onClose}>
      <div
        className="habit-modal__content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="habit-modal__header">
          <h2>{t('editList')}</h2>

          <button
            type="button"
            className="habit-modal__close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="habit-modal__body">
          {draftHabitList.length > 0 && (
            <div className="habit-modal__section">
              <p className="habit-modal__section-title">{t('todayHabit')}</p>

              <ul className="habit-modal__list">
                {draftHabitList.map((habit) => (
                  <li key={habit.id} className="habit-modal__item">
                    <span>{habit.name}</span>

                    <button
                      type="button"
                      className="habit-modal__delete"
                      onClick={() => onDeleteDraftHabit(habit.id)}
                      disabled={isSubmitting}
                    >
                      {t('delete')}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="habit-modal__section">
            <p className="habit-modal__section-title">{t('addHabit')}</p>

            {draftInputs.map((input) => (
              <div key={input.id} className="habit-modal__input-row">
                <input
                  value={input.name}
                  placeholder={t('habitPlaceholder')}
                  onChange={(event) =>
                    onChangeInputRow(input.id, event.target.value)
                  }
                  disabled={isSubmitting}
                />

                <button
                  type="button"
                  className="habit-modal__delete"
                  onClick={() => onDeleteInputRow(input.id)}
                  disabled={isSubmitting}
                >
                  {t('delete')}
                </button>
              </div>
            ))}

            <button
              type="button"
              className="habit-modal__add"
              onClick={onAddInputRow}
              disabled={isSubmitting}
            >
              + {t('addHabit')}
            </button>
          </div>
        </div>

        <div className="habit-modal__footer">
          <button
            type="button"
            className="habit-modal__cancel"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {t('cancel')}
          </button>

          <button
            type="button"
            className="habit-modal__submit"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('loading') : t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitForm;
