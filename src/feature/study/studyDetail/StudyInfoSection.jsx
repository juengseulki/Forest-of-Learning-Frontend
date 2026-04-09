import React, { useState, useEffect } from 'react';
import pointIcon from '../../../shared/images/icons/ic_point.png';
import { pointMockResponse } from '../../../mocks/point/pointMockData';
import '../../../styles/StudyDetailPage.css';

function StudyInfoSection({ study, studyId }) {
  const [point, setPoint] = useState(0);

  useEffect(() => {
    const loadPoint = async () => {
      try {
        // const res = await fetchPoint(`http://localhost:4000/point/:${studyId}`);
        //const data = await res.json()
        setPoint(pointMockResponse.data.totalPoint);
      } catch (error) {
        console.error('포인트 로딩 실패!', error);
      }
    };

    loadPoint();
  }, [studyId]);
  return (
    <div className="detail-left">
      <section className="detail-info">
        <h1>{study.name}</h1>
        <div className="detail-field">
          <h3>소개</h3>
          <p>{study.description}</p>
        </div>
      </section>
      <div className="detail-point-group">
        <h3 className="detail-field">현재까지 획득한 포인트</h3>
        <div className="detail-point">
          <img src={pointIcon} alt="포인트 아이콘" />
          {point}P 획득
        </div>
      </div>
    </div>
  );
}

export default StudyInfoSection;
