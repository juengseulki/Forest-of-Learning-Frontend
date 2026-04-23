import { toast } from 'react-toastify';
import Toast from '../shared/components/toast/Toast.jsx';

const toastOptions = {
  position: 'bottom-center',
  autoClose: 2000,
  hideProgressBar: true,
  closeButton: false,
  pauseOnHover: false,
  draggable: false,
};

const handleApiError = (error, fallbackMessage = '오류가 발생했습니다.') => {
  const message = error?.message || fallbackMessage;
  console.error(message, error);
  toast(<Toast type="danger" icon="❗" message={message} />, toastOptions);
};

export default handleApiError;
