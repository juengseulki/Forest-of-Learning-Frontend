import client from './client.js';

export async function getStudies(keyword, order) {
  const response = await client.get('/studies', {
    params: { keyword, order },
  });
  return response.data;
}

export async function getStudy(studyId) {
  const response = await client.get(`/studies/${studyId}`);
  return response.data;
}

export async function createStudy(studyData) {
  const response = await client.post('/studies', studyData);
  return response.data;
}

export async function verifyStudyPassword(studyId, password) {
  const response = await client.post(`/studies/${studyId}/verify-password`, {
    password,
  });
  return response.data;
}

export async function updateStudy(studyId, studyData) {
  const response = await client.patch(`/studies/${studyId}`, studyData);
  return response.data;
}

export async function deleteStudy(studyId, password) {
  const response = await client.delete(`/studies/${studyId}`, { password });
  return response.data;
}

export async function checkStudySession(studyId) {
  const response = await client.get(`/studies/${studyId}/verify-session`);
  return response.data;
}
