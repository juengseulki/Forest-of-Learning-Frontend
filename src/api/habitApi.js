import client from './client.js';
import { getStudyAuthToken } from './studyApi.js';

// 스터디 상세 조회
export async function getStudyDetail(studyId) {
  const response = await client.get(`/studies/${studyId}`);
  return response.data;
}

// 습관 목록 조회
export async function getHabitList(studyId) {
  const response = await client.get('/habits', {
    params: { studyId },
  });
  return response.data;
}

// 습관 생성
export async function createHabit(studyId, habitData) {
  const response = await client.post('/habits', {
    studyId,
    ...habitData,
  });
  return response.data;
}

// 습관 수정
export async function updateHabit(habitId, studyId, habitData) {
  const token = getStudyAuthToken(studyId);
  const response = await client.patch(`/habits/${habitId}`, habitData, {
    token,
  });
  return response.data;
}

// 습관 삭제
export async function deleteHabit(habitId, studyId) {
  const token = getStudyAuthToken(studyId);
  const response = await client.delete(`/habits/${habitId}`, {
    token,
  });
  return response.data;
}

// 습관 체크 / 해제
export async function toggleHabitCheck(habitId, date, completed) {
  const response = await client.post(`/habits/${habitId}/records`, {
    date,
    completed,
  });
  return response.data;
}

// 습관 기록 조회
export async function getHabitRecords(studyId, startDate, endDate) {
  const response = await client.get(`/habits/${studyId}/records`, {
    params: {
      weekStart: startDate,
      weekEnd: endDate,
    },
  });
  return response.data;
}
