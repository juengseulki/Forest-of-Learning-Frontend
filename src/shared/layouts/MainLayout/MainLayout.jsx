import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="main-layout">
      <Header rightContent={<Button>스터디 만들기</Button>} />

      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
