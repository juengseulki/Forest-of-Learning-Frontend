import './HabitItem.css';

function HabitItem({ habit, isChecked, onToggle, onEdit, onDelete }) {
  return (
    <li className="habit-item">
      <button
        type="button"
        className={`habit-item__check ${isChecked ? 'habit-item__check--checked' : ''}`}
        onClick={() => onToggle(habit.id)}
      >
        {isChecked && (
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M1 5L5.5 9.5L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <span className={`habit-item__name ${isChecked ? 'habit-item__name--checked' : ''}`}>
        {habit.name}
      </span>

      <div className="habit-item__actions">
        <button className="habit-item__btn" onClick={() => onEdit(habit)}>
          수정
        </button>
        <button className="habit-item__btn habit-item__btn--delete" onClick={() => onDelete(habit.id)}>
          삭제
        </button>
      </div>
    </li>
  );
}

export default HabitItem;