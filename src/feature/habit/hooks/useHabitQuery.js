import { useQuery } from '@tanstack/react-query';
import { getHabitList } from '../../../api/habitApi.js';
import { normalizeHabitListResponse } from '../utils/habitUtils.js';

export function useHabitQuery(studyId) {
  return useQuery({
    queryKey: ['habits', studyId],
    queryFn: async () => {
      const data = await getHabitList(studyId);
      return normalizeHabitListResponse(data);
    },
    enabled: Boolean(studyId),
  });
}
