import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { translate } from '@/api/translateApi.js';

export function useTranslatedStudyTitle(studyTitle) {
  const { i18n } = useTranslation();

  const { data = '' } = useQuery({
    queryKey: ['translatedStudyTitle', studyTitle, i18n.language],
    queryFn: () => translate(studyTitle, i18n.language),
    enabled: Boolean(studyTitle) && i18n.language !== 'ko',
    staleTime: 1000 * 60 * 60,
  });

  if (i18n.language === 'ko') {
    return studyTitle;
  }

  return data || studyTitle;
}
