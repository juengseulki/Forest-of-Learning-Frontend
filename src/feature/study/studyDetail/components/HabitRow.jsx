import React from 'react';
import { useTranslation } from 'react-i18next';
import { HABIT_ICONS } from '../utils/habitIcons.js';

function HabitRow({ habits, weekDays, translatedMap = {} }) {
  const { t } = useTranslation();

  return (
    <div>
      {habits.map((habit, index) => {
        const currentCompletedIcon =
          HABIT_ICONS.COMPLETED_LIST[index % HABIT_ICONS.COMPLETED_LIST.length];

        return (
          <div key={habit.habitId} className="habit-row">
            <div className="habit-name">
              {translatedMap[habit.habitId] || habit.habitName}
            </div>

            <div className="day-cells-container">
              {weekDays.map((day) => {
                const status = habit.dates[day];
                return (
                  <div key={day} className="day-cell">
                    {status === true ? (
                      <img src={currentCompletedIcon} alt={t('completedAlt')} />
                    ) : status === false ? (
                      <img src={HABIT_ICONS.EMPTY} alt={t('notCompletedAlt')} />
                    ) : (
                      <img src={HABIT_ICONS.BLACK} alt={t('noHabitAlt')} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default HabitRow;
