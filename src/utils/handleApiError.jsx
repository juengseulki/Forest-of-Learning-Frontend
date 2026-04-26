import { showToast } from '@/shared/utils/showToast.jsx';

const handleApiError = (error, fallbackMessage = '오류가 발생했습니다.') => {
  const message = error?.message || fallbackMessage;

  console.error(message, error);

  showToast('danger', '❗', message);
};

export default handleApiError;
