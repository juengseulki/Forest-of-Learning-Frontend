import { useEffect, useState, useRef } from 'react';
import handleApiError from '@/utils/handleApiError.jsx';
import { useOnClickOutside } from './useOnClickOutside.js';
import { getEmojiReactions, addEmojiReaction } from '@/api/emojiApi.js';

async function fetchEmojiItems(studyId) {
  const emojiData = await getEmojiReactions(studyId);
  return emojiData?.items ?? [];
}

export function useEmojiSection(studyId) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [emojis, setEmojis] = useState([]);

  const pickerRef = useRef(null);
  useOnClickOutside(
    pickerRef,
    () => setIsPickerVisible(false),
    isPickerVisible
  );

  useEffect(() => {
    if (!studyId) return;

    let isMounted = true;

    const loadEmojis = async () => {
      try {
        const items = await fetchEmojiItems(studyId);

        if (isMounted) {
          setEmojis(items);
        }
      } catch (error) {
        handleApiError(error, '이모지를 불러오지 못했습니다.');
      }
    };

    loadEmojis();

    return () => {
      isMounted = false;
    };
  }, [studyId]);

  const togglePicker = () => {
    setIsPickerVisible((prev) => !prev);
  };

  const handleAddEmoji = async (emojiData) => {
    try {
      const emojiValue = emojiData?.native ?? emojiData;

      await addEmojiReaction(studyId, emojiValue);

      const items = await fetchEmojiItems(studyId);
      setEmojis(items);
    } catch (error) {
      handleApiError(error, '이모지 추가에 실패했습니다.');
    }
  };

  return {
    emojis,
    isPickerVisible,
    togglePicker,
    handleAddEmoji,
    pickerRef,
  };
}
