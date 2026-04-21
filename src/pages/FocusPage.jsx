import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getPoint, getStudyById } from '../api/focus/focusApi';
import FocusTimerCard from '../feature/focus/components/FocusTimerCard';
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

  const [pointData, setPointData] = useState(null);
  const [studyData, setStudyData] = useState(null);
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
        handleApiError(err, '데이터를 불러오지 못했습니다.');
        setError('데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFocusPageData();
  }, [currentStudyId]);

  const refreshPoint = useCallback(async () => {
    try {
      const pointResponse = await getPoint(currentStudyId);
      setPointData(pointResponse.data);
    } catch (err) {
      handleApiError(err, '포인트를 갱신하지 못했습니다.');
    }
  }, [currentStudyId]);

  // 세션 완료 후 포인트 즉시 업데이트
  const handleSessionComplete = useCallback(
    (result) => {
      // result: { focusSession, totalPoint } 또는 { totalPoint }
      if (result && result.totalPoint !== undefined) {
        setPointData({
          totalPoint: result.totalPoint,
        });
      } else {
        // 응답 형식이 다를 경우 서버에서 최신 포인트 조회
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
              {studyData?.name || '스터디명'}
            </h1>

            <div className="focus-page__actions">
              <button
                className="focus-page__action-btn common-action-btn"
                onClick={handleOpenRecordModal}
              >
                <span>포인트 기록</span>
              </button>
              <Link
                to={`/studies/${currentStudyId}/habit`}
                className="focus-page__action-btn common-action-btn"
              >
                <span>오늘의 습관</span>
                <img
                  src={arrowRightIcon}
                  alt="오른쪽 화살표"
                  className="common-action-icon"
                />
              </Link>

              <Link to="/" className="focus-page__action-btn common-action-btn">
                <span>홈</span>
                <img
                  src={arrowRightIcon}
                  alt="오른쪽 화살표"
                  className="focus-page__action-icon"
                />
              </Link>
            </div>

            <div className="focus-page__point-group">
              <p className="focus-page__study-desc">현재까지 획득한 포인트</p>
              <div className="common-point-box">
                <img
                  src={pointIcon}
                  alt="포인트 아이콘"
                  className="focus-page__point-icon"
                />
                <span className="focus-page__point-text">
                  {isLoading
                    ? '...'
                    : error
                      ? '-'
                      : `${pointData?.totalPoint ?? 0}P 획득`}
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
          />
        </div>
      </div>
    </section>
  );
}

export default FocusPage;
