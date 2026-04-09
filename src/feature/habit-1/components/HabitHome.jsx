import '../../../styles/reset.css';
import '../../../styles/habit.css';
import arrowRightIcon from '../../../shared/images/icons/ic_arrow_right.svg';

function HabitHome() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const isPm = now.getHours() >= 12;
  const period = isPm ? '오후' : '오전';
  const hour = ((now.getHours() + 11) % 12) + 1;
  const minute = String(now.getMinutes()).padStart(2, '0');

  const formattedTime = `${year}-${month}-${date} ${period} ${hour}:${minute}`;

  const habits = [];

  return (
    <section className="habit-page">
      <main className="habit-home">
        <header className="habit-home__header">
          <div className="habit-home__left">
            <h1 className="habit-home__title">연우의 개발공장</h1>

            <div className="habit-home__time-wrap">
              <span className="habit-home__time-label">현재 시간</span>
              <span className="habit-home__time-badge">{formattedTime}</span>
            </div>
          </div>

          <div className="habit-home__nav">
            <button type="button" className="habit-home__nav-button">
              <span className="habit-home__nav-text">오늘의 집중</span>
              <img
                src={arrowRightIcon}
                alt=""
                className="habit-home__nav-icon"
              />
            </button>

            <button type="button" className="habit-home__nav-button small">
              <span className="habit-home__nav-text">홈</span>
              <img
                src={arrowRightIcon}
                alt=""
                className="habit-home__nav-icon"
              />
            </button>
          </div>
        </header>

        <section className="habit-card">
          <div className="habit-card__header">
            <div className="habit-card__header-left" />
            <h2 className="habit-card__title">오늘의 습관</h2>
            <button type="button" className="habit-card__edit">
              목록 수정
            </button>
          </div>

          <div className="habit-list">
            {habits.length === 0 ? (
              <div className="habit-empty">
                <p className="habit-empty__title">아직 습관이 없어요</p>
                <p className="habit-empty__desc">
                  목록 수정을 눌러 습관을 생성해보세요
                </p>
              </div>
            ) : (
              habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`habit-list__item ${habit.done ? 'is-done' : ''}`}
                >
                  {habit.text}
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </section>
  );
}

export default HabitHome;
