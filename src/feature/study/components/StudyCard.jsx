import '../../../styles/StudyCard.css';
import ic_point from '../../../shared/images/icons/ic_point.png';

export default function StudyCard({
  nickname,
  name,
  description,
  duration,
  totalPoint,
  emojis,
  backgroundImage,
  theme,
}) {
  return (
    <>
      <div
        className="study-card"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <section className="card-header">
          <div className="header-top">
            <div className="title-group">
              <h2 className="title" style={{ color: theme?.title }}>
                <span style={{ color: theme?.nickname }}>{nickname}</span>의{' '}
                {name}
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
                  {totalPoint}P 획득
                </p>
              </div>
            </div>

            <p className="duration" style={{ color: theme?.duration }}>
              {duration}일째 진행 중
            </p>
          </div>

          <p className="description" style={{ color: theme?.description }}>
            {description}
          </p>
        </section>
        <section className="card-footer">
          {emojis.map((item) => (
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
