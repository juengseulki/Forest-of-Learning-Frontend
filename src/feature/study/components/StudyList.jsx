import '../../../styles/StudyList.css';
import StudyCard from './StudyCard';
import { backgroundsMockResponse } from '../../../mocks/background/backgroundMockData';
import getBackgroundTheme from '../../../shared/utils/backgroundTheme.js';
import { getStudyCardProps } from '../utils/studyUtils';
import { getStudies } from '../../../api/studyApi.js';
import { getPoint } from '../../../api/pointApi.js';
import { getEmojiReactions } from '../../../api/emojiApi.js';
import { useEffect, useState } from 'react';

function StudyList({ visibleCount, keyword, order, recentIds = [] }) {
  const backgrounds = backgroundsMockResponse.data.items;
  const [studies, setStudies] = useState([]);
  const visibleStudies = studies.slice(0, visibleCount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStudies(keyword, order);

        const studiesWithPoint = await Promise.all(
          (data?.items ?? []).map(async (study) => {
            const pointData = await getPoint(study.id);
            const emojiData = await getEmojiReactions(study.id);
            return {
              ...study,
              point: pointData?.totalPoint ?? 0,
              emojis: emojiData?.items ?? [],
            };
          })
        );

        if (recentIds.length > 0) {
          const filteredStudies = recentIds
            .map((id) => studiesWithPoint.find((study) => study.id === id))
            .filter(Boolean);

          setStudies(filteredStudies);
        } else {
          setStudies(studiesWithPoint);
        }
      } catch (error) {
        console.error('스터디 목록 조회 실패:', error);
        setStudies([]);
      }
    };

    fetchData();
  }, [keyword, order, recentIds]);

  return (
    <div className="card-list">
      {visibleStudies.filter(Boolean).map((item) => {
        const cardProps = getStudyCardProps({
          item,
          point: item?.point ?? 0,
          backgrounds,
          emojiItems: item?.emojis ?? [],
          getBackgroundTheme,
        });

        return <StudyCard key={item.id} id={item.id} {...cardProps} />;
      })}
    </div>
  );
}

export default StudyList;
