import { useEffect, useState } from 'react';

import { getPoint } from '../../../../api/pointApi.js';
import handleApiError from '../../../../utils/handleApiError.jsx';

export function useStudyPoint(studyId) {
  const [point, setPoint] = useState(0);

  useEffect(() => {
    if (!studyId) return;

    let isMounted = true;

    const loadPoint = async () => {
      try {
        const studyPoint = await getPoint(studyId);

        if (isMounted) {
          setPoint(studyPoint?.totalPoint ?? 0);
        }
      } catch (error) {
        handleApiError(error, '포인트를 불러오지 못했습니다.');
      }
    };

    loadPoint();

    return () => {
      isMounted = false;
    };
  }, [studyId]);

  return { point };
}
