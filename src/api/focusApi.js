import client from './client.js';

// 집중 세션 목록 조회
export async function getFocusSessions(studyId) {
  const response = await client.get('/focuses', { params: { studyId } });
  return response.data;
}

// 집중 세션 생성
export async function createFocusSession(sessionData) {
  const response = await client.post('/focuses', sessionData);
  return response.data;
}
