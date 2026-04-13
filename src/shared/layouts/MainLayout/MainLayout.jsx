import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            <Button onClick={() => navigate('/studies/create')}>
              스터디 만들기
            </Button>
          ) : null
        }
      />

      <main className="main-layout__content">
        <Outlet />
        <ToastContainer
          position="bottom-center"
          autoClose={2000}
          hideProgressBar
          closeButton={false}
          pauseOnHover={false}
          draggable={false}
        />
      </main>
    </div>
  );
}

export default MainLayout;
