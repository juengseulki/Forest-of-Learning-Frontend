import { useRouteError, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import stickerImg from '../../../images/habit/sticker_light_mint_100_04.png';
import './ErrorPage.css';

function ErrorPage({ title, desc }) {
  const error = useRouteError();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="error-page">
      <div className="error-page__content">
        <img src={stickerImg} alt="" className="error-page__icon" />
        <h1 className="error-page__title">{title ?? t('commonError')}</h1>
        <p className="error-page__desc">{desc ?? t('errorPageDesc')}</p>
        {!title && error?.message && (
          <p className="error-page__detail">{error.message}</p>
        )}
        <button
          type="button"
          className="error-page__btn"
          onClick={() => navigate('/', { replace: true })}
        >
          {t('goToHome')}
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
