import StudyList from '../feature/study/components/StudyList';
import '../styles/HomePage.css';
import ic_search from '../shared/images/icons/ic_search.png';
import { studiesMockResponse } from '../mocks/study/studyMockData.js';
import { pointMockResponse } from '../mocks/point/pointMockData.js';
import { useState } from 'react';

function HomePage() {
  const study = studiesMockResponse.data.items;
  const point = pointMockResponse.data;

  // API 연동 이후 삭제
  const recentLimit = 3;
  const recentPage = 1;
  const recentStartIndex = (recentPage - 1) * recentLimit;
  const recentEndIndex = recentStartIndex + recentLimit;
  const recentStudy = study.slice(recentStartIndex, recentEndIndex);

  const listLimit = 6;
  const [listPage, setListPage] = useState(1);
  const listStudy = study.slice(0, listPage * listLimit);

  function moreSee() {
    setListPage((t) => t + 1);
    console.log('클릭됨');
  }
  console.log(listStudy);

  return (
    <div className="main-container">
      <section className="recent-lookup">
        <p className="home-title">최근 조회한 스터디</p>
        <StudyList study={recentStudy} point={point} />
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
          <StudyList study={listStudy} point={point} />
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
