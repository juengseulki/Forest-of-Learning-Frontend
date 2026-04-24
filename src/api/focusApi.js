import client from './client.js';

export async function getFocus(studyId) {
  const response = await client.get(`/focuses/${studyId}`);
  return response.data;
}

export async function completeFocus(studyId, payload) {
  const response = await client.post(`/focuses/${studyId}`, payload);
  return response.data;
}

export async function getFocusPoint(studyId) {
  const response = await client.get(`/points/${studyId}`);
  return response.data;
}

export async function getFocusStudy(studyId) {
  const response = await client.get(`/studies/${studyId}`);
  return response.data;
}
