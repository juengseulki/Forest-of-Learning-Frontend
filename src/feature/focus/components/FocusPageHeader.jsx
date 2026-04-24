import { useNavigate } from 'react-router-dom';
import FocusPageActions from './FocusPageActions.jsx';
import FocusPointSummary from './FocusPointSummary.jsx';

function FocusPageHeader({
  studyId,
  studyName,
  totalPoint,
  isLoading,
  isError,
  onOpenRecordModal,
}) {
  const navigate = useNavigate();

  return (
    <div className="focus-page__study-header">
      <h1
        className="focus-page__study-title home__titile"
        onClick={() => {
          if (!studyId) return;
          navigate(`/studies/${studyId}`);
        }}
      >
        {studyName}
      </h1>

      <FocusPageActions
        studyId={studyId}
        onOpenRecordModal={onOpenRecordModal}
      />

      <FocusPointSummary
        totalPoint={totalPoint}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}

export default FocusPageHeader;
