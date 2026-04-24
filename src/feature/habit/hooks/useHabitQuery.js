import { useQuery } from '@tanstack/react-query';
import { getHabitList } from '@/api/habitApi.js';
import { normalizeHabitListResponse } from '../utils/habitUtils.js';

export function useHabitQuery(studyId) {
  const parsedStudyId = Number(studyId);

  return useQuery({
    queryKey: ['habits', parsedStudyId],
    queryFn: async () => {
      const data = await getHabitList(parsedStudyId);
      return normalizeHabitListResponse(data);
    },
    enabled: Boolean(parsedStudyId),
  });
}
