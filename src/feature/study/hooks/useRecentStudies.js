import { useCallback, useEffect, useMemo } from 'react';
import {
  getRecentStudies,
  clearRecentStudies,
} from '../shared/utils/recentStudy.js';
import { useStudy } from '../../../contexts/StudyContext.jsx';

export function useRecentStudies(studies, recentLimit = 3) {
  const { state, dispatch } = useStudy();
  const { recentStudies: recentState } = state;

  const refreshRecentStudies = useCallback(() => {
    const recent = getRecentStudies();
    dispatch({ type: 'SET_RECENT', payload: recent });
  }, [dispatch]);

  const clearRecentStudyList = useCallback(() => {
    clearRecentStudies();
    dispatch({ type: 'SET_RECENT', payload: [] });
  }, [dispatch]);

  useEffect(() => {
    if (recentState.length === 0) {
      refreshRecentStudies();
    }
  }, [recentState.length, refreshRecentStudies]);

  const recentStudies = useMemo(() => {
    if (recentState.length === 0) return [];

    return recentState
      .map((recentItem) => studies.find((study) => study.id === recentItem.id))
      .filter(Boolean)
      .slice(0, recentLimit);
  }, [recentState, studies, recentLimit]);

  return {
    recentStudies,
    refreshRecentStudies,
    clearRecentStudyList,
  };
}
