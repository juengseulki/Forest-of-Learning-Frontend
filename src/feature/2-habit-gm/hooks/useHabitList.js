import { useState, useEffect, useCallback } from 'react';
import { getHabitList, createHabit, deleteHabit } from '../../../api/habitApi';

function useHabitList(studyId) {
  const [habits, setHabits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHabits = useCallback(async () => {
    if (!studyId) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getHabitList(studyId);
      setHabits(data.items ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [studyId]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  async function addHabit(habitData) {
    setError(null);
    try {
      const { data } = await createHabit(studyId, habitData);
      setHabits((prev) => [...prev, data]);
    } catch (err) {
      setError(err);
    }
  }

  async function removeHabit(habitId) {
    setError(null);
    try {
      await deleteHabit(studyId, habitId);
      setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
    } catch (err) {
      setError(err);
    }
  }

  return { habits, isLoading, error, fetchHabits, addHabit, removeHabit };
}

export default useHabitList;