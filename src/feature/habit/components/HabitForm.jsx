import { useTranslation } from 'react-i18next';
import trashIcon from '../../../images/icon/ic_trash.svg';

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
        <h2 className="habit-modal__title">{t('editList')}</h2>

        <div className="habit-form__list">
          {draftHabitList.length > 0 ? (
            draftHabitList.map((habit) => (
              <div key={habit.id} className="habit-form__row">
                <div className="habit-form__item">
                  <span className="habit-form__item-name">{habit.name}</span>
                </div>

                <button
                  type="button"
                  className="habit-form__action-btn habit-form__action-btn--delete"
                  onClick={() => onDeleteDraftHabit(habit.id)}
                  disabled={isSubmitting}
                  aria-label={t('delete')}
                >
                  <img src={trashIcon} alt={t('habitDeleteAlt')} />
                </button>
              </div>
            ))
          ) : (
            <div className="habit-empty habit-empty--modal">
              <p className="habit-empty__title">{t('emptyHabitTitle')}</p>
              <p className="habit-empty__desc">{t('emptyHabitDescription')}</p>
            </div>
          )}

          {draftInputs.map((input) => (
            <div key={input.id} className="habit-form__row">
              <div className="habit-form__item habit-form__item--input">
                <input
                  className="habit-form__input"
                  value={input.name}
                  placeholder={t('habitPlaceholder')}
                  onChange={(event) =>
                    onChangeInputRow(input.id, event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="button"
                className="habit-form__action-btn habit-form__action-btn--delete"
                onClick={() => onDeleteInputRow(input.id)}
                disabled={isSubmitting}
                aria-label={t('delete')}
              >
                ×
              </button>
            </div>
          ))}

          <button
            type="button"
            className="habit-form__add-btn"
            onClick={onAddInputRow}
            disabled={isSubmitting}
          >
            +
          </button>
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
