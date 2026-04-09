import React from 'react';
import StudyCard from './StudyCard';
import { studiesMockResponse } from '../../../mocks/study/studyMockData.js';
import { pointMockResponse } from '../../../mocks/point/pointMockData.js';
import { emojiMockResponse } from '../../../mocks/emoji/emojiMockData.js';
import '../../../styles/StudyList.css';

function StudyList({ study, point }) {
  return (
    <div className="card-list">
      {study.map((studys) => {
        const emoji = emojiMockResponse.data.items.find(
          (item) => item.studyId === studys.id
        );
        return (
          <div key={studys.id}>
            <StudyCard studys={studys} point={point} emoji={emoji} />
          </div>
        );
      })}
    </div>
  );
}

export default StudyList;
