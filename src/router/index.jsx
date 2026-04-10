import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout/MainLayout';
import HomePage from '../pages/HomePage';
import StudyDetailPage from '../pages/StudyDetailPage';
import CreateStudyPage from '../pages/CreateStudyPage';
import FocusPage from '../feature/focus-2-sk/pages/FocusPage';

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
        path: '/studies/:studyId/focus',
        element: <FocusPage />,
      },
    ],
  },
]);

export default router;
