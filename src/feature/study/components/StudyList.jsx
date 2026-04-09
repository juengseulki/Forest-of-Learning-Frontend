import React from 'react';
import StudyCard from './StudyCard';
import { studiesMockResponse } from '../../../mocks/study/studyMockData.js';
import { pointMockResponse } from '../../../mocks/point/pointMockData.js';
import '../../../styles/StudyList.css';

function StudyList() {
  const study = studiesMockResponse.data.items;
  const point = pointMockResponse.data;
  return (
    <div className="card-list">
      {study.map((studys) => {
        return (
          <div key={studys.id}>
            <StudyCard studys={studys} point={point} />
          </div>
        );
      })}
    </div>
  );
}

export default StudyList;
