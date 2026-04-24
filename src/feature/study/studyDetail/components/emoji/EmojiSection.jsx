import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import smileIcon from '../../../../../images/icon/ic_smile.svg';
import EmojiList from './EmojiList.jsx';
import { useEmojiSection } from '../../hooks/useEmojiSection.js';
import { usePickerTheme } from '../../hooks/usePickerTheme.js';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useState, useRef } from 'react';

function EmojiSection({ studyId }) {
  const { emojis, isPickerVisible, togglePicker, handleAddEmoji, pickerRef } =
    useEmojiSection(studyId);
  const theme = usePickerTheme();
  // const [isExpanded, setIsExpanded] = useState(false);

  // const popupRef = useRef(null);
  // useOnClickOutside(popupRef, () => setIsExpanded(false), isExpanded);

  return (
    <span className="emoji">
      <EmojiList emojis={emojis} onAddEmoji={handleAddEmoji} />

      <div className="emoji-picker-container" ref={pickerRef}>
        <button
          type="button"
          className="emoji-add-btn"
          onClick={(event) => {
            event.stopPropagation();
            togglePicker();
          }}
        >
          <img src={smileIcon} alt="이모지 추가" />
          추가
        </button>

        {isPickerVisible && (
          <div
            className="picker"
            onMouseDown={(e) => e.stopPropagation()} // 추가
            onClick={(e) => e.stopPropagation()}
          >
            <Picker
              data={data}
              onEmojiSelect={handleAddEmoji}
              theme={theme}
              perLine={7}
              maxFrequentRows={0}
              skinTonePosition="none"
            />
          </div>
        )}
      </div>
    </span>
  );
}

export default EmojiSection;
