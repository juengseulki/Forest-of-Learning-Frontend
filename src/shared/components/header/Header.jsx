import { Link } from 'react-router-dom';
import logoDesktop from '../../images/logo/logo-desktop.png';
import logoPad from '../../images/logo/logo-tablet.png';
import logoMobile from '../../images/logo/logo-mobile.png';
import './Header.css';
import { useTheme } from '../../../shared/hooks/useTheme'; //  훅 임포트

function Header({ rightContent }) {
  const [theme, toggleTheme] = useTheme(); //  테마 상태 가져오기

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo-link" aria-label="홈으로 이동">
          <img
            src={logoDesktop}
            alt="공부의 숲"
            className="header__logo header__logo--desktop"
          />

          <img
            src={logoPad}
            alt="공부의 숲"
            className="header__logo header__logo--tablet"
          />

          <img
            src={logoMobile}
            alt="공부의 숲"
            className="header__logo header__logo--mobile"
          />
        </Link>

        <div className="header__right">
          {rightContent ? (
            rightContent
          ) : (
            <div className="header__placeholder" />
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
