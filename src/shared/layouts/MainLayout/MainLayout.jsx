import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { StudyProvider } from '../../../contexts/StudyContext';
import { UIProvider } from '../../../contexts/UIContext';
import { useTheme } from '../../hooks/useTheme';

import mainIcon from '../../../images/habit/sticker_light_mint_100_04.png';
import darkModeIcon from '../../../shared/components/icons/button/sticker_dark_button.png';
import lightModeIcon from '../../../shared/components/icons/button/sticker_light_button.png';

import './MainLayout.css';

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  const [theme, toggleTheme] = useTheme();
  const [headerAction, setHeaderAction] = useState(null);
  const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/';
  const isStudyEditPage = /^\/studies\/\d+\/edit$/.test(location.pathname);

  const handleHeaderClick = () => {
    if (headerAction) {
      headerAction();
      return;
    }

    navigate(-1);
  };

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    setIsFabMenuOpen(false);
  };

  const handleToggleFabMenu = () => {
    setIsFabMenuOpen((prev) => !prev);
  };

  const handleToggleTheme = () => {
    toggleTheme();
    setIsFabMenuOpen(false);
  };

  return (
    <StudyProvider>
      <UIProvider>
        <div className="main-layout">
          <Header
            rightContent={
              isHomePage ? (
                <Button onClick={() => navigate('/studies/create')}>
                  {t('createStudy')}
                </Button>
              ) : isStudyEditPage ? (
                <Button onClick={handleHeaderClick}>{t('back')}</Button>
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

          <div className="floating-paw-menu">
            <button
              type="button"
              className={`floating-paw-menu__theme ${
                isFabMenuOpen ? 'floating-paw-menu__theme--open' : ''
              }`}
              onClick={handleToggleTheme}
              aria-label={
                theme === 'light'
                  ? t('switchToDarkMode')
                  : t('switchToLightMode')
              }
            >
              <img
                src={theme === 'light' ? darkModeIcon : lightModeIcon}
                alt=""
                className="floating-paw-menu__theme-icon"
              />
            </button>

            <div
              className={`floating-paw-menu__languages ${
                isFabMenuOpen ? 'floating-paw-menu__languages--open' : ''
              }`}
            >
              <button
                type="button"
                className={`floating-paw-menu__lang ${
                  i18n.language === 'ko' ? 'active' : ''
                }`}
                onClick={() => handleChangeLanguage('ko')}
              >
                KO
              </button>

              <button
                type="button"
                className={`floating-paw-menu__lang ${
                  i18n.language === 'en' ? 'active' : ''
                }`}
                onClick={() => handleChangeLanguage('en')}
              >
                EN
              </button>

              <button
                type="button"
                className={`floating-paw-menu__lang ${
                  i18n.language === 'ja' ? 'active' : ''
                }`}
                onClick={() => handleChangeLanguage('ja')}
              >
                JP
              </button>

              <button
                type="button"
                className={`floating-paw-menu__lang ${
                  i18n.language === 'zh-CN' ? 'active' : ''
                }`}
                onClick={() => handleChangeLanguage('zh-CN')}
              >
                CN
              </button>
            </div>

            <button
              type="button"
              className={`floating-paw-menu__main ${
                isFabMenuOpen ? 'floating-paw-menu__main--open' : ''
              }`}
              onClick={handleToggleFabMenu}
              aria-label={isFabMenuOpen ? t('closeMenu') : t('openMenu')}
            >
              <img
                src={mainIcon}
                alt=""
                className="floating-paw-menu__main-icon"
              />
            </button>
          </div>
        </div>
      </UIProvider>
    </StudyProvider>
  );
}

export default MainLayout;
