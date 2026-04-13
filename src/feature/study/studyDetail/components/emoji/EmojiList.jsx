import React, { useState } from 'react';
import plusIcon from '../../../../../images/icon/ic_plus.svg';

function EmojiList({ emojis, onAddEmoji }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="emoji-wrap">
      {emojis.slice(0, 3).map((e) => {
        return (
          <button
            key={e.emoji}
            onClick={() => {
              onAddEmoji(e.emoji);
            }}
            className="emoji-btn"
          >
            {e.emoji} {e.count}
          </button>
        );
      })}

      {emojis.length > 3 && (
        <div className="more-emoji-wrapper">
          <button
            onClick={() => {
              setIsExpanded((prev) => !prev);
            }}
            className="emoji-more-btn"
          >
            <img src={plusIcon} alt="+ 아이콘 " /> {emojis.length - 3}..
          </button>
          {isExpanded && (
            <div className="emoji-popup">
              {emojis.slice(3).map((e) => {
                return (
                  <button
                    key={e.emoji}
                    className="emoji-btn"
                    onClick={() => onAddEmoji(e.emoji)}
                  >
                    {e.emoji} {e.count}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default EmojiList;
