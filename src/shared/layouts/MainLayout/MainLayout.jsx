import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { StudyProvider } from '../../../contexts/StudyContext';
import { UIProvider } from '../../../contexts/UIContext';
import { useTheme } from '../../hooks/useTheme';
import darkModIcon from '../../../shared/components/icons/button/sticker_dark_button.png';
import lightModIcon from '../../../shared/components/icons/button/sticker_light_button.png';

import './MainLayout.css';
function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [theme, toggleTheme] = useTheme();

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
    <StudyProvider>
      <UIProvider>
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
              limit={1}
            />
          </main>
          <div className="theme-toggle-container">
            <button
              onClick={toggleTheme}
              className="theme-toggle-button"
              aria-label={
                theme === 'light' ? '다크모드로 변경' : '라이트모드로 변경'
              }
            >
              {theme === 'light' ? (
                <img src={darkModIcon} alt="다크모드" className="theme-icon" />
              ) : (
                <img
                  src={lightModIcon}
                  alt="라이트모드"
                  className="theme-icon"
                />
              )}
            </button>
          </div>
        </div>
      </UIProvider>
    </StudyProvider>
  );
}

export default MainLayout;
