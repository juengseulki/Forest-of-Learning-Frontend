import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import arrowRightIcon from '@/shared/images/icons/ic_arrow_right.svg';

function toText(value, fallback = '') {
  if (value == null) return fallback;
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return value?.name || fallback;
}

function HabitPageHeader({ studyId, studyTitle, formattedTime }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const displayStudyTitle = toText(studyTitle, t('studyDefault'));

  return (
    <header className="habit-home__header">
      <div className="habit-home__top">
        <h1
          className="habit-home__title home__titile"
          onClick={() => {
            if (!studyId) return;
            navigate(`/studies/${studyId}`);
          }}
        >
          {displayStudyTitle}
        </h1>

        <div className="habit-home__nav">
          <button
            type="button"
            className="habit-home__nav-btn common-action-btn"
            onClick={() => {
              if (!studyId) return;
              navigate(`/studies/${studyId}/focus`);
            }}
          >
            <span className="habit-home__nav-text">{t('todayFocus')}</span>
            <img
              src={arrowRightIcon}
              alt={t('arrowRight')}
              className="common-action-icon habit-home__nav-icon"
            />
          </button>

          <button
            type="button"
            className="habit-home__nav-btn habit-home__nav-btn--small common-action-btn"
            onClick={() => navigate('/')}
          >
            <span className="habit-home__nav-text">{t('home')}</span>
            <img
              src={arrowRightIcon}
              alt={t('arrowRight')}
              className="common-action-icon habit-home__nav-icon"
            />
          </button>
        </div>
      </div>

      <div className="habit-home__time">
        <span className="habit-home__time-label">{t('currentTime')}</span>
        <span className="habit-home__time-value common-point-box">
          {formattedTime}
        </span>
      </div>
    </header>
  );
}

export default HabitPageHeader;
