import React, { useState } from 'react';
import '../../styles/Input.css';
import btn_visibility_off from '../../images/button/btn_visibility_off.svg';
import btn_visibility_on from '../../images/button/btn_visibility_on.svg';

function Input({ labelName, placeholder, password, value, onChange, error }) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((t) => !t);
  };

  return (
    <div className="input-container">
      <label className="input-label">{labelName}</label>
      <div className={error ? 'input-wrapper-error' : 'input-wrapper'}>
        <input
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
          />
        )}
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Input;
