import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout/MainLayout';
import HomePage from '../pages/HomePage';
//import StudyDetailPage from '../pages/StudyDetailPage';
import CreateStudyPage from '../pages/CreateStudyPage';
import FocusTimer from '../feature/1-focus-hs/components/FocusTimer';
import StudyDetailPage from '../feature/study/studyDetail/StudyDetailPage';
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
        path: 'study/create',
        element: <CreateStudyPage />,
      },
      {
        path: 'study/:id',
        children: [
          {
            index: true,
            element: <StudyDetailPage />,
          },
          {
            path: 'habit',
            element: <HabitHome />,
          },
          {
            path: 'focus',
            element: <FocusTimer />,
          },
        ],
      },
    ],
  },
]);

export default router;
