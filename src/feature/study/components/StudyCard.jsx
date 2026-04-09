import '../../../styles/StudyCard.css';
import ic_point from '../../../shared/images/icons/ic_point.png';
import { backgroundsMockResponse } from '../../../mocks/background/backgroundMockData';

export default function StudyCard({ studys, point, emoji }) {
  function getDaysFrom(createdAt) {
    return (
      Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)) + 1
    );
  }

  const backgrounds = backgroundsMockResponse.data.items;

  const background = backgrounds.find((bg) => bg.id === studys.background.id);
  console.log(background);
  return (
    <>
      <div
        className="study-card"
        style={{
          backgroundImage: `url(${background?.imageUrl})`,
        }}
      >
        <section className="card-header">
          <div className="header-top">
            <div className="title-group">
              <h2 className="title">
                {studys.nickname}의 {studys.name}
              </h2>
              <div className="point">
                <img
                  className="point-icon"
                  src={ic_point}
                  alt="포인트 아이콘"
                />
                <p className="point-text">
                  {point.studyId === studys.id ? point.totalPoint : 0}P 획득
                </p>
              </div>
            </div>
            <p className="duration">
              {getDaysFrom(studys.createdAt)}일째 진행 중
            </p>
          </div>
          <p className="description">{studys.description}</p>
        </section>
        <section className="card-footer">
          {emoji?.emojis?.map((item) => (
            <div className="footer-content" key={item.emoji}>
              <p className="icon">{item.emoji}</p>
              <p className="icon-count">{item.count}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
