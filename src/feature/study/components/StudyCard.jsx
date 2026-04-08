import React from 'react';
import '../../../styles/StudyCard.css';
import ic_point from '../../../shared/images/icons/ic_point.png';

export default function StudyCard() {
  return (
    <div className="study-card">
      <section className="card-header">
        <div className="header-top">
          <div className="title-group">
            <h2 className="title">이유디의 UX 스터디</h2>
            <div className="point">
              <img className="point-icon" src={ic_point} alt="포인트 아이콘" />
              <p className="point-text">310P 획득</p>
            </div>
          </div>
          <p className="duration">62일째 진행 중</p>
        </div>
        <p className="description">Slow And Steady Wins The Race!!</p>
      </section>
      <section className="card-footer">
        <div className="footer-content">
          <img className="icon" src={ic_point} alt="임시 데이터" />
          <p className="icon-count">37</p>
        </div>
        <div className="footer-content">
          <img className="icon" src={ic_point} alt="임시 데이터" />
          <p className="icon-count">37</p>
        </div>
      </section>
    </div>
  );
}
