import { useEffect, useMemo, useState } from 'react';
import { getStudies } from '../../src/api/studyApi';
import { getPoint } from '../api/pointApi';
import { getEmojiReactions } from '../api/emojiApi';
import StudyList from '../feature/study/components/StudyList';
import ic_search from '../shared/images/icons/ic_search.png';

import '../styles/HomePage.css';

function HomePage() {
  const [listPage, setListPage] = useState(1);
  const [studies, setStudies] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState('latest');
  const [isLoading, setIsLoading] = useState(false);

  const listLimit = 6;
  const recentLimit = 3;

  function moreSee() {
    setListPage((prev) => prev + 1);
  }

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const data = await getStudies();

        const studiesWithExtra = await Promise.all(
          (data?.items ?? []).map(async (study) => {
            const [pointData, emojiData] = await Promise.all([
              getPoint(study.id),
              getEmojiReactions(study.id),
            ]);

            return {
              ...study,
              point: pointData?.totalPoint ?? 0,
              emojis: emojiData?.items ?? [],
            };
          })
        );

        if (isMounted) {
          setStudies(studiesWithExtra);
        }
      } catch (error) {
        console.error('홈 스터디 목록 조회 실패:', error);
        if (isMounted) {
          setStudies([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStudies = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    let result = [...studies];

    if (normalizedKeyword) {
      result = result.filter((study) => {
        const nickname = study.nickname?.toLowerCase() ?? '';
        const name = study.name?.toLowerCase() ?? '';
        const description = study.description?.toLowerCase() ?? '';

        return (
          nickname.includes(normalizedKeyword) ||
          name.includes(normalizedKeyword) ||
          description.includes(normalizedKeyword)
        );
      });
    }

    switch (order) {
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'pointDesc':
        result.sort((a, b) => (b.point ?? 0) - (a.point ?? 0));
        break;
      case 'pointAsc':
        result.sort((a, b) => (a.point ?? 0) - (b.point ?? 0));
        break;
      case 'latest':
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [studies, keyword, order]);

  const recentStudies = useMemo(() => {
    return studies.slice(0, recentLimit);
  }, [studies]);

  return (
    <div className="main-container">
      <section className="recent-lookup">
        <p className="home-title">최근 조회한 스터디</p>
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
            <StudyList
              studies={filteredStudies}
              visibleCount={listPage * listLimit}
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
