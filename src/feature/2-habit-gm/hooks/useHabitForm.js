import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createHabit, updateHabit, deleteHabit } from '../../../api/habitApi';

export default function useHabitMutations(studyId, { onSuccess } = {}) {
  const queryClient = useQueryClient();
  const habitQueryKey = ['habits', studyId];

  // 습관 추가
  const createMutation = useMutation({
    mutationFn: (newHabit) => createHabit(studyId, newHabit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitQueryKey });
      onSuccess?.();
    },
    onError: () => alert('습관 추가에 실패했습니다.'),
  });

  // 습관 수정
  const updateMutation = useMutation({
    mutationFn: ({ habitId, data }) => updateHabit(studyId, habitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitQueryKey });
      onSuccess?.();
    },
    onError: () => alert('습관 수정에 실패했습니다.'),
  });

  // 습관 삭제
  const deleteMutation = useMutation({
    mutationFn: (habitId) => deleteHabit(studyId, habitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: habitQueryKey });
    },
    onError: () => alert('습관 삭제에 실패했습니다.'),
  });

  return { createMutation, updateMutation, deleteMutation };
}