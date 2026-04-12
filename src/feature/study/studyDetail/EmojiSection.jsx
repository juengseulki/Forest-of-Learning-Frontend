import React, { useState, useEffect } from 'react';
import smileIcon from '../../../images/icon/ic_smile.svg';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { emojiMockResponse } from '../../../mocks/emoji/emojiMockData';
import plusIcon from '../../../images/icon/ic_plus.svg';
function EmojiSection({ studyId }) {
  //렌더링시 4개 이상인 경우 하나로 묶어서 팝업으로 보이게
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [emojis, setEmojis] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    const getEmoji = async () => {
      //const res = await fetch(BASE_URL)
      setEmojis(emojiMockResponse);

      const targetStudy = emojiMockResponse.data.items.find(
        (item) => item.studyId === 2
      );

      if (targetStudy && targetStudy.emojis) {
        setEmojis(targetStudy.emojis);
      }
    };
    getEmoji();
  }, [studyId]);

  const handleAddEmoji = (emojiData) => {
    const emojiValue = emojiData.native ? emojiData.native : emojiData;
    //const addEmoji = fetch(BASE_URL, method:"POST")
    //중복검사 후 카운트 변경 로직은 백엔드에서 구현 예정
    const newEmoji = {
      emoji: emojiValue,
      count: 1,
    };
    setEmojis((prev) => [...prev, newEmoji]);
    setPickerVisible(false);
  };

  return (
    <span className="emoji">
      <div className="emoji-wrap">
        {emojis.slice(0, 3).map((e) => {
          return (
            <button
              key={e.emoji}
              onClick={() => {
                handleAddEmoji(e.emoji);
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
                    <button key={e.emoji} className="emoji-btn">
                      {e.emoji} {e.count}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
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
    </span>
  );
}

export default EmojiSection;
