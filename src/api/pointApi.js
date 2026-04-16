import client from './client.js';

// 포인트 조회
export async function getPoint(studyId) {
  const response = await client.get(`/points/${studyId}`);
  return response.data;
}

// 포인트 추가 (백단 계산으로 변경되어 더 이상 사용되지 않음)
// export async function addPoints(studyId, sessionData) {
//   const response = await client.patch(`/points/${studyId}/calculate`, { sessionData });
//   return response.data;
// }
