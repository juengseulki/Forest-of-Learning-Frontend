import React from 'react';
import StudyCard from './StudyCard';
import { studiesMockResponse } from '../../../mocks/study/studyMockData.js';
import { pointMockResponse } from '../../../mocks/point/pointMockData.js';
import { backgroundsMockResponse } from '../../../mocks/background/backgroundMockData';
import { emojiMockResponse } from '../../../mocks/emoji/emojiMockData.js';
import '../../../styles/StudyList.css';

function StudyList({ visibleCount }) {
  const study = studiesMockResponse.data.items;
  const point = pointMockResponse.data;
  const backgrounds = backgroundsMockResponse.data.items;

  const backgroundThemeMap = {
    1: {
      nickname: '#3A8CA3',
      title: '#414141',
      pointBg: '#FFFFFF4D',
      pointText: '#414141',
      duration: '#818181',
      description: '#414141',
    },
    2: {
      nickname: '#578246',
      title: '#414141',
      pointBg: '#FFFFFF4D',
      pointText: '#414141',
      duration: '#818181',
      description: '#414141',
    },
    3: {
      nickname: '#C25578',
      title: '#414141',
      pointBg: '#FFFFFF4D',
      pointText: '#414141',
      duration: '#818181',
      description: '#414141',
    },
    4: {
      nickname: '#C18E1B',
      title: '#414141',
      pointBg: '#FFFFFF4D',
      pointText: '#414141',
      duration: '#818181',
      description: '#414141',
    },
    5: {
      nickname: '#FFFFFF',
      title: '#FFFFFF',
      pointBg: '#00000080',
      pointText: '#FFFFFF',
      duration: '#EEEEEE',
      description: '#FFFFFF',
    },
    6: {
      nickname: '#FFFFFF',
      title: '#FFFFFF',
      pointBg: '#00000080',
      pointText: '#FFFFFF',
      duration: '#EEEEEE',
      description: '#FFFFFF',
    },
    7: {
      nickname: '#FFFFFF',
      title: '#FFFFFF',
      pointBg: '#00000080',
      pointText: '#FFFFFF',
      duration: '#EEEEEE',
      description: '#FFFFFF',
    },
    8: {
      nickname: '#FFFFFF',
      title: '#FFFFFF',
      pointBg: '#00000080',
      pointText: '#FFFFFF',
      duration: '#EEEEEE',
      description: '#FFFFFF',
    },
  };

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

        const theme = backgroundThemeMap[item.background.id];

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
