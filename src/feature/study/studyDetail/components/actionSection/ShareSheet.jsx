import React from 'react';
import { toast } from 'react-toastify';
import Toast from '../../../../../shared/components/toast/Toast';
import './ShareSheet.css';

function ShareSheet({ isOpen, onClose, study }) {
  if (!isOpen) return null;

  const shareUrl = window.location.href;

  const showToast = (type, icon, message) => {
    toast(<Toast type={type} icon={icon} message={message} />, {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeButton: false,
      pauseOnHover: false,
      draggable: false,
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('success', '🔗', '링크가 복사되었습니다!');
      onClose();
    } catch (error) {
      console.error('복사 실패', error);
      showToast('danger', '❗', '복사에 실패했습니다.');
    }
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) {
      showToast('danger', '❗', '카카오 SDK를 불러오지 못했습니다.');
      return;
    }

    if (!window.Kakao.isInitialized()) {
      showToast('danger', '❗', '카카오가 초기화되지 않았습니다.');
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: study?.name || '스터디 함께해요',
        description: study?.description || '공부의 숲에서 함께 공부해요!',
        imageUrl:
          study?.backgroundImageUrl ||
          'https://developers.kakao.com/tool/resource/static/img/button/kakaotalksharing/kakaotalk_sharing_btn_medium.png',
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '스터디 보러가기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });

    onClose();
  };

  return (
    <div className="share-sheet" onClick={onClose}>
      <div
        className="share-sheet__content"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="share-sheet__title">공유하기</p>

        <div className="share-sheet__list">
          <button
            type="button"
            className="share-sheet__item"
            onClick={handleKakaoShare}
          >
            카카오톡 공유
          </button>

          <button
            type="button"
            className="share-sheet__item"
            onClick={handleCopyLink}
          >
            링크 복사
          </button>
        </div>

        <button type="button" className="share-sheet__cancel" onClick={onClose}>
          취소
        </button>
      </div>
    </div>
  );
}

export default ShareSheet;
