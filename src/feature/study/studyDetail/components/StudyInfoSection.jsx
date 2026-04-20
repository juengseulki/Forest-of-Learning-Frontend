import React, { useState, useEffect } from 'react';
import pointIcon from '../../../../shared/images/icons/ic_point.png';
import { pointMockResponse } from '../../../../mocks/point/pointMockData';
import '../../../../styles/StudyDetailPage.css';
import { getPoint } from '../../../../api/pointApi';
import handleApiError from '../../../../utils/handleApiError.jsx';

function StudyInfoSection({ study, studyId }) {
  const [point, setPoint] = useState(0);

  useEffect(() => {
    if (!studyId) return;

    const loadPoint = async () => {
      try {
        const studyPoint = await getPoint(studyId);
        setPoint(studyPoint.totalPoint);
      } catch (error) {
        handleApiError(error, '포인트를 불러오지 못했습니다.');
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
        <h3 className="detail-point-title">현재까지 획득한 포인트</h3>
        <div className="detail-point common-point-box">
          <img src={pointIcon} alt="포인트 아이콘" />
          {point}P 획득
        </div>
      </div>
    </div>
  );
}

export default StudyInfoSection;
