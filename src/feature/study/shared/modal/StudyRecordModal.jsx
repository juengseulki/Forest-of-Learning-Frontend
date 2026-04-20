import { useState } from 'react';
import BaseStudyModal from './BaseStudyModal';

function StudyRecordModal({
  isOpen,
  title = '포인트 기록',
  // description = '포인트 변동 내역을 확인할 수 있습니다.',
  closeText = '닫기',
  onClose,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (date) => {
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

  return (
    <BaseStudyModal
      isOpen={isOpen}
      title={title}
      // description={description}
      onClose={onClose}
      className="study-modal__content--confirm"
    >
      <div className="record-date-nav">
        <button type="button" onClick={handlePrevDate}>
          &lt;
        </button>

        <span>{formatDate(selectedDate)}</span>

        <button type="button" onClick={handleNextDate}>
          &gt;
        </button>
      </div>
      <table className="record-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>집중 시간</th>
            <th>획득 포인트</th>
            <th>시작 시간</th>
            <th>종료 시간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>00시간 26분</td>
            <td>6point</td>
            <td>05:02:53</td>
            <td>05:03:12</td>
          </tr>
          <tr>
            <td>1</td>
            <td>00시간 26분</td>
            <td>6point</td>
            <td>05:02:53</td>
            <td>05:03:12</td>
          </tr>
          <tr>
            <td>1</td>
            <td>00시간 26분</td>
            <td>6point</td>
            <td>05:02:53</td>
            <td>05:03:12</td>
          </tr>
          <tr>
            <td>1</td>
            <td>00시간 26분</td>
            <td>6point</td>
            <td>05:02:53</td>
            <td>05:03:12</td>
          </tr>
          <tr>
            <td>1</td>
            <td>00시간 26분</td>
            <td>6point</td>
            <td>05:02:53</td>
            <td>05:03:12</td>
          </tr>
        </tbody>
      </table>
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
                  currentPage === page ? 'record-pagination__page--active' : ''
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
