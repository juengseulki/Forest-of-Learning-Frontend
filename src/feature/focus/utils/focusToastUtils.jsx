import { toast } from 'react-toastify';
import Toast from '../../../shared/components/toast/Toast';

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
    <Toast type="danger" icon="🚨" message="집중이 중단되었습니다." />,
    toastOptions
  );
}

export function showPointToast(firstPoint, secondPoint, totalPoint) {
  toast(
    <Toast
      type="success"
      icon="🎉"
      message={`기본 ${firstPoint}P + 초과 집중 ${secondPoint}P = 총 ${totalPoint}P 획득!`}
    />,
    toastOptions
  );
}

export function showTargetToast() {
  toast(
    <Toast type="info" icon="💙" message="설정한 집중이 끝났습니다!" />,
    toastOptions
  );
}
