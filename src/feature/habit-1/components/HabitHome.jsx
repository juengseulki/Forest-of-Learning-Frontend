import '../../../styles/reset.css';
import '../../../styles/habit.css';
import arrowRightIcon from '../../../shared/images/icons/ic_arrow_right.svg';
import trashIcon from '../../../images/icon/ic_trash.svg';
import { habitsMockResponse } from '../../../mocks/habit/habitMockData';
import { formatHabitTime } from '../../../utils/formatHabitTime';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function HabitHome() {
  // 처음 보여줄 데이터
  const { currentTime, items = [] } = habitsMockResponse.data;

  // 시간 포맷
  const formattedTime = formatHabitTime(currentTime);

  const navigate = useNavigate();

  // 실제 반영된 리스트
  const [habitList, setHabitList] = useState(items);

  // 모달용 임시 리스트
  const [draftHabitList, setDraftHabitList] = useState([]);

  // 새로 추가 중인 입력 row 목록
  const [draftInputs, setDraftInputs] = useState([]);

  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기
  const handleOpenModal = () => {
    setDraftHabitList(habitList);
    setDraftInputs([]);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setDraftHabitList([]);
    setDraftInputs([]);
    setIsModalOpen(false);
  };

  // 기존 항목 삭제
  const handleDeleteDraftHabit = (id) => {
    setDraftHabitList(draftHabitList.filter((habit) => habit.id !== id));
  };

  // 입력 row 추가
  const handleAddInputRow = () => {
    const newInput = {
      id: Date.now(),
      name: '',
    };

    setDraftInputs([...draftInputs, newInput]);
  };

  // 입력값 변경
  const handleChangeInputRow = (id, value) => {
    setDraftInputs(
      draftInputs.map((input) =>
        input.id === id ? { ...input, name: value } : input
      )
    );
  };

  // 입력 row 삭제
  const handleDeleteInputRow = (id) => {
    setDraftInputs(draftInputs.filter((input) => input.id !== id));
  };

  // 수정 완료
  const handleSubmitHabitList = async () => {
    try {
      const newHabits = draftInputs
        .map((input) => input.name.trim())
        .filter(Boolean)
        .map((name, index) => ({
          id: Date.now() + index,
          name,
          todayRecord: {
            completed: false,
          },
        }));

      const nextHabitList = [...draftHabitList, ...newHabits];

      // 나중에 여기서 API 호출
      // await updateHabitList(nextHabitList);

      // 지금은 목데이터라 실제 리스트에 반영만 함
      setHabitList(nextHabitList);

      setDraftHabitList([]);
      setDraftInputs([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('습관 목록 저장 실패:', error);
    }
  };

  return (
    <section className="habit-page">
      <main className="habit-home">
        <header className="habit-home__header">
          {/* 타이틀 + 네비 */}
          <div className="habit-home__top">
            <h1 className="habit-home__title">연우의 개발공장</h1>

            <div className="habit-home__nav">
              <button
                type="button"
                className="habit-home__nav-btn"
                onClick={() => navigate('/focus')}
              >
                <span className="habit-home__nav-text">오늘의 집중</span>
                <img
                  src={arrowRightIcon}
                  alt="화살표이미지"
                  className="habit-home__nav-icon"
                />
              </button>

              <button
                type="button"
                className="habit-home__nav-btn habit-home__nav-btn--small"
                onClick={() => navigate('/')}
              >
                <span className="habit-home__nav-text">홈</span>
                <img
                  src={arrowRightIcon}
                  alt="화살표이미지"
                  className="habit-home__nav-icon"
                />
              </button>
            </div>
          </div>

          {/* 현재 시간 */}
          <div className="habit-home__time">
            <span className="habit-home__time-label">현재 시간</span>
            <span className="habit-home__time-value">{formattedTime}</span>
          </div>
        </header>

        <section className="habit-card">
          <div className="habit-card__header">
            <div className="habit-card__header-left" />
            <h2 className="habit-card__title">오늘의 습관</h2>
            <button
              type="button"
              className="habit-card__edit"
              onClick={handleOpenModal}
            >
              목록 수정
            </button>
          </div>

          <div className="habit-list">
            {habitList.length === 0 ? (
              <div className="habit-empty">
                <p className="habit-empty__title">아직 습관이 없어요</p>
                <p className="habit-empty__desc">
                  목록 수정을 눌러 습관을 생성해보세요
                </p>
              </div>
            ) : (
              habitList.map((habit) => (
                <div
                  key={habit.id}
                  className={`habit-item ${
                    habit.todayRecord?.completed ? 'habit-item--done' : ''
                  }`}
                >
                  {habit.name}
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div className="habit-modal" onClick={handleCloseModal}>
          <div
            className="habit-modal__content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="habit-modal__title">습관 목록</h3>

            <div className="habit-form__list">
              {draftHabitList.map((habit) => (
                <div key={habit.id} className="habit-form__row">
                  <div className="habit-form__item">
                    <span className="habit-form__item-name">{habit.name}</span>
                  </div>

                  <button
                    type="button"
                    className="habit-form__action-btn habit-form__action-btn--delete"
                    onClick={() => handleDeleteDraftHabit(habit.id)}
                  >
                    <img src={trashIcon} alt="삭제" />
                  </button>
                </div>
              ))}

              {draftInputs.map((input) => (
                <div key={input.id} className="habit-form__row">
                  <div className="habit-form__item habit-form__item--input">
                    <input
                      type="text"
                      className="habit-form__input"
                      placeholder="새로운 습관"
                      value={input.name}
                      onChange={(e) =>
                        handleChangeInputRow(input.id, e.target.value)
                      }
                    />
                  </div>

                  <button
                    type="button"
                    className="habit-form__action-btn habit-form__action-btn--delete"
                    onClick={() => handleDeleteInputRow(input.id)}
                  >
                    <img src={trashIcon} alt="입력 삭제" />
                  </button>
                </div>
              ))}

              {draftHabitList.length === 0 && draftInputs.length === 0 && (
                <div className="habit-empty habit-empty--modal">
                  <p className="habit-empty__title">등록된 습관이 없어요</p>
                  <p className="habit-empty__desc">
                    플러스를 눌러 추가해보세요
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              className="habit-form__add-btn"
              onClick={handleAddInputRow}
            >
              +
            </button>

            <div className="habit-modal__footer">
              <button
                type="button"
                className="habit-modal__cancel"
                onClick={handleCloseModal}
              >
                취소
              </button>

              <button
                type="button"
                className="habit-modal__submit"
                onClick={handleSubmitHabitList}
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HabitHome;
