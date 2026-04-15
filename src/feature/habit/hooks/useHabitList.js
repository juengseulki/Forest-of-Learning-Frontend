import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getHabitList, toggleHabitCheck } from '../../../api/habitApi.js';
import {
  getTodayDateString,
  normalizeHabitListResponse,
} from '../utils/habitUtils';

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
      console.error('습관 목록 조회 실패:', error);
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
      console.error('습관 체크 변경 실패:', error);
      toast.error('습관 체크 변경에 실패했어요.');
    }
  }, []);

  const removeHabitLocally = useCallback((habitId) => {
    setHabitList((prevHabitList) =>
      prevHabitList.filter((habit) => habit.id !== habitId)
    );
  }, []);

  return {
    habitList,
    isLoading,
    errorMessage,
    fetchHabitList,
    toggleHabit,
    removeHabitLocally,
  };
}
