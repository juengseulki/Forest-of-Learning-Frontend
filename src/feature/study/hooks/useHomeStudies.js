import { useEffect, useMemo, useState } from 'react';
import { getStudies } from '../../../api/studyApi';
import { getPoint } from '../../../api/pointApi';
import { getEmojiReactions } from '../../../api/emojiApi';
import { useRecentStudies } from './useRecentStudies';
import {
  getFilteredStudies,
  getVisibleCount,
  getHasMore,
} from '../utils/homeStudyUtils';

export function useHomeStudies() {
  const [listPage, setListPage] = useState(1);
  const [studies, setStudies] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState('latest');
  const [isLoading, setIsLoading] = useState(false);

  const listLimit = 6;
  const recentLimit = 3;

  function moreSee() {
    setListPage((prev) => prev + 1);
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);

        const data = await getStudies();

        const studiesWithExtra = await Promise.all(
          (data?.items ?? []).map(async (study) => {
            const [pointData, emojiData] = await Promise.all([
              getPoint(study.id),
              getEmojiReactions(study.id),
            ]);

            return {
              ...study,
              point: pointData?.totalPoint ?? 0,
              emojis: emojiData?.items ?? [],
            };
          })
        );

        if (isMounted) {
          setStudies(studiesWithExtra);
        }
      } catch (error) {
        console.error('홈 스터디 목록 조회 실패:', error);

        if (isMounted) {
          setStudies([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setListPage(1);
  }, [keyword, order]);

  const filteredStudies = useMemo(() => {
    return getFilteredStudies(studies, keyword, order);
  }, [studies, keyword, order]);

  const visibleCount = useMemo(() => {
    return getVisibleCount(listPage, listLimit);
  }, [listPage, listLimit]);

  const hasMore = useMemo(() => {
    return getHasMore(filteredStudies.length, visibleCount);
  }, [filteredStudies.length, visibleCount]);

  const { recentStudies, refreshRecentStudies, clearRecentStudyList } =
    useRecentStudies(studies, recentLimit);

  return {
    listPage,
    listLimit,
    recentLimit,
    keyword,
    setKeyword,
    order,
    setOrder,
    isLoading,
    filteredStudies,
    recentStudies,
    visibleCount,
    hasMore,
    moreSee,
    clearRecentStudyList,
    refreshRecentStudies,
  };
}
