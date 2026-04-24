import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleHabitCheck } from '@/api/habitApi.js';
import handleApiError from '@/utils/handleApiError.jsx';
import { getTodayDateString } from '../utils/habitUtils.js';

export function useHabitAction(studyId) {
  const queryClient = useQueryClient();
  const queryKey = ['habits', studyId];

  const toggleMutation = useMutation({
    mutationFn: ({ habitId, today, nextCompleted }) => {
      return toggleHabitCheck(habitId, today, nextCompleted);
    },

    onMutate: async ({ habitId, today, nextCompleted }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousHabits = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (old = []) =>
        old.map((habit) => {
          const currentId = habit.id ?? habit.habitId;

          if (currentId !== habitId) return habit;

          return {
            ...habit,
            todayRecord: {
              ...habit.todayRecord,
              date: today,
              completed: nextCompleted,
            },
          };
        })
      );

      return { previousHabits };
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.previousHabits);
      handleApiError(error, '습관 체크 변경에 실패했어요.');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    toggleHabit: (habit) => {
      const today = getTodayDateString();
      const habitId = habit.id ?? habit.habitId;
      const nextCompleted = !habit.todayRecord?.completed;

      toggleMutation.mutate({
        habitId,
        today,
        nextCompleted,
      });
    },
    isToggling: toggleMutation.isPending,
  };
}
