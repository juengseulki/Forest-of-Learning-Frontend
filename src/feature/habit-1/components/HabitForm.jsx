import React from 'react';

const HabitForm = () => {
  return (
    <>
      <nav class="nav">공부의숲</nav>
      <main>
        <div class="habit-header">
          <div class="habit-header-top">
            <span>연우의 개발공장</span>
            <a href="">
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
    </>
  );
};

export default HabitForm;
