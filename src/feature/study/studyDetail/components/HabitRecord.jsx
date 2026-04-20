import { useEffect, useState } from 'react';
import HabitRow from './HabitRow.jsx';
import handleApiError from '../../../../utils/handleApiError.jsx';
import { getWeekDays } from '../utils/getWeekDays';
import { getHabitRecords } from '../../../../api/habitApi.js';

function HabitRecord({ studyId }) {
  const [habits, setHabits] = useState([]);
  const [weekStart, setWeekStart] = useState('');

  const formatLocalDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const getThisWeekRange = () => {
    const now = new Date();
    const day = now.getDay(); // 0:일, 1:월, 2:화, 3:수, 4:목, 5:금, 6:토

    const daysToMonday = day === 0 ? 6 : day - 1;

    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    setWeekStart(monday);

    return {
      startDate: formatLocalDateTime(monday),
      endDate: formatLocalDateTime(sunday),
    };
  };

  useEffect(() => {
    if (!studyId) return;

    const fetchHabits = async () => {
      try {
        const { startDate, endDate } = getThisWeekRange();
        const habitData = await getHabitRecords(studyId, startDate, endDate);
        setHabits(habitData.items);
      } catch (error) {
        handleApiError(error, '습관 기록을 불러오지 못했습니다.');
      }
    };

    fetchHabits();
  }, [studyId]);

  const weekDays = getWeekDays(weekStart);

  return (
    <section className="detail-habit-section common-card">
      <h2>습관 기록표</h2>
      <div className="habit-scroll-container">
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
      </div>
    </section>
  );
}

export default HabitRecord;
