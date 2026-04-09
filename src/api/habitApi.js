import client from './client';

const BASE = (studyId) => `/studies/${studyId}/habits`;

// 습관 목록 조회
export async function getHabitList(studyId) {
  const response = await client.get(BASE(studyId));
  return response.data;
}

// 습관 생성
export async function createHabit(studyId, habitData) {
  const response = await client.post(BASE(studyId), habitData);
  return response.data;
}

// 습관 수정
export async function updateHabit(studyId, habitId, habitData) {
  const response = await client.patch(`${BASE(studyId)}/${habitId}`, habitData);
  return response.data;
}

// 습관 삭제
export async function deleteHabit(studyId, habitId) {
  const response = await client.delete(`${BASE(studyId)}/${habitId}`);
  return response.data;
}

// 습관 체크 / 해제 (날짜 기반)
export async function toggleHabitCheck(studyId, habitId, date) {
  const response = await client.patch(`${BASE(studyId)}/${habitId}/check`, { date });
  return response.data;
}

// 날짜별 습관 기록 조회 (기록표용)
export async function getHabitRecords(studyId, { startDate, endDate } = {}) {
  const response = await client.get(`${BASE(studyId)}/records`, {
    params: { startDate, endDate },
  });
  return response.data;
}