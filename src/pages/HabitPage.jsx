import '../styles/reset.css';
import '../styles/habit.css';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import arrowRightIcon from '../shared/images/icons/ic_arrow_right.svg';

import HabitItem from '../feature/habit/components/HabitItem';
import HabitForm from '../feature/habit/components/HabitForm';

import { useCurrentTime } from '../feature/habit/hooks/useCurrentTime';
import { useStudyTitle } from '../feature/habit/hooks/useStudyTitle';
import { useHabitList } from '../feature/habit/hooks/useHabitList';
import { useHabitForm } from '../feature/habit/hooks/useHabitForm';

import { formatHabitTime } from '../feature/habit/utils/formatHabitTime';
import { toStudyId } from '../feature/habit/utils/habitUtils';

function HabitPage() {
  const navigate = useNavigate();
  const { id, habitId } = useParams();

  const studyId = toStudyId(id);

  const now = useCurrentTime();
  const formattedTime = formatHabitTime(now);

  const studyTitle = useStudyTitle(studyId);

  const {
    habitList,
    isLoading,
    errorMessage,
    fetchHabitList,
    toggleHabit,
    removeHabitLocally,
  } = useHabitList(studyId);

  const {
    draftHabitList,
    draftInputs,
    isModalOpen,
    isSubmitting,
    openModal,
    closeModal,
    addInputRow,
    changeInputRow,
    deleteInputRow,
    deleteDraftHabit,
    submitHabitList,
  } = useHabitForm({
    studyId,
    habitList,
    onAfterCreate: fetchHabitList,
    onAfterDelete: removeHabitLocally,
  });

  useEffect(() => {
    if (!habitId || habitList.length === 0) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(`habit-${habitId}`);
      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [habitId, habitList]);

  return (
    <section className="habit-page">
      <main className="habit-home">
        <header className="habit-home__header">
          <div className="habit-home__top">
            <h1
              className="habit-home__title"
              onClick={() => {
                if (!studyId || habitList.length === 0) return;
                navigate(`/studies/${studyId}`);
              }}
            >
              {studyTitle || '스터디'}
            </h1>

            <div className="habit-home__nav">
              <button
                type="button"
                className="habit-home__nav-btn"
                onClick={() => {
                  if (!studyId || habitList.length === 0) return;
                  navigate(`/studies/${studyId}/focus`);
                }}
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
              onClick={openModal}
            >
              목록 수정
            </button>
          </div>

          <div className="habit-list">
            {isLoading && habitList.length === 0 ? (
              <div className="habit-empty">
                <p className="habit-empty__title">불러오는 중...</p>
              </div>
            ) : errorMessage ? (
              <div className="habit-empty">
                <p className="habit-empty__title">{errorMessage}</p>
              </div>
            ) : habitList.length === 0 ? (
              <div className="habit-empty">
                <p className="habit-empty__title">아직 습관이 없어요</p>
                <p className="habit-empty__desc">
                  목록 수정을 눌러 습관을 생성해보세요
                </p>
              </div>
            ) : (
              habitList.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onToggle={toggleHabit}
                />
              ))
            )}
          </div>
        </section>
      </main>

      <HabitForm
        isOpen={isModalOpen}
        draftHabitList={draftHabitList}
        draftInputs={draftInputs}
        isSubmitting={isSubmitting}
        onClose={closeModal}
        onDeleteDraftHabit={deleteDraftHabit}
        onAddInputRow={addInputRow}
        onChangeInputRow={changeInputRow}
        onDeleteInputRow={deleteInputRow}
        onSubmit={submitHabitList}
      />
    </section>
  );
}

export default HabitPage;
