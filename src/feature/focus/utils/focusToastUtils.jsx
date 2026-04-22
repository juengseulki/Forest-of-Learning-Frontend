import { toast } from 'react-toastify';
import i18n from '../../../shared/i18n';
import Toast from '../../../shared/components/toast/Toast.jsx';

const toastOptions = {
  position: 'bottom-center',
  autoClose: 2000,
  hideProgressBar: true,
  closeButton: false,
  pauseOnHover: false,
  draggable: false,
};

export function showPauseToast() {
  toast(
    <Toast type="danger" icon="🚨" message={i18n.t('focusPaused')} />,
    toastOptions
  );
}

export function showPointToast(firstPoint, secondPoint, totalPoint) {
  toast(
    <Toast
      type="success"
      icon="🎉"
      message={i18n.t('focusPointMessage', {
        firstPoint,
        secondPoint,
        totalPoint,
      })}
    />,
    toastOptions
  );
}

export function showTargetToast() {
  toast(
    <Toast type="info" icon="💙" message={i18n.t('focusTargetDone')} />,
    toastOptions
  );
}
