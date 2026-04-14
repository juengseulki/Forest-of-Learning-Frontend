import { useEffect, useState } from 'react';
import { getStudy } from '../../../api/studyApi.js';
import { extractStudyTitle } from '../utils/habitUtils';

export function useStudyTitle(studyId) {
  const [studyTitle, setStudyTitle] = useState('');

  useEffect(() => {
    const fetchStudyDetail = async () => {
      if (!studyId) {
        setStudyTitle('');
        return;
      }

      try {
        const data = await getStudy(studyId);
        setStudyTitle(extractStudyTitle(data));
      } catch (error) {
        console.error('스터디 상세 조회 실패:', error);
        setStudyTitle('');
      }
    };

    fetchStudyDetail();
  }, [studyId]);

  return studyTitle;
}
