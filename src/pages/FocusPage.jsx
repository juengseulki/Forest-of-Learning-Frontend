import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getPoint, getStudyById } from '../api/focusApi.js';
import { translate } from '../api/translateApi.js';
import FocusTimerCard from '../feature/focus/components/FocusTimerCard.jsx';
import handleApiError from '../utils/handleApiError.jsx';

import pointIcon from '../shared/images/icons/ic_point.png';
import arrowRightIcon from '../shared/images/icons/ic_arrow_right.svg';
import '../styles/global.css';
import '../styles/FocusPage.css';
import StudyRecordModal from '../../src/feature/study/shared/modal/StudyRecordModal.jsx';
import { useStudyDetail } from '../feature/study/studyDetail/hooks/useStudyDetail.jsx';

function FocusPage() {
  const { studyId } = useParams();
  const currentStudyId = Number(studyId) || 1;
  const { t, i18n } = useTranslation();

  const [pointData, setPointData] = useState(null);
  const [studyData, setStudyData] = useState(null);
  const [translatedStudyName, setTranslatedStudyName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFocusPageData() {
      try {
        setIsLoading(true);
        setError('');

        const [pointResponse, studyResponse] = await Promise.all([
          getPoint(currentStudyId),
          getStudyById(currentStudyId),
        ]);

        setPointData(pointResponse.data);
        setStudyData(studyResponse.data);
      } catch (err) {
        handleApiError(err, t('loadFail'));
        setError(t('loadFail'));
      } finally {
        setIsLoading(false);
      }
    }

    fetchFocusPageData();
  }, [currentStudyId, t]);

  useEffect(() => {
    async function translateStudyName() {
      if (!studyData?.name) return;

      if (i18n.language === 'ko') {
        setTranslatedStudyName('');
        return;
      }

      try {
        const result = await translate(studyData.name, i18n.language);
        setTranslatedStudyName(result);
      } catch (error) {
        console.error('포커스 페이지 스터디 이름 번역 실패:', error);
        setTranslatedStudyName('');
      }
    }

    translateStudyName();
  }, [i18n.language, studyData?.name]);

  const refreshPoint = useCallback(async () => {
    try {
      const pointResponse = await getPoint(currentStudyId);
      setPointData(pointResponse.data);
    } catch (err) {
      handleApiError(err, t('loadFail'));
    }
  }, [currentStudyId, t]);

  const handleSessionComplete = useCallback(
    (result) => {
      if (result && result.totalPoint !== undefined) {
        setPointData({
          totalPoint: result.totalPoint,
        });
      } else {
        refreshPoint();
      }
    },
    [refreshPoint]
  );

  const { isRecordModalOpen, handleCloseRecordModal, handleOpenRecordModal } =
    useStudyDetail(studyId);

  return (
    <section className="focus-page">
      <div className="focus-page__content">
        <div className="focus-page__panel common-panel-lg">
          <div className="focus-page__study-header">
            <h1 className="focus-page__study-title">
              {translatedStudyName || studyData?.name || t('studyDefault')}
            </h1>

            <div className="focus-page__actions">
              <button
                className="focus-page__action-btn common-action-btn"
                onClick={handleOpenRecordModal}
              >
                <span>{t('viewPointLog')}</span>
              </button>
              <Link
                to={`/studies/${currentStudyId}/habit`}
                className="focus-page__action-btn common-action-btn"
              >
                <span>{t('todayHabit')}</span>
                <img
                  src={arrowRightIcon}
                  alt={t('arrowRight')}
                  className="common-action-icon"
                />
              </Link>

              <Link to="/" className="focus-page__action-btn common-action-btn">
                <span>{t('home')}</span>
                <img
                  src={arrowRightIcon}
                  alt={t('arrowRight')}
                  className="focus-page__action-icon"
                />
              </Link>
            </div>

            <div className="focus-page__point-group">
              <p className="focus-page__study-desc">{t('earnedPoint')}</p>
              <div className="common-point-box">
                <img
                  src={pointIcon}
                  alt={t('pointIconAlt')}
                  className="focus-page__point-icon"
                />
                <span className="focus-page__point-text">
                  {isLoading
                    ? '...'
                    : error
                      ? '-'
                      : `${pointData?.totalPoint ?? 0}P ${t('earned')}`}
                </span>
              </div>
            </div>
          </div>

          <FocusTimerCard
            studyId={currentStudyId}
            onSessionComplete={handleSessionComplete}
          />
          <StudyRecordModal
            isOpen={isRecordModalOpen}
            title="포인트 기록"
            closeText="닫기"
            onClose={handleCloseRecordModal}
            studyId={currentStudyId}
          />
        </div>
      </div>
    </section>
  );
}

export default FocusPage;
