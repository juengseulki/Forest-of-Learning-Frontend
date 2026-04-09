import React, { useState, useEffect } from 'react';
import '../../../styles/StudyDetailPage.css';
import '../../../styles/global.css';
import { studiesMockResponse } from '../../../mocks/study/studyMockData';
import { pointMockResponse } from '../../../mocks/point/pointMockData';
import { Link, useParams } from 'react-router-dom';
import smileIcon from '../../../images/icon/ic_smile.svg';
import allowRight from '../../../images/icon/ic_arrow_right.svg';
import StudyInfoSection from './StudyInfoSection';

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
            <span className="emoji">
              <div className="emoji-wrap">
                <button className="emoji-btn">🔥 9</button>
                <button className="emoji-btn">🤩 9</button>
              </div>
              <button className="emoji-add-btn">
                <img src={smileIcon} alt="이모지 추가" />
                추가
              </button>
            </span>
            <StudyInfoSection study={study} id={id} />
          </div>
          <div className="detail-right">
            <div className="detail-action-group">
              <button className="action-item ">공유하기 </button>
              <button className="action-item">수정하기 </button>
              <button className="action-item detail-delete">
                스터디 삭제하기
              </button>
            </div>
            <div className="detail-link-group">
              <Link to="" className="link-btn">
                오늘의 습관 <img src={allowRight} alt="오른쪽 이미지" />
              </Link>
              <Link to="" className="link-btn">
                오늘의 집중 <img src={allowRight} alt="오른쪽 이미지" />
              </Link>
            </div>
          </div>
        </section>
        <section className="detail-bottom-section">
          <h2>습관 기록표</h2>
          <div>아직 습관이 없어요.</div>
        </section>
      </div>
    </div>
  );
}

export default StudyDetailPage;
