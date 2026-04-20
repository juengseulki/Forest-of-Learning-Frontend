import { useEffect, useState } from 'react';
import BaseStudyModal from './BaseStudyModal';
import { getPointLog } from '../../../../api/pointApi';
import pointIcon from '../../../../shared/images/icons/ic_point.png';

function StudyRecordModal({ isOpen, title, closeText, onClose }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [pointLogs, setPointLogs] = useState([]);

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil(pointLogs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPageLogs = pointLogs.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const formatDateString = (date) => {
    return date.toISOString().slice(0, 10);
  };

  const handlePrevDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(prevDate);
  };

  const handleNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(nextDate);
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDuration = (seconds) => {
    const hour = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const minute = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const second = String(seconds % 60).padStart(2, '0');

    return `${hour}시간 ${minute}분 ${second}초`;
  };

  useEffect(() => {
    const fetchPointLogs = async () => {
      try {
        const data = await getPointLog(18);
        const selected = formatDateString(selectedDate);
        const filteredData = data.filter((log) => {
          const logDate = new Date(log.createdAt);
          return formatDateString(logDate) === selected;
        });
        setPointLogs(filteredData);
        setCurrentPage(1);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPointLogs();
  }, [selectedDate]);

  return (
    <BaseStudyModal
      isOpen={isOpen}
      title={title}
      onClose={onClose}
      className="study-modal__content--confirm"
    >
      <div className="record-container">
        <div className="record-date-nav">
          <button type="button" onClick={handlePrevDate}>
            &lt;
          </button>

          <span>{formatDateString(selectedDate)}</span>

          <button type="button" onClick={handleNextDate}>
            &gt;
          </button>
        </div>
        <table className="record-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>집중 시간</th>
              <th>포인트</th>
              <th>시작 시간</th>
              <th>종료 시간</th>
            </tr>
          </thead>
          <tbody>
            {currentPageLogs.length > 0 ? (
              currentPageLogs.map((log, index) => (
                <tr key={log.id}>
                  <td>{startIndex + index + 1}</td>
                  <td>{formatDuration(log.focusSession.duration)}</td>
                  <td className="record-point">
                    <img src={pointIcon} alt="포인트 아이콘" />
                    <p>{log.amount}P</p>
                  </td>
                  <td>{formatTime(log.focusSession.startedAt)}</td>
                  <td>{formatTime(log.focusSession.completedAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">기록이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
        {currentPageLogs.length > 0 && (
          <div className="record-pagination">
            <button
              className="record-pagination__button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            <div className="record-pagination__pages">
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;

                return (
                  <button
                    key={page}
                    type="button"
                    className={`record-pagination__page ${
                      currentPage === page
                        ? 'record-pagination__page--active'
                        : ''
                    }`}
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              className="record-pagination__button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      <div className="study-modal__actions">
        <button
          type="button"
          className="study-modal__button study-modal__button--secondary"
          onClick={onClose}
        >
          {closeText}
        </button>
      </div>
    </BaseStudyModal>
  );
}

export default StudyRecordModal;
