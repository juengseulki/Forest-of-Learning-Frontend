function HabitItem({ habit, onToggle }) {
  return (
    <button
      id={`habit-${habit.id}`}
      type="button"
      className={`habit-item ${
        habit.todayRecord?.completed ? 'habit-item--done' : ''
      }`}
      onClick={() => onToggle(habit)}
    >
      {habit.name}
    </button>
  );
}

export default HabitItem;
