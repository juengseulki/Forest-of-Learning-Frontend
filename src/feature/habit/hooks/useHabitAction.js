import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleHabitCheck } from '../../../api/habitApi.js';
import handleApiError from '../../../utils/handleApiError.jsx';
import { getTodayDateString } from '../utils/habitUtils.js';

export function useHabitAction(studyId) {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: ({ habit }) => {
      const today = getTodayDateString();
      const nextCompleted = !habit.todayRecord?.completed;

      return toggleHabitCheck(habit.id, today, nextCompleted);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits', studyId] });
    },

    onError: (error) => {
      handleApiError(error, '습관 체크 변경에 실패했어요.');
    },
  });

  return {
    toggleHabit: (habit) => toggleMutation.mutate({ habit }),
    isToggling: toggleMutation.isPending,
  };
}
