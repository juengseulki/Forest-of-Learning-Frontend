import '../../../styles/StudyList.css';
import StudyCard from './StudyCard';
import { studiesMockResponse } from '../../../mocks/study/studyMockData.js';
import { pointMockResponse } from '../../../mocks/point/pointMockData.js';
import { backgroundsMockResponse } from '../../../mocks/background/backgroundMockData';
import { emojiMockResponse } from '../../../mocks/emoji/emojiMockData.js';
import getBackgroundTheme from '../../../shared/utils/backgroundTheme.js';
import { getStudyCardProps } from '../utils/studyUtils';
import { getStudies } from '../../../api/studyApi.js';
import { useEffect, useState } from 'react';

function StudyList({ visibleCount }) {
  // const studies = studiesMockResponse.data.items;
  const point = pointMockResponse.data;
  const backgrounds = backgroundsMockResponse.data.items;
  const emojiItems = emojiMockResponse.data.items;
  const [studies, setStudies] = useState([]);
  const visibleStudies = studies.slice(0, visibleCount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudies();
        setStudies(data.items);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  });

  return (
    <div className="card-list">
      {visibleStudies.map((item) => {
        const cardProps = getStudyCardProps({
          item,
          point,
          backgrounds,
          emojiItems,
          getBackgroundTheme,
        });

        return <StudyCard key={item.id} {...cardProps} />;
      })}
    </div>
  );
}

export default StudyList;
