import { useState } from 'react';

import StudyList from '../feature/study/components/StudyList';
import ic_search from '../shared/images/icons/ic_search.png';

import '../styles/HomePage.css';

function HomePage() {
  const [listPage, setListPage] = useState(1);

  const listLimit = 6;
  const recentLimit = 3;

  function moreSee() {
    setListPage((prev) => prev + 1);
  }

  return (
    <div className="main-container">
      <section className="recent-lookup">
        <p className="home-title">최근 조회한 스터디</p>
        <div className="recent-scroll">
          <StudyList visibleCount={recentLimit} />
        </div>
      </section>

      <section className="study-list">
        <div className="list-top">
          <p className="home-title">스터디 둘러보기</p>

          <div className="filter">
            <div className="search-container">
              <img src={ic_search} alt="검색 아이콘" />
              <input placeholder="검색" />
            </div>

            <select className="select-container">
              <option>최근순</option>
              <option>오래된 순</option>
              <option>많은 포인트 순</option>
              <option>적은 포인트 순</option>
            </select>
          </div>

          <StudyList visibleCount={listPage * listLimit} />
        </div>

        <div className="button-container">
          <button className="see-more" onClick={moreSee}>
            더보기
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
