import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import StudyList from '../feature/study/components/StudyList.jsx';
import { useHomeStudies } from '../feature/study/hooks/useHomeStudies.js';
import ic_search from '../shared/images/icons/ic_search.png';
import ic_select_arrow from '../shared/components/icons/icon/ic_select_arrow.png';

import '../styles/HomePage.css';
import '../styles/global.css';

function HomePage() {
  const {
    recentLimit,
    keyword,
    setKeyword,
    order,
    setOrder,
    isLoading,
    filteredStudies,
    recentStudies,
    hasMore,
    moreSee,
    clearRecentStudyList,
  } = useHomeStudies();

  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);

  const label = useMemo(() => {
    switch (order) {
      case 'oldest':
        return t('oldest');
      case 'pointDesc':
        return t('pointDesc');
      case 'pointAsc':
        return t('pointAsc');
      case 'latest':
      default:
        return t('latest');
    }
  }, [order, t]);

  function handleSelect(value) {
    setOrder(value);
    setIsOpen(false);
  }

  return (
    <div className="main-container">
      <section className="recent-lookup common-panel-lg">
        <div className="home-section-header">
          <p className="home-title common-title-lg">{t('recentStudies')}</p>

          {recentStudies.length > 0 && (
            <button
              type="button"
              className="recent-clear-button"
              onClick={clearRecentStudyList}
            >
              🍃 {t('clear')}
            </button>
          )}
        </div>

        <div className="recent-scroll">
          {recentStudies.length === 0 ? (
            <div className="look-study">
              <p className="null-text">{t('noRecentStudies')}</p>
            </div>
          ) : (
            <StudyList studies={recentStudies} visibleCount={recentLimit} />
          )}
        </div>
      </section>

      <section className="study-list common-panel-lg">
        <div className="list-top">
          <p className="home-title common-title-lg">{t('browseStudies')}</p>

          <div className="filter">
            <div className="search-container common-field">
              <img src={ic_search} alt="검색 아이콘" />
              <input
                className="common-field-control"
                placeholder={t('search')}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div className={`select ${isOpen ? 'active' : ''}`}>
              <button
                type="button"
                className="label"
                onClick={() => setIsOpen(!isOpen)}
              >
                {label}
                <img src={ic_select_arrow} alt="" />
              </button>

              <ul className="optionList">
                <li
                  className="optionItem"
                  onClick={() => handleSelect('latest')}
                >
                  {t('latest')}
                </li>
                <li
                  className="optionItem"
                  onClick={() => handleSelect('oldest')}
                >
                  {t('oldest')}
                </li>
                <li
                  className="optionItem"
                  onClick={() => handleSelect('pointDesc')}
                >
                  {t('pointDesc')}
                </li>
                <li
                  className="optionItem"
                  onClick={() => handleSelect('pointAsc')}
                >
                  {t('pointAsc')}
                </li>
              </ul>
            </div>
          </div>

          {isLoading ? (
            <div className="look-study">
              <p className="null-text">{t('loadingStudies')}</p>
            </div>
          ) : filteredStudies.length === 0 ? (
            <div className="look-study">
              <p className="null-text">{t('noStudies')}</p>
            </div>
          ) : (
            <StudyList studies={filteredStudies} />
          )}
        </div>

        {hasMore && (
          <div className="button-container">
            <button type="button" className="see-more" onClick={moreSee}>
              {t('seeMore')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
