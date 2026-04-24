import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getStudies } from '@/api/studyApi.js';
import { translate } from '@/api/translateApi.js';
import { useUI } from '../../../contexts/UIContext.jsx';
import { useRecentStudies } from './useRecentStudies.js';

const LIST_LIMIT = 6;
const RECENT_LIMIT = 3;

async function translateStudy(study, language) {
  if (language === 'ko') return study;

  const [nickname, name, description] = await Promise.all([
    study.nickname
      ? translate(study.nickname, language).catch(() => study.nickname)
      : '',
    study.name ? translate(study.name, language).catch(() => study.name) : '',
    study.description
      ? translate(study.description, language).catch(() => study.description)
      : '',
  ]);

  return {
    ...study,
    nickname,
    name,
    description,
  };
}

function normalizeStudies(studies) {
  const map = new Map();

  studies.forEach((study) => {
    if (!study?.id) return;
    map.set(study.id, study);
  });

  return Array.from(map.values());
}

export function useHomeStudies() {
  const { i18n } = useTranslation();
  const { state: uiState, dispatch: uiDispatch } = useUI();

  const { keyword, order } = uiState;

  const setKeyword = (value) => {
    uiDispatch({ type: 'SET_KEYWORD', payload: value });
  };

  const setOrder = (value) => {
    uiDispatch({ type: 'SET_ORDER', payload: value });
  };

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ['studies', { keyword, order, language: i18n.language }],
      initialPageParam: 1,
      queryFn: async ({ pageParam }) => {
        const data = await getStudies({
          page: pageParam,
          limit: LIST_LIMIT,
          keyword,
          order,
        });

        const items = await Promise.all(
          (data?.items ?? []).map((study) =>
            translateStudy(study, i18n.language)
          )
        );

        return {
          items,
          totalCount: data?.totalCount ?? 0,
          page: pageParam,
        };
      },
      getNextPageParam: (lastPage, allPages) => {
        const loadedCount = allPages.reduce(
          (sum, page) => sum + page.items.length,
          0
        );

        return loadedCount < lastPage.totalCount
          ? lastPage.page + 1
          : undefined;
      },
      staleTime: 1000 * 30,
    });

  const studies = useMemo(() => {
    const flatStudies = data?.pages.flatMap((page) => page.items) ?? [];
    return normalizeStudies(flatStudies);
  }, [data]);

  const {
    recentStudies,
    addRecentStudyItem,
    clearRecentStudyList,
    refreshRecentStudies,
  } = useRecentStudies(studies, RECENT_LIMIT);

  return {
    listLimit: LIST_LIMIT,
    recentLimit: RECENT_LIMIT,

    keyword,
    setKeyword,
    order,
    setOrder,

    isLoading,
    isFetchingNextPage,

    studies,
    recentStudies,

    hasMore: Boolean(hasNextPage),
    moreSee: fetchNextPage,

    addRecentStudyItem,
    clearRecentStudyList,
    refreshRecentStudies,
  };
}
