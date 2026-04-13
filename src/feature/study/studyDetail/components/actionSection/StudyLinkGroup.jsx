import React from 'react';
import allowRight from '../../../../../images/icon/ic_arrow_right.svg';
import { Link } from 'react-router-dom';
function StudyLinkGroup({ studyId }) {
  return (
    <div className="detail-link-group">
      <Link to="/" className="link-btn">
        오늘의 습관 <img src={allowRight} alt="오른쪽 화살표" />
      </Link>
      <Link to="/" className="link-btn">
        오늘의 집중 <img src={allowRight} alt="오른쪽 화살표" />
      </Link>
    </div>
  );
}

export default StudyLinkGroup;
