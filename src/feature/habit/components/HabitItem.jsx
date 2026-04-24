function HabitItem({ habit, onToggle }) {
  const isDone = Boolean(habit.todayRecord?.completed);

  return (
    <button
      type="button"
      className={`habit-item ${isDone ? 'habit-item--done' : ''}`}
      onClick={onToggle}
    >
      {habit.name ?? habit.habitName}
    </button>
  );
}

export default HabitItem;
