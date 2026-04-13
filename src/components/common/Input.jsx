import React, { useState } from 'react';
import '../../styles/Input.css';
import btn_visibility_off from '../../images/focus/button/btn_visibility_off.svg';
import btn_visibility_on from '../../images/focus/button/btn_visibility_on.svg';

function Input({ labelName, placeholder, password }) {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible((t) => !t);
  };

  return (
    <div className="input-container">
      <label className="input-label">{labelName}</label>

      <div className="input-wrapper">
        <input
          type={password ? (visible ? 'text' : 'password') : 'text'}
          className="input-field"
          placeholder={placeholder}
        />
        {password && (
          <img
            src={visible ? btn_visibility_on : btn_visibility_off}
            onClick={toggleVisibility}
            className="visibility-icon"
          />
        )}
      </div>
    </div>
  );
}

export default Input;
