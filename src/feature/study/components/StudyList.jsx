import React from 'react';
import { backgroundsMockResponse } from '../../../mocks/background/backgroundMockData';
import StudyCard from './StudyCard';

function StudyList() {
  console.log(backgroundsMockResponse);
  return (
    <div>
      <StudyCard />
    </div>
  );
}

export default StudyList;
