import { useState } from 'react';
import HabitItem from './HabitItem';
import HabitForm from './HabitForm';
import useHabitList from '../hooks/useHabitList';
import useHabitMutations from '../hooks/useHabitForm';
import useHabitRecord from '../hooks/useHabitRecord';
import { getTodayString } from '../utils/habitDate';

function HabitList({ studyId }) {
  const today = getTodayString();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  // 데이터 훅
  const { habits, isLoading, error } = useHabitList(studyId);
  const { isChecked, toggleCheck } = useHabitRecord(studyId, {
    startDate: today,
    endDate: today,
  });

  // 생성/수정/삭제 훅
  const { deleteMutation } = useHabitMutations(studyId, {
    onSuccess: () => {
      setIsFormOpen(false);
      setEditTarget(null);
    },
  });

  function handleOpenCreate() {
    setEditTarget(null);
    setIsFormOpen(true);
  }

  if (isLoading) return <p>불러오는 중...</p>;
  if (error) return <p>습관 목록을 불러오지 못했습니다.</p>;

  return (
    <section className="habit-list">
      <div className="habit-list__header">
        <h3 className="habit-list__title">오늘의 습관</h3>
        <button className="habit-list__add-btn" onClick={handleOpenCreate}>
          + 습관 추가
        </button>
      </div>

      {isFormOpen && (
        <HabitForm
          studyId={studyId}
          editTarget={editTarget}
          onCancel={() => {
            setIsFormOpen(false);
            setEditTarget(null);
          }}
        />
      )}

      {habits.length === 0 ? (
        <p className="habit-list__empty">아직 등록된 습관이 없습니다.</p>
      ) : (
        <ul className="habit-list__items">
          {habits.map((habit) => (
            <HabitItem
              key={habit.id}
              habit={habit}
              isChecked={isChecked(habit.id, today)}
              onToggle={(id) => toggleCheck(id, today)}
              onEdit={() => {
                setEditTarget(habit);
                setIsFormOpen(true);
              }}
              onDelete={(id) => {
                if(window.confirm('정말 삭제하시겠습니까?')) {
                  deleteMutation.mutate(id);
                }
              }}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default HabitList;