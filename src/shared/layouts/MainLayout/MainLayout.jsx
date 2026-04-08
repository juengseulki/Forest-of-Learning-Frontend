import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import './MainLayout.css';

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  return (
    <div className="main-layout">
      <Header
        rightContent={
          isHomePage ? (
            <Button onClick={() => navigate('/study/create')}>
              스터디 만들기
            </Button>
          ) : null
        }
      />

      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
