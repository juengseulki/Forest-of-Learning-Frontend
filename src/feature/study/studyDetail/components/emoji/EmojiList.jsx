import React, { useState, useRef } from 'react';
import plusIcon from '../../../../../images/icon/ic_plus.svg';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

function EmojiList({ emojis, onAddEmoji }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const popupRef = useRef(null);
  useOnClickOutside(popupRef, () => setIsExpanded(false), isExpanded);
  return (
    <div className="emoji-wrap">
      {emojis.slice(0, 3).map((e) => {
        return (
          <button
            key={e.emoji}
            onClick={(event) => {
              event.stopPropagation();
              onAddEmoji(e.emoji);
            }}
            className="emoji-btn"
          >
            {e.emoji} {e.count}
          </button>
        );
      })}

      {emojis.length > 3 && (
        <div className="more-emoji-wrapper" ref={popupRef}>
          <button
            onClick={(event) => {
              event.stopPropagation();
              setIsExpanded((prev) => !prev);
            }}
            className="emoji-more-btn"
          >
            <img src={plusIcon} alt="+ 아이콘 " /> {emojis.length - 3}..
          </button>
          {isExpanded && (
            <div
              className="emoji-popup"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {emojis.slice(3).map((e) => {
                return (
                  <button
                    key={e.emoji}
                    className="emoji-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      onAddEmoji(e.emoji);
                    }}
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
