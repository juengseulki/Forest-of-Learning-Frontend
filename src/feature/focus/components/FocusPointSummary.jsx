import { useTranslation } from 'react-i18next';
import pointIcon from '../../../shared/images/icons/ic_point.png';

function FocusPointSummary({ totalPoint, isLoading, isError }) {
  const { t } = useTranslation();

  return (
    <div className="focus-page__point-group">
      <p className="focus-page__study-desc">{t('earnedPoint')}</p>

      <div className="common-point-box">
        <img
          src={pointIcon}
          alt={t('pointIconAlt')}
          className="focus-page__point-icon"
        />

        <span className="focus-page__point-text">
          {isLoading ? '...' : isError ? '-' : `${totalPoint}P ${t('earned')}`}
        </span>
      </div>
    </div>
  );
}

export default FocusPointSummary;
