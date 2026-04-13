import React, { useState, useEffect } from 'react';
import '../../../styles/StudyDetailPage.css';
import '../../../styles/global.css';
import { studiesMockResponse } from '../../../mocks/study/studyMockData.js';
import { useParams } from 'react-router-dom';
import StudyInfoSection from './components/StudyInfoSection.jsx';
import StudyActionButtonGroup from './components/actionSection/StudyActionButtonGroup.jsx';
import StudyLinkGroup from './components/actionSection/StudyLinkGroup.jsx';
import EmojiSection from './components/emoji/EmojiSection.jsx';
import HabitRecord from './components/HabitRecord.jsx';

function StudyDetailPage() {
  const { id } = useParams();

  const [study, setStudy] = useState({});

  useEffect(() => {
    const loadStudy = async () => {
      try {
        //const res = await fetch(`http://localhost:4000/study/:${id}`);
        //const data = await res.json()

        const allItems = studiesMockResponse.data.items;
        const targetStudy = allItems.find(
          (item) => String(item.id) === String(id)
        );
        if (targetStudy) {
          setStudy(targetStudy);
        }
      } catch (error) {
        console.error('스터디 로딩 실패!', error);
      }
    };

    loadStudy();
  }, [id]);

  return (
    <div className="detail-wrapper">
      <div className="detail-container">
        <section className="detail-top-section">
          <div className="detail-left">
            <EmojiSection studyId={id} />
            <StudyInfoSection study={study} studyId={id} />
          </div>
          <div className="detail-right">
            <StudyActionButtonGroup />
            <StudyLinkGroup />
          </div>
        </section>
        <HabitRecord studyId={id} />
      </div>
    </div>
  );
}

export default StudyDetailPage;
