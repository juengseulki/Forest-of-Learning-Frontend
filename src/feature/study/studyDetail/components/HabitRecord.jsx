import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import handleApiError from '../../../../utils/handleApiError.jsx';
import { getHabitRecords } from '../../../../api/habitApi.js';
import { getWeekDays } from '../utils/getWeekDays.js';
import { getThisWeekRange } from '../utils/getThisWeekRange.js';

export function useHabitRecord(studyId) {
  const { startDate, endDate, weekStartDate } = useMemo(
    () => getThisWeekRange(),
    []
  );

  const {
    data: habits = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['habitRecords', Number(studyId), startDate, endDate],
    queryFn: async () => {
      const habitData = await getHabitRecords(studyId, startDate, endDate);
      return habitData?.items ?? [];
    },
    enabled: Boolean(studyId),
    onError: (error) => {
      handleApiError(error, '습관 기록을 불러오지 못했습니다.');
    },
  });

  const weekDays = useMemo(() => getWeekDays(weekStartDate), [weekStartDate]);

  return {
    habits,
    weekDays,
    hasHabits: habits.length > 0,
    isLoading,
    isError,
  };
}
