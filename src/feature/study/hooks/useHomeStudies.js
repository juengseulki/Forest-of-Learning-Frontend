import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getStudies } from '../../../api/studyApi.js';
import { getPoint } from '../../../api/pointApi.js';
import { getEmojiReactions } from '../../../api/emojiApi.js';
import { translate } from '../../../api/translateApi.js';

import { useRecentStudies } from './useRecentStudies.js';
import { useStudy } from '../../../contexts/StudyContext.jsx';
import { useUI } from '../../../contexts/UIContext.jsx';
import {
  getFilteredStudies,
  getVisibleCount,
  getHasMore,
} from '../utils/homeStudyUtils.js';

export function useHomeStudies() {
  const { i18n } = useTranslation();
  const { state: studyState, dispatch: studyDispatch } = useStudy();
  const { state: uiState, dispatch: uiDispatch } = useUI();

  const { studies, isLoading } = studyState;
  const { keyword, order, listPage } = uiState;

  const listLimit = 6;
  const recentLimit = 3;

  const setKeyword = (value) => {
    uiDispatch({ type: 'SET_KEYWORD', payload: value });
    uiDispatch({ type: 'RESET_PAGE' });
  };

  const setOrder = (value) => {
    uiDispatch({ type: 'SET_ORDER', payload: value });
    uiDispatch({ type: 'RESET_PAGE' });
  };

  const moreSee = () => {
    uiDispatch({ type: 'INCREMENT_PAGE' });
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        studyDispatch({ type: 'SET_LOADING', payload: true });

        const data = await getStudies({
          page: listPage,
          limit: listLimit,
          keyword,
          order,
        });

        const studiesWithExtra = await Promise.all(
          (data?.items ?? []).map(async (study) => {
            const [
              pointData,
              emojiData,
              translatedNickname,
              translatedName,
              translatedDescription,
            ] = await Promise.all([
              getPoint(study.id).catch(() => ({ totalPoint: 0 })),
              getEmojiReactions(study.id).catch(() => ({ items: [] })),
              i18n.language === 'ko'
                ? Promise.resolve(study.nickname ?? '')
                : translate(study.nickname ?? '', i18n.language).catch(
                    () => study.nickname ?? ''
                  ),
              i18n.language === 'ko'
                ? Promise.resolve(study.name ?? '')
                : translate(study.name ?? '', i18n.language).catch(
                    () => study.name ?? ''
                  ),
              i18n.language === 'ko'
                ? Promise.resolve(study.description ?? '')
                : translate(study.description ?? '', i18n.language).catch(
                    () => study.description ?? ''
                  ),
            ]);

            return {
              ...study,
              nickname: translatedNickname,
              name: translatedName,
              description: translatedDescription,
              point: pointData?.totalPoint ?? 0,
              emojis: emojiData?.items ?? [],
            };
          })
        );

        if (isMounted) {
          const nextStudies =
            listPage === 1
              ? studiesWithExtra
              : [
                  ...studies,
                  ...studiesWithExtra.filter(
                    (newStudy) =>
                      !studies.some((existing) => existing.id === newStudy.id)
                  ),
                ];

          studyDispatch({
            type: 'SET_STUDIES',
            payload: nextStudies,
          });
        }
      } catch (error) {
        console.error('홈 스터디 목록 조회 실패:', error);

        if (isMounted && listPage === 1) {
          studyDispatch({
            type: 'SET_STUDIES',
            payload: [],
          });
        }
      } finally {
        if (isMounted) {
          studyDispatch({
            type: 'SET_LOADING',
            payload: false,
          });
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [studyDispatch, i18n.language, listPage, keyword, order]);

  const filteredStudies = useMemo(() => {
    return getFilteredStudies(studies, keyword, order);
  }, [studies, keyword, order]);

  const visibleCount = useMemo(() => {
    return getVisibleCount(listPage, listLimit);
  }, [listPage]);

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
