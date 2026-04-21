import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="habit-modal" onClick={onClose}>
      <div
        className="habit-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="habit-modal__title">{t('habitListTitle')}</h3>

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
                <img src={trashIcon} alt={t('habitDeleteAlt')} />
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
                <img src={trashIcon} alt={t('habitInputDeleteAlt')} />
              </button>
            </div>
          ))}

          {draftHabitList.length === 0 && draftInputs.length === 0 && (
            <div className="habit-empty habit-empty--modal">
              <p className="habit-empty__title">{t('habitEmptyTitle')}</p>
              <p className="habit-empty__desc">{t('habitEmptyDesc')}</p>
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
            {t('habitCancel')}
          </button>

          <button
            type="button"
            className="habit-modal__submit"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('habitSaving') : t('habitSaveDone')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HabitForm;
