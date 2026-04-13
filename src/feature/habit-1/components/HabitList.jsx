import '../../../styles/reset.css';
import '../../../styles/habit.css';
import arrowRightIcon from '../../../shared/images/icons/ic_arrow_right.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatHabitTime } from '../../../utils/formatHabitTime';
import {
  getHabitList,
  createHabit,
  deleteHabit,
  toggleHabitCheck,
} from '../../../api/habitApi.js';
import { getStudyDetail } from '../../../api/studyApi.js';
import HabitItem from './HabitItem';
import HabitForm from './HabitForm';

function HabitList() {
  const navigate = useNavigate();
  const { id, habitId } = useParams();

  const numericStudyId = Number(id);
  const isValidStudyId = Number.isInteger(numericStudyId) && numericStudyId > 0;

  const [now, setNow] = useState(new Date());
  const [studyTitle, setStudyTitle] = useState('');
  const [habitList, setHabitList] = useState([]);
  const [draftHabitList, setDraftHabitList] = useState([]);
  const [draftInputs, setDraftInputs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedTime = formatHabitTime(now);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStudyDetail = async () => {
      if (!isValidStudyId) return;

      try {
        const data = await getStudyDetail(numericStudyId);
        setStudyTitle(data.title ?? '');
      } catch (error) {
        console.error('스터디 상세 조회 실패:', error);
        setStudyTitle('');
      }
    };

    fetchStudyDetail();
  }, [id, isValidStudyId, numericStudyId]);

  const fetchHabitList = async () => {
    if (!isValidStudyId) {
      setHabitList([]);
      setErrorMessage('유효한 스터디 정보가 없어요.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const data = await getHabitList(numericStudyId);

      if (Array.isArray(data?.items)) {
        setHabitList(data.items);
      } else if (Array.isArray(data)) {
        setHabitList(data);
      } else {
        setHabitList([]);
      }
    } catch (error) {
      console.error('습관 목록 조회 실패:', error);
      setHabitList([]);
      setErrorMessage('습관 목록을 불러오지 못했어요.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHabitList();
  }, [id]);

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

  const handleToggleHabit = async (habit) => {
    const nextCompleted = !habit.todayRecord?.completed;
    const today = new Date().toISOString().split('T')[0];

    try {
      await toggleHabitCheck(habit.id, today, nextCompleted);

      setHabitList((prevHabitList) =>
        prevHabitList.map((item) =>
          item.id === habit.id
            ? {
                ...item,
                todayRecord: {
                  ...item.todayRecord,
                  date: today,
                  completed: nextCompleted,
                },
              }
            : item
        )
      );
    } catch (error) {
      console.error('습관 체크 변경 실패:', error);
      alert('습관 체크 변경에 실패했어요.');
    }
  };

  const handleOpenModal = () => {
    setDraftHabitList(habitList);
    setDraftInputs([]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;

    setDraftHabitList([]);
    setDraftInputs([]);
    setIsModalOpen(false);
  };

  const handleDeleteDraftHabit = async (id) => {
    try {
      await deleteHabit(id);

      setDraftHabitList((prevDraftHabitList) =>
        prevDraftHabitList.filter((habit) => habit.id !== id)
      );

      setHabitList((prevHabitList) =>
        prevHabitList.filter((habit) => habit.id !== id)
      );
    } catch (error) {
      console.error('습관 삭제 실패:', error);
      alert('습관 삭제에 실패했어요.');
    }
  };

  const handleAddInputRow = () => {
    const newInput = {
      id: Date.now(),
      name: '',
    };

    setDraftInputs((prevDraftInputs) => [...prevDraftInputs, newInput]);
  };

  const handleChangeInputRow = (id, value) => {
    setDraftInputs((prevDraftInputs) =>
      prevDraftInputs.map((input) =>
        input.id === id ? { ...input, name: value } : input
      )
    );
  };

  const handleDeleteInputRow = (id) => {
    setDraftInputs((prevDraftInputs) =>
      prevDraftInputs.filter((input) => input.id !== id)
    );
  };

  const handleSubmitHabitList = async () => {
    const habitNames = draftInputs
      .map((input) => input.name.trim())
      .filter(Boolean);

    if (habitNames.length === 0) {
      setHabitList(draftHabitList);
      setDraftHabitList([]);
      setDraftInputs([]);
      setIsModalOpen(false);
      return;
    }

    if (!isValidStudyId) {
      alert('유효한 studyId가 없어요.');
      return;
    }

    try {
      setIsSubmitting(true);

      for (const name of habitNames) {
        await createHabit(numericStudyId, { name });
      }

      await fetchHabitList();

      setDraftHabitList([]);
      setDraftInputs([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('습관 생성 실패:', error);
      alert('습관 생성에 실패했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="habit-page">
      <main className="habit-home">
        <header className="habit-home__header">
          <div className="habit-home__top">
            <h1 className="habit-home__title">{studyTitle || '스터디'}</h1>

            <div className="habit-home__nav">
              <button
                type="button"
                className="habit-home__nav-btn"
                onClick={() => {
                  if (!isValidStudyId || habitList.length === 0) return;
                  navigate(`/studies/${numericStudyId}/focus`);
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
              onClick={handleOpenModal}
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
                  onToggle={handleToggleHabit}
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
        onClose={handleCloseModal}
        onDeleteDraftHabit={handleDeleteDraftHabit}
        onAddInputRow={handleAddInputRow}
        onChangeInputRow={handleChangeInputRow}
        onDeleteInputRow={handleDeleteInputRow}
        onSubmit={handleSubmitHabitList}
      />
    </section>
  );
}

export default HabitList;
