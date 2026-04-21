import { useState } from 'react';

import StudyList from '../feature/study/components/StudyList';
import { useHomeStudies } from '../feature/study/hooks/useHomeStudies';
import ic_search from '../shared/images/icons/ic_search.png';
import ic_select_arrow from '../shared/components/icons/icon/ic_select_arrow.png';

import '../styles/HomePage.css';
import '../styles/global.css';

function HomePage() {
  const {
    recentLimit,
    keyword,
    setKeyword,
    setOrder,
    isLoading,
    filteredStudies,
    recentStudies,
    visibleCount,
    hasMore,
    moreSee,
    clearRecentStudyList,
  } = useHomeStudies();

  const [isOpen, setIsOpen] = useState(false);
  const [label, setLabel] = useState('최근순');

  function handleSelect(text, value) {
    setLabel(text);
    setOrder(value);
    setIsOpen(false);
  }

  return (
    <div className="main-container">
      <section className="recent-lookup common-panel-lg">
        <div className="home-section-header">
          <p className="home-title common-title-lg">최근 조회한 스터디</p>

          {recentStudies.length > 0 && (
            <button
              type="button"
              className="recent-clear-button"
              onClick={clearRecentStudyList}
            >
              🍃 비우기
            </button>
          )}
        </div>

        <div className="recent-scroll">
          {recentStudies.length === 0 ? (
            <div className="look-study">
              <p className="null-text">아직 조회한 스터디가 없어요</p>
            </div>
          ) : (
            <StudyList studies={recentStudies} visibleCount={recentLimit} />
          )}
        </div>
      </section>

      <section className="study-list common-panel-lg">
        <div className="list-top">
          <p className="home-title common-title-lg">스터디 둘러보기</p>

          <div className="filter">
            <div className="search-container common-field">
              <img src={ic_search} alt="검색 아이콘" />
              <input
                className="common-field-control"
                placeholder="검색"
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
                <img src={ic_select_arrow} />
              </button>
              <ul className="optionList">
                <li
                  className="optionItem"
                  onClick={() => handleSelect('최근순', 'latest')}
                >
                  최근순
                </li>
                <li
                  className="optionItem"
                  onClick={() => handleSelect('오래된 순', 'oldest')}
                >
                  오래된 순
                </li>
                <li
                  className="optionItem"
                  onClick={() => handleSelect('많은 포인트 순', 'pointDesc')}
                >
                  많은 포인트 순
                </li>
                <li
                  className="optionItem"
                  onClick={() => handleSelect('적은 포인트 순', 'pointAsc')}
                >
                  적은 포인트 순
                </li>
              </ul>
            </div>
          </div>
          {isLoading ? (
            <div className="look-study">
              <p className="null-text">스터디를 불러오는 중이에요...</p>
            </div>
          ) : filteredStudies.length === 0 ? (
            <div className="look-study">
              <p className="null-text">아직 둘러 볼 스터디가 없어요</p>
            </div>
          ) : (
            <StudyList studies={filteredStudies} visibleCount={visibleCount} />
          )}
        </div>

        {hasMore && (
          <div className="button-container">
            <button type="button" className="see-more" onClick={moreSee}>
              더보기
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
