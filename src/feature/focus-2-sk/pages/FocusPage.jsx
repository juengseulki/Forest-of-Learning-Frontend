import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFocus, getPoint, getStudyById } from '../../../api/focus/focusApi';
import FocusTimerCard from '../components/FocusTimerCard.jsx';
import pointIcon from '../../../shared/images/icons/ic_point.png';
import arrowRightIcon from '../../../images/icon/ic_arrow_right.svg';
import './FocusPage.css';

function FocusPage() {
  const { studyId } = useParams();
  const currentStudyId = Number(studyId) || 1;

  const [focusData, setFocusData] = useState(null);
  const [pointData, setPointData] = useState(null);
  const [studyData, setStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFocusPageData() {
      try {
        setIsLoading(true);
        setError('');

        const [focusResponse, pointResponse, studyResponse] = await Promise.all(
          [
            getFocus(currentStudyId),
            getPoint(currentStudyId),
            getStudyById(currentStudyId),
          ]
        );

        setFocusData(focusResponse.data);
        setPointData(pointResponse.data);
        setStudyData(studyResponse.data);
      } catch (err) {
        console.error('포커스 데이터를 불러오지 못했습니다.', err);
        setError('데이터를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchFocusPageData();
  }, [currentStudyId]);

  if (isLoading) {
    return <div className="focus-page__status">로딩 중...</div>;
  }

  if (error) {
    return <div className="focus-page__status">{error}</div>;
  }

  if (!focusData || !pointData) {
    return (
      <div className="focus-page__status">데이터를 불러오지 못했습니다.</div>
    );
  }

  return (
    <section className="focus-page">
      <div className="focus-page__content">
        <div className="focus-page__panel">
          <div className="focus-page__study-header">
            <h1 className="focus-page__study-title">
              {studyData?.name || '스터디명'}
            </h1>

            <div className="focus-page__actions">
              <Link to="/habit" className="focus-page__action-btn">
                <span>오늘의 습관</span>
                <img
                  src={arrowRightIcon}
                  alt=""
                  className="focus-page__action-icon"
                />
              </Link>

              <Link to="/" className="focus-page__action-btn">
                <span>홈</span>
                <img
                  src={arrowRightIcon}
                  alt=""
                  className="focus-page__action-icon"
                />
              </Link>
            </div>

            <div className="focus-page__point-group">
              <p className="focus-page__study-desc">현재까지 획득한 포인트</p>

              <div className="focus-page__point-box">
                <img
                  src={pointIcon}
                  alt=""
                  className="focus-page__point-icon"
                />
                <span className="focus-page__point-text">
                  {pointData.totalPoint}P 획득
                </span>
              </div>
            </div>
          </div>

          <FocusTimerCard latestSession={focusData.latestSession} />
        </div>
      </div>
    </section>
  );
}

export default FocusPage;
