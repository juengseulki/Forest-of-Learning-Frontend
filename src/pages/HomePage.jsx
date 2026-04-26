import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useHomeStudies } from '../feature/study/hooks/useHomeStudies.js';
import RecentStudySection from '../feature/study/components/home/RecentStudySection.jsx';
import StudyBrowseSection from '../feature/study/components/home/StudyBrowseSection.jsx';

import '../styles/HomePage.css';
import '../styles/global.css';

function HomePage() {
  const navigate = useNavigate();

  const {
    keyword,
    setKeyword,
    order,
    setOrder,
    isLoading,
    isFetchingNextPage,
    studies,
    recentStudies,
    hasMore,
    moreSee,
    addRecentStudyItem,
    clearRecentStudyList,
  } = useHomeStudies();

  const scrollPosRef = useRef(null);
  const prevLengthRef = useRef(studies.length);

  useEffect(() => {
    if (
      scrollPosRef.current !== null &&
      studies.length > prevLengthRef.current
    ) {
      window.scrollTo(0, scrollPosRef.current);
      scrollPosRef.current = null;
    }

    prevLengthRef.current = studies.length;
  }, [studies.length]);

  function handleMoreSee() {
    scrollPosRef.current = window.scrollY;
    moreSee();
  }

  function handleStudyClick(study) {
    addRecentStudyItem(study);
    navigate(`/studies/${study.id}`);
  }

  return (
    <div className="main-container">
      <RecentStudySection
        studies={recentStudies}
        onStudyClick={handleStudyClick}
        onClear={clearRecentStudyList}
      />

      <StudyBrowseSection
        keyword={keyword}
        onChangeKeyword={setKeyword}
        order={order}
        onChangeOrder={setOrder}
        studies={studies}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasMore={hasMore}
        onMoreSee={handleMoreSee}
        onStudyClick={handleStudyClick}
      />
    </div>
  );
}

export default HomePage;
