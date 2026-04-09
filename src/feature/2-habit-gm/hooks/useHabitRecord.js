import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getHabitRecords, toggleHabitCheck } from '../../../api/habitApi';
import { mapRecordsToCheckedMap } from '../utils/habitMapper';

export default function useHabitRecord(studyId, { startDate, endDate }) {
  const queryClient = useQueryClient();
  const queryKey = ['habitRecords', studyId, startDate, endDate]; // 기록 데이터 이름표

  // 데이터 가져오기
  const { data: checkedMap = {}, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await getHabitRecords(studyId, { startDate, endDate });
      return mapRecordsToCheckedMap(data.records); 
    },
    enabled: !!studyId,
  });

  // 데이터 변경하기 (체크/해제)
  const toggleMutation = useMutation({
    mutationFn: ({ habitId, date }) => toggleHabitCheck(studyId, habitId, date),
    
    onMutate: async ({ habitId, date }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousMap = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (oldMap) => {
        const newMap = { ...oldMap };
        const habitDates = new Set(newMap[habitId] || []);
        
        if (habitDates.has(date)) {
          habitDates.delete(date); // 이미 있으면 체크 해제
        } else {
          habitDates.add(date); // 없으면 체크
        }
        newMap[habitId] = habitDates;
        return newMap;
      });

      return { previousMap };
    },
    
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context.previousMap);
      alert('체크 처리에 실패했습니다. 네트워크를 확인해주세요.');
    },
    
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const isChecked = (habitId, date) => {
    return checkedMap[habitId]?.has(date) ?? false;
  };

  const toggleCheck = (habitId, date) => {
    toggleMutation.mutate({ habitId, date });
  };

  return { isChecked, toggleCheck, isLoading };
}