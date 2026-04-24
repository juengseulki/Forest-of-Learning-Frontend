import { useQuery } from '@tanstack/react-query';
import { getPoint } from '../../../../api/pointApi.js';
import handleApiError from '../../../../utils/handleApiError.jsx';

export function useStudyPoint(studyId) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['point', Number(studyId)],
    queryFn: () => getPoint(studyId),
    enabled: Boolean(studyId),
    initialData: { totalPoint: 0 },
    onError: (error) => {
      handleApiError(error, '포인트를 불러오지 못했습니다.');
    },
  });

  return {
    point: data?.totalPoint ?? 0,
    isLoading,
    isError,
  };
}
