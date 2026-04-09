import '../../../styles/reset.css';
import '../../../styles/habit.css';
import arrowRightIcon from '../../../shared/images/icons/ic_arrow_right.svg';
import trashIcon from '../../../images/icon/ic_trash.svg';
import { habitsMockResponse } from '../../../mocks/habit/habitMockData';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function HabitHome() {
  const navigate = useNavigate();

  // 목데이터
  const { currentTime, items = [] } = habitsMockResponse.data;

  // 현재 시간 포맷
  const formatHabitTime = (time) => {
    if (!time) return '';

    const now = new Date(time);

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const isPm = now.getHours() >= 12;
    const period = isPm ? '오후' : '오전';
    const hour = ((now.getHours() + 11) % 12) + 1;
    const minute = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${date} ${period} ${hour}:${minute}`;
  };

  const formattedTime = formatHabitTime(currentTime);

  // 실제 반영되는 리스트
  const [habitList, setHabitList] = useState(items);

  // 모달에서만 쓰는 임시 리스트
  const [draftHabitList, setDraftHabitList] = useState([]);

  // 새로 추가하는 입력 row
  const [draftInputs, setDraftInputs] = useState([]);

  // 모달 열림 여부
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 오늘의 습관 클릭 시 완료 상태 토글
  const handleToggleHabit = (id) => {
    setHabitList((prevHabitList) =>
      prevHabitList.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              todayRecord: {
                ...habit.todayRecord,
                completed: !habit.todayRecord?.completed,
              },
            }
          : habit
      )
    );
  };

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

  // 기존 리스트 삭제
  const handleDeleteDraftHabit = (id) => {
    setDraftHabitList((prevDraftHabitList) =>
      prevDraftHabitList.filter((habit) => habit.id !== id)
    );
  };

  // 입력 row 추가
  const handleAddInputRow = () => {
    const newInput = {
      id: Date.now(),
      name: '',
    };

    setDraftInputs((prevDraftInputs) => [...prevDraftInputs, newInput]);
  };

  // 입력 row 값 변경
  const handleChangeInputRow = (id, value) => {
    setDraftInputs((prevDraftInputs) =>
      prevDraftInputs.map((input) =>
        input.id === id ? { ...input, name: value } : input
      )
    );
  };

  // 입력 row 삭제
  const handleDeleteInputRow = (id) => {
    setDraftInputs((prevDraftInputs) =>
      prevDraftInputs.filter((input) => input.id !== id)
    );
  };

  // 수정 완료
  const handleSubmitHabitList = () => {
    const now = new Date().toISOString();

    const newHabits = draftInputs
      .map((input) => input.name.trim())
      .filter(Boolean)
      .map((name, index) => ({
        id: Date.now() + index,
        name,
        isEnded: false,
        createdAt: now,
        updatedAt: now,
        todayRecord: {
          date: currentTime,
          completed: false,
        },
      }));

    const nextHabitList = [...draftHabitList, ...newHabits];

    setHabitList(nextHabitList);
    setDraftHabitList([]);
    setDraftInputs([]);
    setIsModalOpen(false);
  };

  return (
    <section className="habit-page">
      <main className="habit-home">
        <header className="habit-home__header">
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
                <button
                  key={habit.id}
                  type="button"
                  className={`habit-item ${
                    habit.todayRecord?.completed ? 'habit-item--done' : ''
                  }`}
                  onClick={() => handleToggleHabit(habit.id)}
                >
                  {habit.name}
                </button>
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
                      placeholder="__________________"
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
