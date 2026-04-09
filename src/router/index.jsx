import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout/MainLayout';
import HomePage from '../pages/HomePage';
import StudyDetailPage from '../pages/StudyDetailPage';
import CreateStudyPage from '../pages/CreateStudyPage';
import HabitHome from '../feature/habit-1/components/HabitHome';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'study/:id',
        element: <StudyDetailPage />,
      },
      {
        path: 'study/create',
        element: <CreateStudyPage />,
      },
      {
        path: 'habit', // 🔥 여기 추가
        element: <HabitHome />,
      },
    ],
  },
]);

export default router;
