import pointIcon from '../../../../shared/images/icons/ic_point.png';
import '../../../../styles/StudyDetailPage.css';
import { useStudyPoint } from '../hooks/useStudyPoint.js';

function StudyInfoSection({ study, studyId }) {
  const { point } = useStudyPoint(studyId);

  return (
    <div className="detail-left">
      <section className="detail-info">
        <h1>{study.name}</h1>

        <div className="detail-field">
          <h3>소개</h3>
          <p className="text-break">{study.description}</p>
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
