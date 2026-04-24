import { useTranslation } from 'react-i18next';
import HabitItem from './HabitItem.jsx';

function HabitList({ habitList = [], isLoading, isError, onToggleHabit }) {
  const { t } = useTranslation();

  if (isLoading && habitList.length === 0) {
    return (
      <div className="habit-list">
        <div className="habit-empty">
          <p className="habit-empty__title">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="habit-list">
        <div className="habit-empty">
          <p className="habit-empty__title">
            {t('habitLoadFail') || '습관 목록을 불러오지 못했어요.'}
          </p>
        </div>
      </div>
    );
  }

  if (habitList.length === 0) {
    return (
      <div className="habit-list">
        <div className="habit-empty">
          <p className="habit-empty__title">{t('noHabit')}</p>
          <p className="habit-empty__desc">{t('createHabitGuide')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="habit-list">
      {habitList.map((habit) => {
        const habitId = habit.id ?? habit.habitId;

        return (
          <HabitItem
            key={habitId}
            habit={habit}
            onToggle={() => onToggleHabit(habitId)}
          />
        );
      })}
    </div>
  );
}

export default HabitList;
