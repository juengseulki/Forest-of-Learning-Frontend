import { toast } from 'react-toastify';
import Toast from '../components/toast/Toast.jsx';

const toastOptions = {
  position: 'bottom-center',
  autoClose: 2000,
  hideProgressBar: true,
  closeButton: false,
  pauseOnHover: false,
  draggable: false,
};

export function showToast(type, icon, message) {
  toast(<Toast type={type} icon={icon} message={message} />);
  toastOptions;
}
