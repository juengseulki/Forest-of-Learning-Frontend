import '../../../styles/StudyCard.css';
import ic_point from '../../../shared/images/icons/ic_point.png';

export default function StudyCard({ studys, point }) {
  function getDaysFrom(createdAt) {
    return (
      Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24)) + 1
    );
  }

  return (
    <>
      <div className="study-card">
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
    </>
  );
}
