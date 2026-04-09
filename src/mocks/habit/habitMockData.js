export const habitsMockResponse = {
  data: {
    currentTime: '2026-04-07T10:00:00.000Z',
    items: [
      {
        id: 1,
        name: '알고리즘 1문제 풀기',
        isEnded: false,
        createdAt: '2026-04-07T09:00:00.000Z',
        updatedAt: '2026-04-07T09:00:00.000Z',
        todayRecord: {
          date: '2026-04-07T00:00:00.000Z',
          completed: true,
        },
      },
      {
        id: 2,
        name: 'CS 복습하기',
        isEnded: false,
        createdAt: '2026-04-07T09:10:00.000Z',
        updatedAt: '2026-04-07T09:10:00.000Z',
        todayRecord: {
          date: '2026-04-07T00:00:00.000Z',
          completed: false,
        },
      },
    ],
  },
  message: 'success',
};

export const habitRecordMockResponse = {
  data: {
    weekStart: '2026-04-07',
    weekEnd: '2026-04-13',
    records: [
      {
        habitId: 1,
        habitName: '알고리즘 1문제 풀기',
        dates: {
          '2026-04-07': true,
          '2026-04-08': true,
          '2026-04-09': false,
          '2026-04-10': true,
        },
      },
    ],
  },
  message: 'success',
};
