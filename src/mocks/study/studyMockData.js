export const studiesMockResponse = {
  data: {
    items: [
      {
        id: 1,
        nickname: '슬기',
        name: 'React 스터디',
        description: '프론트엔드 공부',
        background: {
          id: 1,
          name: 'forest',
          imageUrl: '/images/forest.png',
        },
        createdAt: '2026-04-07T09:00:00.000Z',
      },
      {
        id: 2,
        nickname: '민수',
        name: '알고리즘 스터디',
        description: '코딩 테스트 대비',
        background: {
          id: 2,
          name: 'night',
          imageUrl: '/images/night.png',
        },
        createdAt: '2026-04-06T09:00:00.000Z',
      },
    ],
    totalCount: 2,
    page: 1,
    limit: 10,
  },
  message: 'success',
};
