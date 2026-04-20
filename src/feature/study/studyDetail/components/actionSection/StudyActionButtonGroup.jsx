import React, { useState } from 'react';
import ShareSheet from './ShareSheet';

function StudyActionButtonGroup({
  onEditClick,
  onDeleteClick,
  onRecordClick,
  study,
}) {
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <div className="detail-action-group">
        <button
          type="button"
          className="action-item"
          onClick={() => setIsShareOpen(true)}
        >
          공유하기
        </button>

        <button className="action-item" onClick={onEditClick}>
          수정하기
        </button>

        <button className="action-item" onClick={onRecordClick}>
          포인트 기록
        </button>

        <button
          type="button"
          className="action-item detail-delete"
          onClick={onDeleteClick}
        >
          스터디 삭제하기
        </button>
      </div>

      <ShareSheet
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        study={study}
      />
    </>
  );
}

export default StudyActionButtonGroup;
