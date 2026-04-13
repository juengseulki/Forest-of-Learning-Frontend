import React from 'react';
import StudyCard from './StudyCard';
import { studiesMockResponse } from '../../../mocks/study/studyMockData.js';
import { pointMockResponse } from '../../../mocks/point/pointMockData.js';
import { backgroundsMockResponse } from '../../../mocks/background/backgroundMockData';
import { emojiMockResponse } from '../../../mocks/emoji/emojiMockData.js';
import '../../../styles/StudyList.css';
import getBackgroundTheme from '../../../shared/utils/backgroundTheme.js';

function StudyList({ visibleCount }) {
  const study = studiesMockResponse.data.items;
  const point = pointMockResponse.data;
  const backgrounds = backgroundsMockResponse.data.items;

  function getDaysFrom(createdAt) {
    return (
      Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)) + 1
    );
  }

  const visibleStudy = study.slice(0, visibleCount);

  return (
    <div className="card-list">
      {visibleStudy.map((item) => {
        const emoji = emojiMockResponse.data.items.find(
          (emojiItem) => emojiItem.studyId === item.id
        );

        const background = backgrounds.find(
          (bg) => bg.id === item.background.id
        );

        const theme = getBackgroundTheme(item.background?.id);

        return (
          <StudyCard
            key={item.id}
            nickname={item.nickname}
            name={item.name}
            description={item.description}
            duration={getDaysFrom(item.createdAt)}
            totalPoint={point.studyId === item.id ? point.totalPoint : 0}
            emojis={emoji?.emojis ?? []}
            backgroundImage={background?.imageUrl}
            theme={theme}
          />
        );
      })}
    </div>
  );
}

export default StudyList;
