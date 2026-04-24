import { useTranslation } from 'react-i18next';
import HabitList from './HabitList.jsx';

function HabitCard({
  habitList,
  isLoading,
  isError,
  onOpenModal,
  onToggleHabit,
}) {
  const { t } = useTranslation();

  return (
    <section className="habit-card common-card common-panel-md">
      <div className="habit-card__header">
        <div className="habit-card__header-left" />
        <h2 className="habit-card__title">{t('todayHabit')}</h2>

        <button
          type="button"
          className="habit-card__edit"
          onClick={onOpenModal}
        >
          {t('editList')}
        </button>
      </div>

      <HabitList
        habitList={habitList}
        isLoading={isLoading}
        isError={isError}
        onToggleHabit={onToggleHabit}
      />
    </section>
  );
}

export default HabitCard;
