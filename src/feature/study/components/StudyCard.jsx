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

  const backgroundThemeMap = {
    1: {
      nickname: '#3A8CA3',
      title: '#414141',
      pointBg: '#FFFFFF4D',
      pointText: '#414141',
      duration: '#818181',
      description: '#414141',
    },
    2: {
      nickname: '#578246',
      title: '#414141',
      pointBg: '#FFFFFF4D',
      pointText: '#414141',
      duration: '#818181',
      description: '#414141',
    },
    3: {
      nickname: '#C25578',
      title: '#414141',
      pointBg: '#FFFFFF4D',
      pointText: '#414141',
      duration: '#818181',
      description: '#414141',
    },
    4: {
      nickname: '#C18E1B',
      title: '#414141',
      pointBg: '#FFFFFF4D',
      pointText: '#414141',
      duration: '#818181',
      description: '#414141',
    },
    5: {
      nickname: '#FFFFFF',
      title: '#FFFFFF',
      pointBg: '#00000080',
      pointText: '#FFFFFF',
      duration: '#EEEEEE',
      description: '#FFFFFF',
    },
    6: {
      nickname: '#FFFFFF',
      title: '#FFFFFF',
      pointBg: '#00000080',
      pointText: '#FFFFFF',
      duration: '#EEEEEE',
      description: '#FFFFFF',
    },
    7: {
      nickname: '#FFFFFF',
      title: '#FFFFFF',
      pointBg: '#00000080',
      pointText: '#FFFFFF',
      duration: '#EEEEEE',
      description: '#FFFFFF',
    },
    8: {
      nickname: '#FFFFFF',
      title: '#FFFFFF',
      pointBg: '#00000080',
      pointText: '#FFFFFF',
      duration: '#EEEEEE',
      description: '#FFFFFF',
    },
  };

  const background = backgrounds.find((bg) => bg.id === studys.background.id);
  const theme = backgroundThemeMap[studys.background.id];

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
              <h2 className="title" style={{ color: theme?.title }}>
                <span style={{ color: theme?.nickname }}>
                  {studys.nickname}
                </span>
                의 {studys.name}
              </h2>
              <div
                className="point"
                style={{ backgroundColor: theme?.pointBg }}
              >
                <img
                  className="point-icon"
                  src={ic_point}
                  alt="포인트 아이콘"
                />
                <p className="point-text" style={{ color: theme?.pointText }}>
                  {point.studyId === studys.id ? point.totalPoint : 0}P 획득
                </p>
              </div>
            </div>
            <p className="duration" style={{ color: theme?.duration }}>
              {getDaysFrom(studys.createdAt)}일째 진행 중
            </p>
          </div>
          <p className="description" style={{ color: theme?.description }}>
            {studys.description}
          </p>
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
