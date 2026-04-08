export const focusMockResponse = {
  data: {
    studyId: 1,
    latestSession: {
      id: 1,
      duration: 60,
      earnedPoint: 9,
      startedAt: '2026-04-07T10:00:00.000Z',
      completedAt: '2026-04-07T11:00:00.000Z',
    },
  },
  message: 'success',
};

export const focusStartMockResponse = {
  data: {
    studyId: 1,
    duration: 60,
    startedAt: '2026-04-07T10:00:00.000Z',
  },
  message: '집중이 시작되었습니다.',
};

export const focusCompleteMockResponse = {
  data: {
    id: 1,
    studyId: 1,
    duration: 60,
    earnedPoint: 9,
    startedAt: '2026-04-07T10:00:00.000Z',
    completedAt: '2026-04-07T11:00:00.000Z',
  },
  message: '집중이 완료되었습니다.',
};
