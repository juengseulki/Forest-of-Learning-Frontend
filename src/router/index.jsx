import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout/MainLayout';
import HomePage from '../pages/HomePage';
import CreateStudyPage from '../pages/CreateStudyPage';
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
        path: 'study/create',
        element: <CreateStudyPage />,
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
    ],
  },
]);

export default router;
