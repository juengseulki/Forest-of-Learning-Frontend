import { useEffect, useState } from 'react';
import { getStudy } from '../../../api/studyApi.js';
import { extractStudyTitle } from '../utils/habitUtils';
import handleApiError from '../../../utils/handleApiError.jsx';

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
        handleApiError(error, '스터디 정보를 불러오지 못했습니다.');
        setStudyTitle('');
      }
    };

    fetchStudyDetail();
  }, [studyId]);

  return studyTitle;
}
