import client from './client.js';

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
export async function updateHabit(habitId, habitData) {
  const response = await client.patch(`/habits/${habitId}`, habitData);
  return response.data;
}

// 습관 삭제
export async function deleteHabit(habitId) {
  const response = await client.delete(`/habits/${habitId}`);
  return response.data;
}

// 스터디 비밀번호 인증
export async function verifyStudyPassword(studyId, password) {
  const response = await client.post(`/studies/${studyId}/verify-password`, {
    password,
  });
  return response.data;
}

// 스터디 인증 세션 확인
export async function checkStudySession(studyId) {
  const response = await client.get(`/studies/${studyId}/verify-session`);
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
export async function getHabitRecords(habitId, startDate, endDate) {
  const response = await client.get(`/habits/${habitId}/records`, {
    params: {
      weekStart: startDate,
      weekEnd: endDate,
    },
  });
  return response.data;
}
