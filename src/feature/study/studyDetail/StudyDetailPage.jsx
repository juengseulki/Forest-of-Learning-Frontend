import React from 'react';
import '../../../styles/StudyDetailPage.css';
import '../../../styles/global.css';

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
    <div className="detail-container">
      <div className="detail-wrap">
        <section className="detail-top-section">
          <div className="detail-left">
            <div>🔥</div>
            <h1>{data.name}</h1>
            <h3>소개</h3>
            <h3>{data.description}</h3>
            <h3>현재까지 획득한 포인트</h3>
            <div>{data.totalPoint}</div>
          </div>
          <div className="detail-right">
            <div>공유 수정 삭제</div>
            <div>오늘의</div>
          </div>
        </section>
        <section className="detail-bottom-section">
          <h2>습관기록표</h2>
          <div>아직 습관이 없어요.</div>
        </section>
      </div>
    </div>
  );
}

export default StudyDetailPage;
