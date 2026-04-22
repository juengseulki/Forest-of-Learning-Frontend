import React from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Toast from '../../../../../shared/components/toast/Toast.jsx';
import './ShareSheet.css';

function ShareSheet({ isOpen, onClose, study }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/studies/${study?.id ?? ''}`;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

    const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

    if (!window.Kakao.isInitialized()) {
      if (!kakaoKey) {
        showToast('danger', '❗', t('kakaoInitFail'));
        return;
      }

      try {
        window.Kakao.init(kakaoKey);
      } catch (error) {
        console.error('카카오 초기화 실패', error);
        showToast('danger', '❗', t('kakaoInitFail'));
        return;
      }
    }

    // PC에서는 앱 intent 에러가 날 수 있어서 링크 복사로 대체
    if (!isMobile) {
      handleCopyLink();
      return;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: study?.name || t('shareStudyTitle'),
          description: study?.description || t('shareStudyDescription'),
          imageUrl:
            study?.background?.imageUrl ||
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
    } catch (error) {
      console.error('카카오 공유 실패', error);
      showToast('danger', '❗', t('kakaoShareFail'));
    }
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
