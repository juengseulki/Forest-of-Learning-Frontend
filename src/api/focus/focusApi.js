import {
  focusMockResponse,
  focusStartMockResponse,
  focusCompleteMockResponse,
} from '../../mocks/focus/focusMockData';
import { pointMockResponse } from '../../mocks/point/pointMockData';
import { studiesMockResponse } from '../../mocks/study/studyMockData';

export async function getFocus(studyId) {
  return Promise.resolve(focusMockResponse);
}

export async function startFocus(studyId) {
  return Promise.resolve(focusStartMockResponse);
}

export async function completeFocus(studyId, payload) {
  return Promise.resolve(focusCompleteMockResponse);
}

export async function getPoint(studyId) {
  return Promise.resolve(pointMockResponse);
}

export async function getStudyById(studyId) {
  const study = studiesMockResponse.data.items.find(
    (item) => item.id === Number(studyId)
  );

  return Promise.resolve({
    data: study || null,
    message: study ? 'success' : '스터디를 찾을 수 없습니다.',
  });
}
