import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout/MainLayout';
import HomePage from '../pages/HomePage';
import StudyCreatePage from '../pages/StudyCreatePage';
import StudyEditPage from '../pages/StudyEditPage';
import FocusPage from '../pages/FocusPage';
import HabitPage from '../pages/HabitPage';
import StudyDetailPage from '../feature/study/studyDetail/StudyDetailPage';
import ProtectedStudyRoute from '../shared/routes/ProtectedStudyRoute';

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
        path: 'studies/:studyId/edit',
        element: (
          <ProtectedStudyRoute>
            <StudyEditPage />
          </ProtectedStudyRoute>
        ),
      },
      {
        path: 'studies/:studyId',
        element: <StudyDetailPage />,
      },
      {
        path: 'studies/:studyId/habit',
        element: (
          <ProtectedStudyRoute>
            <HabitPage />
          </ProtectedStudyRoute>
        ),
      },
      {
        path: 'studies/:studyId/focus',
        element: (
          <ProtectedStudyRoute>
            <FocusPage />
          </ProtectedStudyRoute>
        ),
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export default router;
