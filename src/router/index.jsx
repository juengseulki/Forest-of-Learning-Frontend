import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout/MainLayout.jsx';
import HomePage from '../pages/HomePage.jsx';
import CreateStudyPage from '../pages/CreateStudyPage.jsx';
import FocusPage from '../pages/FocusPage.jsx';
import HabitPage from '../pages/HabitPage.jsx';
import StudyDetailPage from '../feature/study/studyDetail/StudyDetailPage.jsx';
import ProtectedStudyRoute from '../shared/routes/ProtectedStudyRoute.jsx';

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
        path: 'studies/:id',
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
