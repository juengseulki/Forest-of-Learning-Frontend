import { useEffect, useMemo, useState } from 'react';

import handleApiError from '../../../../utils/handleApiError.jsx';
import { getHabitRecords } from '../../../../api/habitApi.js';
import { getWeekDays } from '../utils/getWeekDays.js';
import { getThisWeekRange } from '../utils/getThisWeekRange.js';

export function useHabitRecord(studyId) {
  const [habits, setHabits] = useState([]);
  const [weekStart, setWeekStart] = useState('');

  useEffect(() => {
    if (!studyId) return;

    const fetchHabits = async () => {
      try {
        const { startDate, endDate, weekStartDate } = getThisWeekRange();
        const habitData = await getHabitRecords(studyId, startDate, endDate);

        setHabits(habitData?.items ?? []);
        setWeekStart(weekStartDate);
      } catch (error) {
        handleApiError(error, '습관 기록을 불러오지 못했습니다.');
        setHabits([]);
      }
    };

    fetchHabits();
  }, [studyId]);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);

  return {
    habits,
    weekDays,
    hasHabits: habits.length > 0,
  };
}
