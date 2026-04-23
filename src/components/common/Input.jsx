import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/Input.css';
import btn_visibility_off from '../../images/button/btn_visibility_off.svg';
import btn_visibility_on from '../../images/button/btn_visibility_on.svg';

function Input({
  labelName,
  placeholder,
  password,
  value,
  onChange,
  error,
  ref,
}) {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();

  const toggleVisibility = () => {
    setVisible((toggled) => !toggled);
  };

  return (
    <div className="input-container">
      <label className="input-label">{labelName}</label>
      <div className={error ? 'input-wrapper-error' : 'input-wrapper'}>
        <input
          ref={ref}
          type={password ? (visible ? 'text' : 'password') : 'text'}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
        {password && (
          <img
            src={visible ? btn_visibility_on : btn_visibility_off}
            onClick={toggleVisibility}
            className="visibility-icon"
            alt={visible ? t('hidePassword') : t('showPassword')}
          />
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Input;
