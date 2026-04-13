import React, { useEffect, useState } from 'react';
import { habitRecordMockResponse } from '../../../mocks/habit/habitMockData';
import blackPow from '../../../images/icon/ic_pow.svg';
import emptyPow from '../../../../src/images/habit/sticker_empty.png';
import pow01 from '../../../../src/images/habit/sticker_light_green_100_01.png';
import pow07 from '../../../../src/images/habit/sticker_blue_100_07.png';
import pow08 from '../../../../src/images/habit/sticker_blue_200_08.png';
import pow09 from '../../../../src/images/habit/sticker_blue_300_09.png';
import pow06 from '../../../../src/images/habit/sticker_green_06.png';
import pow02 from '../../../../src/images/habit/sticker_light_green_100_02.png';
import pow03 from '../../../../src/images/habit/sticker_light_green_100_03.png';
import pow04 from '../../../../src/images/habit/sticker_light_mint_100_04.png';
import pow05 from '../../../../src/images/habit/sticker_light_mint_200_05.png';
import pow16 from '../../../../src/images/habit/sticker_pink_100_16.png';
import pow17 from '../../../../src/images/habit/sticker_pink_200_17.png';
import pow18 from '../../../../src/images/habit/sticker_pink_300_18.png';
import pow10 from '../../../../src/images/habit/sticker_purple_100_10.png';
import pow11 from '../../../../src/images/habit/sticker_purple_200_11.png';
import pow12 from '../../../../src/images/habit/sticker_purple_300_12.png';
import pow13 from '../../../../src/images/habit/sticker_yellow_100_13.png';
import pow014 from '../../../../src/images/habit/sticker_yellow_200_14.png';
import pow015 from '../../../../src/images/habit/sticker_yellow_300_15.png';

function HabitRecord({ studyId }) {
  const [habits, setHabits] = useState([]);
  const [weekStart, setWeekStart] = useState('');

  const completedPow = [
    pow01,
    pow02,
    pow03,
    pow04,
    pow05,
    pow06,
    pow07,
    pow08,
    pow09,
    pow10,
    pow11,
    pow12,
    pow13,
    pow014,
    pow015,
    pow16,
    pow17,
    pow18,
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setHabits(habitRecordMockResponse.data.records);
      setWeekStart(habitRecordMockResponse.data.weekStart);
    }, 0);
    return () => clearTimeout(timer);
  }, [studyId]);
  //일주일 날짜 배열
  const weekDays = weekStart
    ? Array.from({ length: 7 }, (_, i) => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0];
      })
    : [];

  return (
    <section className="detail-habit-section">
      <h2>습관 기록표</h2>

      {habits.length === 0 ? (
        <div className="empty-habit-container">
          <p>아직 습관이 없어요.</p>
          <p>오늘의 습관에서 습관을 생성해보세요!</p>
        </div>
      ) : (
        <div className="habit-wrapper">
          <div className="habit-weeks">
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span>토</span>
            <span>일</span>
          </div>
          {habits.map((habit, index) => {
            const currentCompletedIcon =
              completedPow[index % completedPow.length];

            return (
              <div key={habit.habitId} className="habit-row">
                <div className="habit-name">{habit.habitName}</div>

                <div className="day-cells-container">
                  {weekDays.map((day) => {
                    const status = habit.dates[day];
                    return (
                      <div key={day} className="day-cell">
                        {status === true ? (
                          <img src={currentCompletedIcon} alt="완료" />
                        ) : status === false ? (
                          <img src={emptyPow} alt="미완료" />
                        ) : (
                          <img src={blackPow} alt="습관 없음" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default HabitRecord;
