import client from './client.js';

// 습관 목록 조회
export async function getHabitList(studyId) {
  const response = await client.get('/habits', { params: { studyId } });
  return response.data;
}

// 습관 생성
export async function createHabit(studyId, habitData) {
  const response = await client.post('/habits', { studyId, ...habitData });
  return response.data;
}

// 습관 수정
export async function updateHabit(habitId, habitData) {
  const response = await client.patch(`/habits/${habitId}`, habitData);
  return response.data;
}

// 습관 삭제
export async function deleteHabit(habitId) {
  const response = await client.delete(`/habits/${habitId}`);
  return response.data;
}

// 습관 체크 / 해제 (날짜 기반 upsert)
export async function toggleHabitCheck(habitId, date, completed) {
  const response = await client.post(`/habits/${habitId}/records`, { date, completed });
  return response.data;
}

// 습관별 기록 조회
export async function getHabitRecords(habitId) {
  const response = await client.get(`/habits/${habitId}/records`);
  return response.data;
}
