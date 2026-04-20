import { useMemo } from 'react';
import '../../../styles/StudyList.css';
import StudyCard from './StudyCard';
import getBackgroundTheme from '../../../shared/utils/backgroundTheme.js';
import { getStudyCardProps } from '../utils/studyUtils';

function StudyList({ studies = [], visibleCount = 0 }) {
  const visibleStudies = useMemo(() => {
    return studies.slice(0, visibleCount).filter(Boolean);
  }, [studies, visibleCount]);

  return (
    <div className="card-list">
      {visibleStudies.map((item) => {
        const cardProps = getStudyCardProps({
          item,
          getBackgroundTheme,
        });

        return <StudyCard key={item.id} id={item.id} {...cardProps} />;
      })}
    </div>
  );
}

export default StudyList;
