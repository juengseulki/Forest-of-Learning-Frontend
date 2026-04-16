import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout/MainLayout';
import HomePage from '../pages/HomePage';
import StudyCreatePage from '../pages/StudyCreatePage';
import StudyEditPage from '../pages/StudyEditPage';
import FocusPage from '../pages/FocusPage';
import HabitPage from '../pages/HabitPage';
import StudyDetailPage from '../feature/study/studyDetail/StudyDetailPage';

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
        path: 'studies/create',
        element: <StudyCreatePage />,
      },
      {
        path: '/studies/:studyId/edit',
        element: <StudyEditPage />,
      },
      {
        path: 'studies/:id',
        element: <StudyDetailPage />,
      },
      {
        path: 'studies/:id/habit',
        element: <HabitPage />,
      },
      {
        path: 'studies/:studyId/focus',
        element: <FocusPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
