import { useCallback, useEffect, useState } from 'react';
import { getHabitList, toggleHabitCheck, deleteHabit } from '@/api/habitApi.js';
import {
  getTodayDateString,
  normalizeHabitListResponse,
} from '../utils/habitUtils.js';
import handleApiError from '@/utils/handleApiError.jsx';

export function useHabitList(studyId) {
  const [habitList, setHabitList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchHabitList = useCallback(async () => {
    if (!studyId) {
      setHabitList([]);
      setErrorMessage('유효한 스터디 정보가 없어요.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const data = await getHabitList(studyId);
      const nextHabitList = normalizeHabitListResponse(data);

      setHabitList(nextHabitList);
    } catch (error) {
      handleApiError(error, '습관 목록을 불러오지 못했어요.');
      setHabitList([]);
      setErrorMessage('습관 목록을 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  }, [studyId]);

  useEffect(() => {
    fetchHabitList();
  }, [fetchHabitList]);

  const toggleHabit = useCallback(async (habit) => {
    const nextCompleted = !habit.todayRecord?.completed;
    const today = getTodayDateString();

    try {
      await toggleHabitCheck(habit.id, today, nextCompleted);

      setHabitList((prevHabitList) =>
        prevHabitList.map((item) =>
          item.id === habit.id
            ? {
                ...item,
                todayRecord: {
                  ...item.todayRecord,
                  date: today,
                  completed: nextCompleted,
                },
              }
            : item
        )
      );
    } catch (error) {
      handleApiError(error, '습관 체크 변경에 실패했어요.');
    }
  }, []);

  const removeHabit = useCallback(async (habit) => {
    const habitId = habit.id ?? habit.habitId;

    try {
      await deleteHabit(habitId);

      setHabitList((prevHabitList) =>
        prevHabitList.filter((item) => (item.id ?? item.habitId) !== habitId)
      );
    } catch (error) {
      handleApiError(error, '습관 삭제에 실패했어요.');
    }
  }, []);

  return {
    habitList,
    isLoading,
    errorMessage,
    fetchHabitList,
    toggleHabit,
    removeHabit,
  };
}
