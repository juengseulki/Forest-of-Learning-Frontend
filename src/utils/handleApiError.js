import { toast } from 'react-toastify';

const handleApiError = (error, fallbackMessage = '오류가 발생했습니다.') => {
  const message = error?.message || fallbackMessage;
  console.error(message, error);
  toast.error(message);
};

export default handleApiError;
