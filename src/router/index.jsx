import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout/MainLayout';
import HomePage from '../pages/HomePage';
import CreateStudyPage from '../pages/CreateStudyPage';
import StudyDetailPage from '../feature/study/studyDetail/StudyDetailPage';
import FocusPage from '../feature/focus-2-sk/pages/FocusPage';
import HabitList from '../feature/habit-1/components/HabitList';

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
        element: <CreateStudyPage />,
      },
      {
        path: 'studies/:studyId',
        element: <StudyDetailPage />,
      },
      {
        path: 'studies/:studyId/habit',
        element: <HabitList />,
      },
      {
        path: 'studies/:studyId/focus',
        element: <FocusPage />,
      },
    ],
  },
]);

export default router;
