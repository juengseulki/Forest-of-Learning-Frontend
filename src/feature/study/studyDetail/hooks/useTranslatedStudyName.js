import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { translate } from '@/api/translateApi.js';

function normalizeText(text) {
  return text?.trim() ?? '';
}

export function useTranslatedStudyName(studyName) {
  const { i18n } = useTranslation();

  const normalizedName = normalizeText(studyName);
  const shouldTranslate = Boolean(normalizedName) && i18n.language !== 'ko';

  const { data = '' } = useQuery({
    queryKey: ['translatedStudyName', normalizedName, i18n.language],
    queryFn: () => translate(normalizedName, i18n.language),
    enabled: shouldTranslate,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,
    retry: 1,
  });

  if (!shouldTranslate) {
    return studyName;
  }

  return data || studyName;
}
