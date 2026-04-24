import { useTranslation } from 'react-i18next';

import StudyList from '../StudyList.jsx';

function RecentStudySection({ studies = [], onStudyClick, onClear }) {
  const { t } = useTranslation();

  return (
    <section className="recent-lookup common-panel-lg">
      <div className="home-section-header">
        <p className="home-title common-title-lg">{t('recentStudies')}</p>

        {studies.length > 0 && (
          <button
            type="button"
            className="recent-clear-button"
            onClick={onClear}
          >
            🍃 {t('clear')}
          </button>
        )}
      </div>

      <div className="recent-scroll">
        {studies.length === 0 ? (
          <div className="look-study">
            <p className="null-text">{t('noRecentStudies')}</p>
          </div>
        ) : (
          <StudyList studies={studies} onStudyClick={onStudyClick} />
        )}
      </div>
    </section>
  );
}

export default RecentStudySection;
