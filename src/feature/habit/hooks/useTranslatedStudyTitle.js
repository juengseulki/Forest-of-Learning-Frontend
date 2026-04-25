import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { translate } from '@/api/translateApi.js';

function normalizeText(text) {
  return text?.trim() ?? '';
}

export function useTranslatedStudyTitle(studyTitle) {
  const { i18n } = useTranslation();

  const normalizedTitle = normalizeText(studyTitle);
  const shouldTranslate = Boolean(normalizedTitle) && i18n.language !== 'ko';

  const { data = '' } = useQuery({
    queryKey: ['translatedStudyTitle', normalizedTitle, i18n.language],
    queryFn: () => translate(normalizedTitle, i18n.language),
    enabled: shouldTranslate,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });

  if (!shouldTranslate) {
    return studyTitle;
  }

  return data || studyTitle;
}
