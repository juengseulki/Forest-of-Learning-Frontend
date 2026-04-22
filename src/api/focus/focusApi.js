import client from '../client.js';

export async function getFocus(studyId) {
  return client.get(`/focuses/${studyId}`);
}

// export async function startFocus(studyId) {
//   return client.post(`/focuses/${studyId}/start`);
// }

export async function completeFocus(studyId, payload) {
  return client.post(`/focuses/${studyId}`, payload);
}
export async function getPoint(studyId) {
  return client.get(`/points/${studyId}`);
}

export async function getStudyById(studyId) {
  return client.get(`/studies/${studyId}`);
}
