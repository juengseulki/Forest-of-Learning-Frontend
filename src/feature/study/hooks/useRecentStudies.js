import { useCallback, useMemo, useState } from 'react';
import {
  addRecentStudy,
  getRecentStudies,
  clearRecentStudies,
} from '../shared/utils/recentStudy.js';

export function useRecentStudies(recentLimit = 3) {
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
    return recentItems.slice(0, recentLimit);
  }, [recentItems, recentLimit]);

  return {
    recentStudies,
    addRecentStudyItem,
    refreshRecentStudies,
    clearRecentStudyList,
  };
}
