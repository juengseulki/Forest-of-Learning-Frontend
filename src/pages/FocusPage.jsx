import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import { getPoint } from '../api/pointApi.js';
import { getStudy } from '../api/studyApi.js';
import { translate } from '../api/translateApi.js';

import FocusPageHeader from '../feature/focus/components/FocusPageHeader.jsx';
import FocusTimerCard from '../feature/focus/components/FocusTimerCard.jsx';
import StudyRecordModal from '../feature/study/shared/modal/StudyRecordModal.jsx';
import { useStudyDetail } from '../feature/study/studyDetail/hooks/useStudyDetail.jsx';

import '../styles/global.css';
import '../styles/FocusPage.css';

function FocusPage() {
  const { studyId } = useParams();
  const currentStudyId = Number(studyId);
  const { t, i18n } = useTranslation();

  const {
    data: studyData,
    isLoading: isStudyLoading,
    isError: isStudyError,
  } = useQuery({
    queryKey: ['study', currentStudyId],
    queryFn: () => getStudy(currentStudyId),
    enabled: Boolean(currentStudyId),
  });

  const { data: pointData, isLoading: isPointLoading } = useQuery({
    queryKey: ['point', currentStudyId],
    queryFn: () => getPoint(currentStudyId),
    enabled: Boolean(currentStudyId),
    initialData: { totalPoint: 0 },
  });

  const { data: translatedStudyName = '' } = useQuery({
    queryKey: ['translate', studyData?.name, i18n.language],
    queryFn: () => translate(studyData.name, i18n.language),
    enabled: Boolean(studyData?.name) && i18n.language !== 'ko',
    staleTime: 1000 * 60 * 60,
  });

  const displayStudyName = useMemo(() => {
    if (i18n.language === 'ko') {
      return studyData?.name || t('studyDefault');
    }

    return translatedStudyName || studyData?.name || t('studyDefault');
  }, [i18n.language, studyData?.name, translatedStudyName, t]);

  const isLoading = isStudyLoading || isPointLoading;

  const { isRecordModalOpen, handleCloseRecordModal, handleOpenRecordModal } =
    useStudyDetail(studyId);

  return (
    <section className="focus-page">
      <div className="focus-page__content">
        <div className="focus-page__panel common-panel-lg">
          <FocusPageHeader
            studyId={currentStudyId}
            studyName={displayStudyName}
            totalPoint={pointData?.totalPoint ?? 0}
            isLoading={isLoading}
            isError={isStudyError}
            onOpenRecordModal={handleOpenRecordModal}
          />

          <FocusTimerCard studyId={currentStudyId} />

          <StudyRecordModal
            isOpen={isRecordModalOpen}
            title={t('pointRecord')}
            closeText={t('close')}
            onClose={handleCloseRecordModal}
            studyId={currentStudyId}
          />
        </div>
      </div>
    </section>
  );
}

export default FocusPage;
