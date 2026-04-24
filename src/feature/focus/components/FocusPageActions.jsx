import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import arrowRightIcon from '@/shared/images/icons/ic_arrow_right.svg';

function FocusPageActions({ studyId, onOpenRecordModal }) {
  const { t } = useTranslation();

  return (
    <div className="focus-page__actions">
      <button
        type="button"
        className="focus-page__action-btn common-action-btn"
        onClick={onOpenRecordModal}
      >
        <span>{t('viewPointLog')}</span>
      </button>

      <Link
        to={`/studies/${studyId}/habit`}
        className="focus-page__action-btn common-action-btn"
      >
        <span>{t('todayHabit')}</span>
        <img
          src={arrowRightIcon}
          alt={t('arrowRight')}
          className="focus-page__action-icon"
        />
      </Link>

      <Link to="/" className="focus-page__action-btn common-action-btn">
        <span>{t('home')}</span>
        <img
          src={arrowRightIcon}
          alt={t('arrowRight')}
          className="focus-page__action-icon"
        />
      </Link>
    </div>
  );
}

export default FocusPageActions;
