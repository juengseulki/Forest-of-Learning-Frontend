import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Toast from '../../../../../shared/components/toast/Toast.jsx';
import './ShareSheet.css';

const FALLBACK_IMAGE =
  'https://developers.kakao.com/tool/resource/static/img/button/kakaotalksharing/kakaotalk_sharing_btn_medium.png';

function getAbsoluteUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${window.location.origin}${url}`;
}

function ensureKakaoInitialized() {
  const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

  if (!window.Kakao) {
    throw new Error('Kakao SDK가 로드되지 않았습니다.');
  }

  if (!kakaoKey) {
    throw new Error('카카오 JavaScript 키가 없습니다.');
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(kakaoKey);
  }
}

function ShareSheet({ isOpen, onClose, study }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/studies/${study?.id ?? ''}`;

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
    try {
      ensureKakaoInitialized();

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: study?.name || t('shareStudyTitle'),
          description: study?.description || t('shareStudyDescription'),
          imageUrl:
            getAbsoluteUrl(study?.background?.imageUrl) || FALLBACK_IMAGE,
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
      console.error('카카오 공유 실패:', error);
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
