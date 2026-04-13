import React from 'react';
import '../../styles/Input.css';

function Input({
  labelName = '닉네임',
  placeholder = '닉네임을 입력해 주세요',
}) {
  return (
    <div className="input-container">
      <label className="input-label">{labelName}</label>
      <div className="input-wrapper">
        <input className="input-field" placeholder={placeholder} />
      </div>
    </div>
  );
}

export default Input;
