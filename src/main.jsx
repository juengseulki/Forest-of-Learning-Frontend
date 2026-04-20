import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './router';
import './styles/reset.css';
import './styles/global.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

if (window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(kakaoKey);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  </QueryClientProvider>
);
