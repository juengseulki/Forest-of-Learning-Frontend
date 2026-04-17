import React from 'react';
import { toast } from 'react-toastify';
import Toast from '../../../../../shared/components/toast/Toast';

function StudyActionButtonGroup({ onEditClick, onDeleteClick }) {
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      toast(
        <Toast type="success" icon="🔗" message="링크가 복사되었습니다!" />,
        {
          position: 'bottom-center',
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
          pauseOnHover: false,
          draggable: false,
        }
      );
    } catch (error) {
      console.error('복사 실패', error);

      toast(<Toast type="danger" icon="❗" message="복사에 실패했습니다." />, {
        position: 'bottom-center',
        autoClose: 2000,
        hideProgressBar: true,
        closeButton: false,
        pauseOnHover: false,
        draggable: false,
      });
    }
  };

  return (
    <div className="detail-action-group">
      <button className="action-item" onClick={handleCopyLink}>
        공유하기
      </button>

      <button className="action-item" onClick={onEditClick}>
        수정하기
      </button>

      <button className="action-item detail-delete" onClick={onDeleteClick}>
        스터디 삭제하기
      </button>
    </div>
  );
}

export default StudyActionButtonGroup;
