import '../../../styles/StudyCard.css';
import ic_point from '../../../shared/images/icons/ic_point.png';
import { studiesMockResponse } from '../../../mocks/study/studyMockData.js';
import { pointMockResponse } from '../../../mocks/point/pointMockData.js';

export default function StudyCard() {
  const study = studiesMockResponse.data.items;
  const point = pointMockResponse.data;

  function getDaysFrom(createdAt) {
    return (
      Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)) + 1
    );
  }

  return (
    <>
      {study.map((t) => {
        return (
          <div className="study-card" key={t.id}>
            <section className="card-header">
              <div className="header-top">
                <div className="title-group">
                  <h2 className="title">
                    {t.nickname}의 {t.name}
                  </h2>
                  <div className="point">
                    <img
                      className="point-icon"
                      src={ic_point}
                      alt="포인트 아이콘"
                    />
                    <p className="point-text">
                      {point.studyId === t.id ? point.totalPoint : 0}P 획득
                    </p>
                  </div>
                </div>
                <p className="duration">
                  {getDaysFrom(t.createdAt)}일째 진행 중
                </p>
              </div>
              <p className="description">{t.description}</p>
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
      })}
    </>
  );
}
