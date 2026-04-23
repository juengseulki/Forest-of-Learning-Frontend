import '../../../styles/StudyList.css';
import StudyCard from './StudyCard.jsx';
import getBackgroundTheme from '../../../shared/utils/backgroundTheme.js';
import { getStudyCardProps } from '../utils/studyUtils.js';

function StudyList({ studies = [] }) {
  return (
    <div className="card-list">
      {studies.filter(Boolean).map((item) => {
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
