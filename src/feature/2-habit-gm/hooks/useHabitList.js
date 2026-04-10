import { useQuery } from '@tanstack/react-query';
import { getHabitList } from '../../../api/habitApi';
import { mapHabitList } from '../utils/habitMapper';

export default function useHabitList(studyId) {
  const { data: habits = [], isLoading, isError, error } = useQuery({
    queryKey: ['habits', studyId],
    queryFn: async () => {
      const { data } = await getHabitList(studyId);
      return mapHabitList(data.items); 
    },
    enabled: !!studyId,
  });

  return { habits, isLoading, error: isError ? error : null };
}