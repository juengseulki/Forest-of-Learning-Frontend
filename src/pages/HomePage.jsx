import '../styles/habit.css';
function HomePage() {
  return (
    <section>
      <h1>홈 페이지</h1>
      <p>여기에 홈 화면 내용이 들어갑니다.</p>

      <main class="habit">
        <div class="habit-header">
          <div class="habit-header-top">
            <span class="habit-header-top-text1">연우의 개발공장</span>
            <a href="" class="habit-header-top-text2">
              <span>오늘의 집중</span>
            </a>
            <a href="">
              <span>홈</span>
            </a>
          </div>
          <div class="habit-header-bottom">
            <span>현재 시간</span>
            <span>yyyy-mm-dd 오후 hh:mm</span>
          </div>
        </div>
        <div class="habbit-contents">
          <div class="habbit-contents-title">
            <span>오늘의 습관</span>
            <a href="">
              <span>목록 수정</span>
            </a>
          </div>
          <div class="habbit-contents-list">
            <p>미라클모닝 6시기상</p>
            <p>미라클모닝 6시기상</p>
            <p>미라클모닝 6시기상</p>
            <p>미라클모닝 6시기상</p>
            <p>미라클모닝 6시기상</p>
          </div>
        </div>
      </main>
    </section>
  );
}

export default HomePage;
