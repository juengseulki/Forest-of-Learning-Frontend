import arrowRightIcon from '../../../../../shared/images/icons/ic_arrow_right.svg';

function StudyLinkGroup({ onHabitClick, onFocusClick }) {
  return (
    <div className="detail-link-group">
      <button
        type="button"
        className="link-btn common-action-btn"
        onClick={onHabitClick}
      >
        오늘의 습관{' '}
        <img
          src={arrowRightIcon}
          className="common-action-icon"
          alt="오른쪽 화살표"
        />
      </button>

      <button
        type="button"
        className="link-btn common-action-btn"
        onClick={onFocusClick}
      >
        오늘의 집중{' '}
        <img
          src={arrowRightIcon}
          className="common-action-icon"
          alt="오른쪽 화살표"
        />
      </button>
    </div>
  );
}

export default StudyLinkGroup;
