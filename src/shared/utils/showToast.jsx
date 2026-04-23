import { toast } from 'react-toastify';
import Toast from '../components/toast/Toast.jsx';

export function showToast(type, icon, message) {
  toast(<Toast type={type} icon={icon} message={message} />);
}
