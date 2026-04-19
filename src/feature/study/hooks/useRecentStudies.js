import { useCallback, useMemo, useState } from 'react';
import {
  getRecentStudies,
  clearRecentStudies,
} from '../shared/utils/recentStudy';

export function useRecentStudies(studies, recentLimit = 3) {
  const [recentStudyIds, setRecentStudyIds] = useState(() =>
    getRecentStudies().map((item) => item.id)
  );

  const refreshRecentStudies = useCallback(() => {
    const recent = getRecentStudies();
    setRecentStudyIds(recent.map((item) => item.id));
  }, []);

  const clearRecentStudyList = useCallback(() => {
    clearRecentStudies();
    setRecentStudyIds([]);
  }, []);

  const recentStudies = useMemo(() => {
    if (recentStudyIds.length === 0) return [];

    return recentStudyIds
      .map((id) => studies.find((study) => study.id === id))
      .filter(Boolean)
      .slice(0, recentLimit);
  }, [recentStudyIds, studies, recentLimit]);

  return {
    recentStudies,
    refreshRecentStudies,
    clearRecentStudyList,
  };
}
