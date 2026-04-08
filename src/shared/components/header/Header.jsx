import { Link } from 'react-router-dom';
import logoImage from '../../images/logo/logo1.png';
import './Header.css';

function Header({ rightContent }) {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo-link">
          <img src={logoImage} alt="공부의 숲" className="header__logo" />
        </Link>

        <div className="header__right">{rightContent}</div>
      </div>
    </header>
  );
}

export default Header;
