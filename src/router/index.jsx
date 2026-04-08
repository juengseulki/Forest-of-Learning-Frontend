import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout/MainLayout';
import HomePage from '../pages/HomePage';
import StudyDetailPage from '../pages/StudyDetailPage';
import CreateStudyPage from '../pages/CreateStudyPage';

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
    ],
  },
]);

export default router;
