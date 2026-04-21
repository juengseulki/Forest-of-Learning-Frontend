import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ShareSheet from './ShareSheet';

function StudyActionButtonGroup({
  onEditClick,
  onDeleteClick,
  onRecordClick,
  study,
}) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <div className="detail-action-group">
        <button
          type="button"
          className="action-item"
          onClick={() => setIsShareOpen(true)}
        >
          {t('share')}
        </button>

        <button type="button" className="action-item" onClick={onEditClick}>
          {t('edit')}
        </button>

        <button type="button" className="action-item" onClick={onRecordClick}>
          {t('pointRecord')}
        </button>

        <button
          type="button"
          className="action-item detail-delete"
          onClick={onDeleteClick}
        >
          {t('deleteStudy')}
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
