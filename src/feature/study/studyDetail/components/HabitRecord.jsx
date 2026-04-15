import { useEffect, useState } from 'react';

import { habitRecordMockResponse } from '../../../../mocks/habit/habitMockData.js';
import HabitRow from './HabitRow.jsx';
import { getWeekDays } from '../utils/getWeekDays';

function HabitRecord({ studyId }) {
  const [habits, setHabits] = useState([]);
  const [weekStart, setWeekStart] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setHabits(habitRecordMockResponse.data.records);
      setWeekStart(habitRecordMockResponse.data.weekStart);
    }, 0);

    return () => clearTimeout(timer);
  }, [studyId]);

  const weekDays = getWeekDays(weekStart);

  return (
    <section className="detail-habit-section">
      <h2>습관 기록표</h2>

      {habits.length === 0 ? (
        <div className="empty-habit-container">
          <p>아직 습관이 없어요.</p>
          <p>오늘의 습관에서 습관을 생성해보세요!</p>
        </div>
      ) : (
        <div className="habit-wrapper">
          <div className="habit-weeks">
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span>토</span>
            <span>일</span>
          </div>
          <HabitRow habits={habits} weekDays={weekDays} />
        </div>
      )}
    </section>
  );
}

export default HabitRecord;
