import { memo } from 'react';

import StudyCard from './StudyCard.jsx';
import getBackgroundTheme from '../../../shared/utils/backgroundTheme.js';
import { getStudyCardProps } from '../utils/studyUtils.js';

import '../../../styles/StudyList.css';

function StudyList({ studies = [], onStudyClick }) {
  return (
    <div className="card-list">
      {studies.filter(Boolean).map((item) => {
        const cardProps = getStudyCardProps({
          item,
          getBackgroundTheme,
        });

        return (
          <StudyCard
            key={item.id}
            id={item.id}
            {...cardProps}
            onClick={onStudyClick}
          />
        );
      })}
    </div>
  );
}

export default memo(StudyList);
