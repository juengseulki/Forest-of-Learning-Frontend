import { Link } from 'react-router-dom';
import arrowRightIcon from '../../../../../shared/images/icons/ic_arrow_right.svg';

function StudyLinkGroup({ studyId }) {
  return (
    <div className="detail-link-group">
      <Link to={`/studies/${studyId}/habit`} className="link-btn">
        오늘의 습관 <img src={arrowRightIcon} alt="오른쪽 화살표" />
      </Link>

      <Link to={`/studies/${studyId}/focus`} className="link-btn">
        오늘의 집중 <img src={arrowRightIcon} alt="오른쪽 화살표" />
      </Link>
    </div>
  );
}

export default StudyLinkGroup;
