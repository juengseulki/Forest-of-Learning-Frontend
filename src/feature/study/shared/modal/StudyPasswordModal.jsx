import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseStudyModal from './BaseStudyModal.jsx';
import visibleOffIcon from '@/shared/components/icons/button/btn_visibility_off.svg';
import visibleOnIcon from '@/shared/components/icons/button/btn_visibility_on.svg';

function StudyPasswordModal({
  isOpen,
  studyName,
  password,
  description,
  errorMessage = '',
  isSubmitting = false,
  onChangePassword,
  onClose,
  onSubmit,
  actionLabel,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  return (
    <BaseStudyModal
      isOpen={isOpen}
      title={studyName}
      description={description || t('passwordRequired')}
      rightText={t('exit')}
      onClose={onClose}
      className="study-modal__content--password"
    >
      <div className="study-modal__field">
        <label className="study-modal__label">{t('passwordLabel')}</label>

        <div className="study-modal__input-wrap">
          <input
            className="study-modal__input"
            type={isVisible ? 'text' : 'password'}
            value={password}
            onChange={onChangePassword}
            placeholder={t('passwordPlaceholder')}
            autoComplete="one-time-code"
          />

          <button
            type="button"
            className="study-modal__toggle"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? t('hidePassword') : t('showPassword')}
          >
            <img
              src={isVisible ? visibleOnIcon : visibleOffIcon}
              alt=""
              className="study-modal__toggle-icon"
            />
          </button>
        </div>
      </div>

      <div className="study-modal__actions study-modal__actions--single">
        <button
          type="button"
          className="study-modal__button study-modal__button--primary study-modal__button--password"
          onClick={onSubmit}
          disabled={!password.trim() || isSubmitting}
        >
          {actionLabel || t('confirm')}
        </button>

        <button
          type="button"
          className="study-modal__mobile-close"
          onClick={onClose}
        >
          {t('exit')}
        </button>

        {errorMessage ? (
          <p className="study-modal__error">{errorMessage}</p>
        ) : null}
      </div>
    </BaseStudyModal>
  );
}

export default StudyPasswordModal;
