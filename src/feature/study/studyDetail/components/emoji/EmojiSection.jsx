import React, { useState, useEffect, useCallback } from 'react';
import smileIcon from '../../../../../images/icon/ic_smile.svg';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import EmojiList from './EmojiList';
import {
  getEmojiReactions,
  addEmojiReaction,
} from '../../../../../api/emojiApi';
import handleApiError from '../../../../../utils/handleApiError.jsx';

function EmojiSection({ studyId }) {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [emojis, setEmojis] = useState([]);

  const getEmoji = useCallback(async () => {
    try {
      const emojiData = await getEmojiReactions(studyId);
      setEmojis(emojiData?.items || []);
    } catch (error) {
      handleApiError(error, '이모지를 불러오지 못했습니다.');
    }
  }, [studyId]);

  useEffect(() => {
    const fetchEmojis = async () => {
      await getEmoji();
    };
    fetchEmojis();
  }, [getEmoji]);

  const handleAddEmoji = async (emojiData) => {
    try {
      const emojiValue = emojiData.native ? emojiData.native : emojiData;
      await addEmojiReaction(studyId, emojiValue);
      getEmoji();
      setPickerVisible(false);
    } catch (error) {
      handleApiError(error, '이모지 추가에 실패했습니다.');
    }
  };

  return (
    <span className="emoji">
      <EmojiList emojis={emojis} onAddEmoji={handleAddEmoji} />
      <div className="emoji-picker-container">
        <button
          className="emoji-add-btn"
          onClick={() => {
            setPickerVisible((prev) => !prev);
          }}
        >
          <img src={smileIcon} alt="이모지 추가" />
          추가
        </button>

        {isPickerVisible && (
          <div className="picker">
            <Picker
              data={data}
              onEmojiSelect={handleAddEmoji}
              theme="light"
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
