import client from './client.js';

// 포인트 조회
export async function getPoint(studyId) {
  const response = await client.get(`/points/${studyId}`);
  return response.data;
}

// 포인트 추가
export async function addPoints(studyId, amount) {
  const response = await client.patch(`/points/${studyId}`, { amount });
  return response.data;
}
