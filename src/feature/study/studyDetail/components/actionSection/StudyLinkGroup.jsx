import arrowRightIcon from '../../../../../shared/images/icons/ic_arrow_right.svg';
import { useTranslation } from 'react-i18next';

function StudyLinkGroup({ onHabitClick, onFocusClick }) {
  const { t } = useTranslation();

  return (
    <div className="detail-link-group">
      <button
        type="button"
        className="link-btn common-action-btn"
        onClick={onHabitClick}
      >
        {t('todayHabit')}{' '}
        <img
          src={arrowRightIcon}
          className="common-action-icon"
          alt={t('arrowRight')}
        />
      </button>

      <button
        type="button"
        className="link-btn common-action-btn"
        onClick={onFocusClick}
      >
        {t('todayFocus')}{' '}
        <img
          src={arrowRightIcon}
          className="common-action-icon"
          alt={t('arrowRight')}
        />
      </button>
    </div>
  );
}

export default StudyLinkGroup;
