import client from './client.js';

// 스터디 목록 조회
export async function getStudies(keyword, order) {
  const response = await client.get('/studies', {
    params: { keyword, order },
  });
  return response.data;
}

// 스터디 단건 조회
export async function getStudy(studyId) {
  const response = await client.get(`/studies/${studyId}`);
  return response.data;
}

// 스터디 생성
export async function createStudy(studyData) {
  const response = await client.post('/studies', studyData);
  return response.data;
}

// 스터디 수정
export async function updateStudy(studyId, studyData) {
  const response = await client.patch(`/studies/${studyId}`, studyData);
  return response.data;
}

// 스터디 삭제
export async function deleteStudy(studyId) {
  const response = await client.delete(`/studies/${studyId}`);
  return response.data;
}
