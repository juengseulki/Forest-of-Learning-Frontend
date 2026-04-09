import { useState, useEffect, useCallback } from 'react';
import { getHabitRecords, toggleHabitCheck } from '../../../api/habitApi';

function useHabitRecord(studyId, { startDate, endDate } = {}) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async () => {
    if (!studyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getHabitRecords(studyId, { startDate, endDate });
      setRecords(data.items ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [studyId, startDate, endDate]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // 특정 날짜의 습관 체크 여부 확인
  function isChecked(habitId, date) {
    const record = records.find((r) => r.habitId === habitId);
    return record?.checkedDates?.includes(date) ?? false;
  }

  // 습관 체크 / 해제
  async function toggleCheck(habitId, date) {
    setError(null);
    setRecords((prev) =>
      prev.map((record) => {
        if (record.habitId !== habitId) return record;
        const checkedDates = record.checkedDates ?? [];
        const alreadyChecked = checkedDates.includes(date);
        return {
          ...record,
          checkedDates: alreadyChecked
            ? checkedDates.filter((d) => d !== date)
            : [...checkedDates, date],
        };
      })
    );
    try {
      await toggleHabitCheck(studyId, habitId, date);
    } catch (err) {
      setError(err);
      // 에러 처리
      fetchRecords();
    }
  }

  return { records, isLoading, error, isChecked, toggleCheck, fetchRecords };
}

export default useHabitRecord;