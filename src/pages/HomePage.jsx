import StudyList from '../feature/study/components/StudyList';
import { useHomeStudies } from '../feature/study/hooks/useHomeStudies';
import ic_search from '../shared/images/icons/ic_search.png';

import '../styles/HomePage.css';

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
    visibleCount,
    hasMore,
    moreSee,
    clearRecentStudyList,
  } = useHomeStudies();

  return (
    <div className="main-container">
      <section className="recent-lookup">
        <div className="home-section-header">
          <p className="home-title">최근 조회한 스터디</p>

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

      <section className="study-list">
        <div className="list-top">
          <p className="home-title">스터디 둘러보기</p>

          <div className="filter">
            <div className="search-container">
              <img src={ic_search} alt="검색 아이콘" />
              <input
                placeholder="검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <select
              className="select-container"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            >
              <option value="latest">최근순</option>
              <option value="oldest">오래된 순</option>
              <option value="pointDesc">많은 포인트 순</option>
              <option value="pointAsc">적은 포인트 순</option>
            </select>
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
