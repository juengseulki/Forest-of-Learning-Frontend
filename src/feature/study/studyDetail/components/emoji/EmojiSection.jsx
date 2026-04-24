import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import handleApiError from '../../../../../utils/handleApiError.jsx';
import { useOnClickOutside } from '../../hooks/useOnClickOutside.js';
import {
  getEmojiReactions,
  addEmojiReaction,
} from '../../../../../api/emojiApi.js';

async function fetchEmojiItems(studyId) {
  const emojiData = await getEmojiReactions(studyId);
  return emojiData?.items ?? [];
}

export function useEmojiSection(studyId) {
  const queryClient = useQueryClient();
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const pickerRef = useRef(null);

  useOnClickOutside(
    pickerRef,
    () => setIsPickerVisible(false),
    isPickerVisible
  );

  const { data: emojis = [] } = useQuery({
    queryKey: ['emojis', Number(studyId)],
    queryFn: () => fetchEmojiItems(studyId),
    enabled: Boolean(studyId),
    onError: (error) => {
      handleApiError(error, '이모지를 불러오지 못했습니다.');
    },
  });

  const addEmojiMutation = useMutation({
    mutationFn: (emojiData) => {
      const emojiValue = emojiData?.native ?? emojiData;
      return addEmojiReaction(studyId, emojiValue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emojis', Number(studyId)] });
      queryClient.invalidateQueries({ queryKey: ['studies'] });
    },
    onError: (error) => {
      handleApiError(error, '이모지 추가에 실패했습니다.');
    },
  });

  const togglePicker = () => {
    setIsPickerVisible((prev) => !prev);
  };

  const handleAddEmoji = (emojiData) => {
    addEmojiMutation.mutate(emojiData);
  };

  return {
    emojis,
    isPickerVisible,
    togglePicker,
    handleAddEmoji,
    pickerRef,
    isAddingEmoji: addEmojiMutation.isPending,
  };
}
export default useEmojiSection;
