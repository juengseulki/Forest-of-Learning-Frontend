import React from 'react';
import '../../../styles/StudyDetailPage.css';
import '../../../styles/global.css';
import { studiesMockResponse } from '../../../mocks/study/studyMockData';
import { Link } from 'react-router-dom';
import smileIcon from '../../../images/icon/ic_smile.svg';
import pointIcon from '../../../shared/images/icons/ic_point.png';
import allowRight from '../../../images/icon/ic_arrow_right.svg';

function StudyDetailPage() {
  const data = {
    id: 123,
    nickname: '연유', // 유저 활동명
    name: '연우의 개발공장', // 스터디 또는 워크스페이스 이름
    description: '매일매일 성장하는 습관을 만드는 풀스택 개발 스터디입니다.!',
    background: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', // 배경 이미지 URL
    createdAt: '2026-04-08T10:00:00Z', // 생성 날짜
    totalPoint: 310,
  };

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

            <section className="detail-info">
              <h1>{data.name}</h1>
              <div className="detail-field">
                <h3>소개</h3>
                <p>{data.description}</p>
              </div>
            </section>
            <div className="detail-point-group">
              <h3 className="detail-field">현재까지 획득한 포인트</h3>
              <div className="detail-point">
                <img src={pointIcon} alt="포인트 아이콘" />
                {data.totalPoint}P 획득
              </div>
            </div>
          </div>
          <div className="detail-right">
            <div className="detail-action-group">
              <button className="action-item ">공유하기 </button>
              <button className="action-item">수정하기 </button>
              <button className="action-item detail-delete">
                스터디 삭제하기{' '}
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
