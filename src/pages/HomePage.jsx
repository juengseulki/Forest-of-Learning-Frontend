import { useEffect, useState } from 'react';
import { getStudies } from '../../src/api/studyApi';
import StudyList from '../feature/study/components/StudyList';
import ic_search from '../shared/images/icons/ic_search.png';

import '../styles/HomePage.css';

function HomePage() {
  const [listPage, setListPage] = useState(1);
  const [studies, setStudies] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState('');

  //최근 조회 id 로컬에 저장
  const recentIds = JSON.parse(localStorage.getItem('recentStudies')) || [];

  const listLimit = 6;
  const recentLimit = 3;

  function moreSee() {
    setListPage((prev) => prev + 1);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudies();
        setStudies(data.items);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="main-container">
      <section className="recent-lookup">
        <p className="home-title">최근 조회한 스터디</p>
        <div className="recent-scroll">
          {recentIds.length === 0 ? (
            <div className="look-study">
              <p className="null-text">아직 조회한 스터디가 없어요</p>
            </div>
          ) : (
            <StudyList visibleCount={recentLimit} recentIds={recentIds} />
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
                onChange={(e) => {
                  setKeyword(e.target.value);
                }}
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
          {studies.length == 0 ? (
            <div className="look-study">
              <p className="null-text">아직 둘러 볼 스터디가 없어요</p>
            </div>
          ) : (
            <StudyList
              visibleCount={listPage * listLimit}
              keyword={keyword}
              order={order}
            />
          )}
        </div>
        {listPage * listLimit < studies.length && (
          <div className="button-container">
            <button className="see-more" onClick={moreSee}>
              더보기
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
