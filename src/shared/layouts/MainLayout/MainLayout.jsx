import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import './MainLayout.css';

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [headerAction, setHeaderAction] = useState(null);

  const isHomePage = location.pathname === '/';
  const isStudyEditPage = /^\/studies\/\d+\/edit$/.test(location.pathname);

  const handleHeaderClick = () => {
    if (headerAction) {
      headerAction();
      return;
    }

    navigate(-1);
  };

  return (
    <div className="main-layout">
      <Header
        rightContent={
          isHomePage ? (
            <Button onClick={() => navigate('/studies/create')}>
              스터디 만들기
            </Button>
          ) : isStudyEditPage ? (
            <Button onClick={handleHeaderClick}>뒤로가기</Button>
          ) : null
        }
      />

      <main className="main-layout__content">
        <Outlet context={{ setHeaderAction }} />
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
