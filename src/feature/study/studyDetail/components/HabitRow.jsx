import React from 'react';
import { HABIT_ICONS } from '../utils/habitIcons.js';

function HabitRow({ habits, weekDays }) {
  return (
    <div>
      {habits.map((habit, index) => {
        const currentCompletedIcon =
          HABIT_ICONS.COMPLETED_LIST[index % HABIT_ICONS.COMPLETED_LIST.length];

        return (
          <div key={habit.habitId} className="habit-row">
            <div className="habit-name">{habit.habitName}</div>

            <div className="day-cells-container">
              {weekDays.map((day) => {
                const status = habit.dates[day];
                return (
                  <div key={day} className="day-cell">
                    {status === true ? (
                      <img src={currentCompletedIcon} alt="완료" />
                    ) : status === false ? (
                      <img src={HABIT_ICONS.EMPTY} alt="미완료" />
                    ) : (
                      <img src={HABIT_ICONS.BLACK} alt="습관 없음" />
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
