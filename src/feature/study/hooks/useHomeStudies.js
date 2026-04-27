import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery } from '@tanstack/react-query';

import { getStudies } from '@/api/studyApi.js';
import { translate } from '@/api/translateApi.js';
import { useUI } from '../../../contexts/UIContext.jsx';
import { useRecentStudies } from './useRecentStudies.js';

const LIST_LIMIT = 6;
const RECENT_LIMIT = 3;

const translationCache = new Map();
const pendingTranslations = new Map();

function normalizeText(text) {
  if (text == null) return '';
  return String(text).trim();
}

async function safeTranslate(text, language) {
  const originalText = normalizeText(text);

  if (!originalText) return '';
  if (language === 'ko') return originalText;

  const cacheKey = `${language}::${originalText}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  if (pendingTranslations.has(cacheKey)) {
    return pendingTranslations.get(cacheKey);
  }

  const request = translate(originalText, language)
    .then((result) => {
      const translated =
        typeof result === 'string'
          ? result
          : (result?.translatedText ?? result?.data?.translatedText);

      const finalText = normalizeText(translated) || originalText;

      translationCache.set(cacheKey, finalText);
      pendingTranslations.delete(cacheKey);

      return finalText;
    })
    .catch(() => {
      pendingTranslations.delete(cacheKey);
      return originalText;
    });

  pendingTranslations.set(cacheKey, request);

  return request;
}

async function translateStudy(study, language) {
  if (language === 'ko') return study;

  const [nickname, name, description] = await Promise.all([
    safeTranslate(study.nickname, language),
    safeTranslate(study.name, language),
    safeTranslate(study.description, language),
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
      staleTime: 1000 * 60 * 10,
      gcTime: 1000 * 60 * 30,
      retry: 1,
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
