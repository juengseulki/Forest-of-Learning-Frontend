import { useEffect, useState } from 'react';
import HabitRow from './HabitRow.jsx';
import { getWeekDays } from '../utils/getWeekDays';
import { getHabitRecords } from '../../../../api/habitApi.js';

function HabitRecord({ studyId }) {
  const [habits, setHabits] = useState([]);
  const [weekStart, setWeekStart] = useState('');

  const getThisWeekRange = () => {
    const now = new Date();
    const day = now.getDay(); // 오늘 요일 (0:일, 1:월...)

    // 1. 월요일까지 며칠 차이나는지 계산
    // (오늘 요일이 일요일(0)이면 6일 전으로, 아니면 요일-1 만큼 전으로)
    const daysToMonday = day === 0 ? 6 : day - 1;

    // 2. 월요일 구하기
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0); // 월요일 00:00:00

    // 3. 일요일 구하기 (월요일에서 6일 뒤)
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999); // 일요일 23:59:59

    setWeekStart(monday);
    return {
      startDate: monday.toISOString(),
      endDate: sunday.toISOString(),
    };
  };

  useEffect(() => {
    const featchHabits = async () => {
      const { startDate, endDate } = getThisWeekRange();
      const habitData = await getHabitRecords(studyId, startDate, endDate);
      console.log('habitData => ', habitData);
      setHabits(habitData.items);
    };
    featchHabits();
  }, [studyId]);

  const weekDays = getWeekDays(weekStart);

  return (
    <section className="detail-habit-section">
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
