import { toast } from 'react-toastify';
import FocusToast from '../components/FocusToast';

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
    <FocusToast type="danger" icon="🚨" message="집중이 중단되었습니다." />,
    toastOptions
  );
}

export function showPointToast(point) {
  toast(
    <FocusToast
      type="success"
      icon="🎉"
      message={`${point}포인트를 획득했습니다!`}
    />,
    toastOptions
  );
}

export function showTargetToast() {
  toast(
    <FocusToast type="info" icon="💙" message="설정한 집중이 끝났습니다!" />,
    toastOptions
  );
}
