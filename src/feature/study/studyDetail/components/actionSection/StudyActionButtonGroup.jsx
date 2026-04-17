import React from 'react';

function StudyActionButtonGroup() {
  return (
    <div className="detail-action-group">
      <button className="action-item ">공유하기 </button>
      <button className="action-item">수정하기 </button>
      <button className="action-item detail-delete">스터디 삭제하기</button>
    </div>
  );
}

export default StudyActionButtonGroup;
