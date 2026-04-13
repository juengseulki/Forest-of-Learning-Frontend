import React from 'react';
import smileIcon from '../../../images/icon/ic_smile.svg';

function EmojiSection() {
  return (
    <span className="emoji">
      <div className="emoji-wrap">
        <button className="emoji-btn">🔥 9</button>
        <button className="emoji-btn">🤩 9</button>
      </div>
      <button className="emoji-add-btn">
        <img src={smileIcon} alt="이모지 추가" />
        추가
      </button>
    </span>
  );
}

export default EmojiSection;
