import client from './client.js';
import { getStudyAuthToken } from './studyApi.js';

export async function getFocus(studyId) {
  return client.get(`/focuses/${studyId}`);
}

export async function completeFocus(studyId, payload) {
  const token = getStudyAuthToken(studyId);
  return client.post(`/focuses/${studyId}`, payload, { token });
}

export async function getPoint(studyId) {
  return client.get(`/points/${studyId}`);
}

export async function getStudyById(studyId) {
  return client.get(`/studies/${studyId}`);
}
