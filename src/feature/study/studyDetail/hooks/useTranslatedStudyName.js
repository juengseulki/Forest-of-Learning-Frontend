import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { translate } from '@/api/translateApi.js';

export function useTranslatedStudyName(studyName) {
  const { i18n } = useTranslation();

  const { data = '' } = useQuery({
    queryKey: ['translatedStudyName', studyName, i18n.language],
    queryFn: () => translate(studyName, i18n.language),
    enabled: Boolean(studyName) && i18n.language !== 'ko',
    staleTime: 1000 * 60 * 60,
  });

  if (i18n.language === 'ko') return studyName;

  return data || studyName;
}
