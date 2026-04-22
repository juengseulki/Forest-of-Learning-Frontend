import React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Toast from '../../../../../shared/components/toast/Toast';
import './ShareSheet.css';

function ShareSheet({ isOpen, onClose, study }) {
  const { t } = useTranslation();

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
      showToast('success', '🔗', t('copySuccess'));
      onClose();
    } catch (error) {
      console.error('복사 실패', error);
      showToast('danger', '❗', t('copyFail'));
    }
  };

  const handleKakaoShare = () => {
    if (!window.Kakao) {
      showToast('danger', '❗', t('kakaoLoadFail'));
      return;
    }

    if (!window.Kakao.isInitialized()) {
      showToast('danger', '❗', t('kakaoInitFail'));
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: study?.name || t('shareStudyTitle'),
        description: study?.description || t('shareStudyDescription'),
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
          title: t('viewStudy'),
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
        <p className="share-sheet__title">{t('shareModalTitle')}</p>

        <div className="share-sheet__list">
          <button
            type="button"
            className="share-sheet__item"
            onClick={handleKakaoShare}
          >
            {t('shareKakao')}
          </button>

          <button
            type="button"
            className="share-sheet__item"
            onClick={handleCopyLink}
          >
            {t('shareCopyLink')}
          </button>
        </div>

        <button type="button" className="share-sheet__cancel" onClick={onClose}>
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}

export default ShareSheet;
