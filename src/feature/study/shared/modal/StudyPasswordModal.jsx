import { useState } from 'react';
import BaseStudyModal from './BaseStudyModal';
import visibleOffIcon from '../../../../shared/components/icons/button/btn_visibility_off.svg';
import visibleOnIcon from '../../../../shared/components/icons/button/btn_visibility_on.svg';

function StudyPasswordModal({
  isOpen,
  studyName,
  password,
  description = '권한이 필요해요!',
  errorMessage = '',
  isSubmitting = false,
  onChangePassword,
  onClose,
  onSubmit,
  actionLabel = '확인',
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <BaseStudyModal
      isOpen={isOpen}
      title={studyName}
      description={description}
      rightText="나가기"
      onClose={onClose}
      className="study-modal__content--password"
    >
      <div className="study-modal__field">
        <label className="study-modal__label">비밀번호</label>

        <div className="study-modal__input-wrap">
          <input
            className="study-modal__input"
            type={isVisible ? 'text' : 'password'}
            value={password}
            onChange={onChangePassword}
            placeholder="비밀번호를 입력해 주세요"
          />

          <button
            type="button"
            className="study-modal__toggle"
            onClick={() => setIsVisible((prev) => !prev)}
            aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
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
          {actionLabel}
        </button>

        <button
          type="button"
          className="study-modal__mobile-close"
          onClick={onClose}
        >
          나가기
        </button>

        {errorMessage ? (
          <p className="study-modal__error">{errorMessage}</p>
        ) : null}
      </div>
    </BaseStudyModal>
  );
}

export default StudyPasswordModal;
