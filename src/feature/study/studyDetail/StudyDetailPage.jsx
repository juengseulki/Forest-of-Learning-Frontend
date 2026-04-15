import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../../../styles/StudyDetailPage.css';
import '../../../styles/global.css';
import StudyInfoSection from './components/StudyInfoSection.jsx';
import StudyActionButtonGroup from './components/actionSection/StudyActionButtonGroup.jsx';
import StudyLinkGroup from './components/actionSection/StudyLinkGroup.jsx';
import EmojiSection from './components/emoji/EmojiSection.jsx';
import HabitRecord from './components/HabitRecord.jsx';
import { getStudy } from '../../../api/studyApi.js';

function StudyDetailPage() {
  const { id } = useParams();
  const [study, setStudy] = useState({});

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        const targetStudy = await getStudy(id);
        setStudy(targetStudy);
      } catch (error) {
        console.error('스터디 로딩 실패!', error);
      }
    };

    fetchStudyData();
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
            <StudyLinkGroup studyId={id} />
          </div>
        </section>

        <HabitRecord studyId={id} />
      </div>
    </div>
  );
}

export default StudyDetailPage;
