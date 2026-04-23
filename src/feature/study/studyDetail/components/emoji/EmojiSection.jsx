import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import smileIcon from '../../../../../images/icon/ic_smile.svg';
import EmojiList from './EmojiList.jsx';
import { useEmojiSection } from '../../hooks/useEmojiSection.js';
import { usePickerTheme } from '../../hooks/usePickerTheme.js';

function EmojiSection({ studyId }) {
  const { emojis, isPickerVisible, togglePicker, handleAddEmoji } =
    useEmojiSection(studyId);
  const theme = usePickerTheme();

  return (
    <span className="emoji">
      <EmojiList emojis={emojis} onAddEmoji={handleAddEmoji} />

      <div className="emoji-picker-container">
        <button type="button" className="emoji-add-btn" onClick={togglePicker}>
          <img src={smileIcon} alt="이모지 추가" />
          추가
        </button>

        {isPickerVisible && (
          <div className="picker">
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
