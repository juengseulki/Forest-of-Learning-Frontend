import HabitRow from './HabitRow.jsx';
import { useHabitRecord } from '../hooks/useHabitRecord.js';

function HabitRecord({ studyId }) {
  const { habits, weekDays, hasHabits } = useHabitRecord(studyId);

  return (
    <section className="detail-habit-section common-card">
      <h2>습관 기록표</h2>

      <div className="habit-scroll-container">
        {!hasHabits ? (
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
