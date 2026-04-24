import { useTranslation } from 'react-i18next';

import StudyList from '../StudyList.jsx';
import StudySearchFilter from './StudySearchFilter.jsx';

function StudyBrowseSection({
  keyword,
  onChangeKeyword,
  order,
  onChangeOrder,
  studies = [],
  isLoading,
  isFetchingNextPage,
  hasMore,
  onMoreSee,
  onStudyClick,
}) {
  const { t } = useTranslation();

  return (
    <section className="study-list common-panel-lg">
      <div className="list-top">
        <p className="home-title common-title-lg">{t('browseStudies')}</p>

        <StudySearchFilter
          keyword={keyword}
          onChangeKeyword={onChangeKeyword}
          order={order}
          onChangeOrder={onChangeOrder}
        />

        {isLoading && studies.length === 0 ? (
          <div className="look-study">
            <p className="null-text">{t('loadingStudies')}</p>
          </div>
        ) : studies.length === 0 ? (
          <div className="look-study">
            <p className="null-text">{t('noStudies')}</p>
          </div>
        ) : (
          <StudyList studies={studies} onStudyClick={onStudyClick} />
        )}
      </div>

      {hasMore && (
        <div className="button-container">
          <button
            type="button"
            className="see-more"
            onClick={onMoreSee}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? t('loadingStudies') : t('seeMore')}
          </button>
        </div>
      )}
    </section>
  );
}

export default StudyBrowseSection;
