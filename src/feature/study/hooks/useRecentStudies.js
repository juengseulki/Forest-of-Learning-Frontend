import { useCallback, useMemo, useState } from 'react';
import {
  addRecentStudy,
  getRecentStudies,
  clearRecentStudies,
} from '../shared/utils/recentStudy.js';

export function useRecentStudies(studies = [], recentLimit = 3) {
  const [recentItems, setRecentItems] = useState(() => getRecentStudies());

  const refreshRecentStudies = useCallback(() => {
    setRecentItems(getRecentStudies());
  }, []);

  const addRecentStudyItem = useCallback((study) => {
    const updated = addRecentStudy(study);
    setRecentItems(updated);
  }, []);

  const clearRecentStudyList = useCallback(() => {
    clearRecentStudies();
    setRecentItems([]);
  }, []);

  const recentStudies = useMemo(() => {
    return recentItems
      .map((recentItem) => studies.find((study) => study.id === recentItem.id))
      .filter(Boolean)
      .slice(0, recentLimit);
  }, [recentItems, studies, recentLimit]);

  return {
    recentStudies,
    addRecentStudyItem,
    refreshRecentStudies,
    clearRecentStudyList,
  };
}
