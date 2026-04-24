import { useQuery } from '@tanstack/react-query';
import { getStudy } from '../../../api/studyApi.js';
import { extractStudyTitle } from '../utils/habitUtils.js';
import handleApiError from '../../../utils/handleApiError.jsx';

export function useStudyTitle(studyId) {
  const { data = '' } = useQuery({
    queryKey: ['study', studyId],
    queryFn: async () => {
      const data = await getStudy(studyId);
      return extractStudyTitle(data);
    },
    enabled: Boolean(studyId),
    onError: (error) => {
      handleApiError(error, '스터디 정보를 불러오지 못했습니다.');
    },
  });

  return data;
}
