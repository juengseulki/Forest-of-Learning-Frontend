import { useEffect, useMemo, useState } from 'react';
import { getStudies } from '../../../api/studyApi';
import { getPoint } from '../../../api/pointApi';
import { getEmojiReactions } from '../../../api/emojiApi';
import {
  getRecentStudies,
  clearRecentStudies,
} from '../shared/utils/recentStudy';

export function useHomeStudies() {
  const [listPage, setListPage] = useState(1);
  const [studies, setStudies] = useState([]);
  const [recentStudyIds, setRecentStudyIds] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [order, setOrder] = useState('latest');
  const [isLoading, setIsLoading] = useState(false);

  const listLimit = 6;
  const recentLimit = 3;

  function moreSee() {
    setListPage((prev) => prev + 1);
  }

  function refreshRecentStudies() {
    const recent = getRecentStudies();
    setRecentStudyIds(recent.map((item) => item.id));
  }

  function clearRecentStudyList() {
    clearRecentStudies();
    setRecentStudyIds([]);
  }

  useEffect(() => {
    refreshRecentStudies();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
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
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredStudies = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    let result = [...studies];

    if (normalizedKeyword) {
      result = result.filter((study) => {
        const nickname = study.nickname?.toLowerCase() ?? '';
        const name = study.name?.toLowerCase() ?? '';
        const description = study.description?.toLowerCase() ?? '';

        return (
          nickname.includes(normalizedKeyword) ||
          name.includes(normalizedKeyword) ||
          description.includes(normalizedKeyword)
        );
      });
    }

    switch (order) {
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case 'pointDesc':
        result.sort((a, b) => (b.point ?? 0) - (a.point ?? 0));
        break;
      case 'pointAsc':
        result.sort((a, b) => (a.point ?? 0) - (b.point ?? 0));
        break;
      case 'latest':
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [studies, keyword, order]);

  const recentStudies = useMemo(() => {
    if (recentStudyIds.length === 0) return [];

    return recentStudyIds
      .map((id) => studies.find((study) => study.id === id))
      .filter(Boolean)
      .slice(0, recentLimit);
  }, [recentStudyIds, studies]);

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
    moreSee,
    clearRecentStudyList,
    refreshRecentStudies,
  };
}
