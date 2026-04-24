import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleHabitCheck } from '@/api/habitApi.js';
import handleApiError from '@/utils/handleApiError.jsx';
import { getTodayDateString } from '../utils/habitUtils.js';

export function useHabitAction(studyId) {
  const queryClient = useQueryClient();
  const queryKey = ['habits', studyId];

  const toggleMutation = useMutation({
    mutationFn: ({ habit }) => {
      const today = getTodayDateString();
      const habitId = habit.id ?? habit.habitId;
      const nextCompleted = !habit.todayRecord?.completed;

      return toggleHabitCheck(habitId, today, nextCompleted);
    },

    onMutate: async ({ habit }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousHabits = queryClient.getQueryData(queryKey);
      const targetId = habit.id ?? habit.habitId;

      queryClient.setQueryData(queryKey, (old = []) =>
        old.map((item) => {
          const itemId = item.id ?? item.habitId;

          if (itemId !== targetId) return item;

          return {
            ...item,
            todayRecord: {
              ...item.todayRecord,
              completed: !item.todayRecord?.completed,
            },
          };
        })
      );

      return { previousHabits };
    },

    onError: (error, _variables, context) => {
      if (context?.previousHabits) {
        queryClient.setQueryData(queryKey, context.previousHabits);
      }

      handleApiError(error, '습관 체크 변경에 실패했어요.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    toggleHabit: (habit) => toggleMutation.mutate({ habit }),
    isToggling: toggleMutation.isPending,
  };
}
