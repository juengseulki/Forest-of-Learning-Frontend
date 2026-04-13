import useHabitList from '../hooks/useHabitList';
import useHabitRecord from '../hooks/useHabitRecord';
import { getDateRange } from '../utils/habitDate';

function HabitRecordTable({ studyId, startDate, endDate }) {
  const dateRange = getDateRange(startDate, endDate);

  const { habits, isLoading: habitsLoading } = useHabitList(studyId);
  const { isChecked, isLoading: recordsLoading } = useHabitRecord(studyId, {
    startDate,
    endDate,
  });

  if (habitsLoading || recordsLoading) {
    return <p className="record-table__loading">불러오는 중...</p>;
  }

  if (habits.length === 0) {
    return <p className="record-table__empty">등록된 습관이 없습니다.</p>;
  }

  return (
    <div className="record-table__wrapper">
      <table className="record-table">
        <thead>
          <tr>
            <th className="record-table__habit-col">습관</th>
            {dateRange.map(({ dateString, label, isToday }) => (
              <th
                key={dateString}
                className={`record-table__date-col ${isToday ? 'record-table__date-col--today' : ''}`}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {habits.map((habit) => (
            <tr key={habit.id} className="record-table__row">
              <td className="record-table__habit-name">{habit.name}</td>
              {dateRange.map(({ dateString, isToday }) => {
                const checked = isChecked(habit.id, dateString);
                return (
                  <td
                    key={dateString}
                    className={`record-table__cell ${isToday ? 'record-table__cell--today' : ''}`}
                  >
                    <span
                      className={`record-table__dot ${checked ? 'record-table__dot--checked' : ''}`}
                      aria-label={checked ? '완료' : '미완료'}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HabitRecordTable;