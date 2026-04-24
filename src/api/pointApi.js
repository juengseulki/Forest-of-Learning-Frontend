import client from './client.js';

export async function getPoint(studyId) {
  const response = await client.get(`/points/${studyId}`);
  return response.data;
}

export async function getPointLog(studyId) {
  const response = await client.get(`/points/${studyId}/logs`);
  return response.data;
}
