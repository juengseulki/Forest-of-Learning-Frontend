import client from './client.js';

export async function getStudyDetail(studyId) {
  const response = await client.get(`/studies/${studyId}`);
  return response.data;
}

export async function getHabitList(studyId) {
  const response = await client.get('/habits', {
    params: { studyId },
  });

  return response.data;
}

export async function createHabit(studyId, habitData) {
  const response = await client.post('/habits', {
    studyId,
    ...habitData,
  });

  return response.data;
}

export async function updateHabit(habitId, habitData) {
  const response = await client.patch(`/habits/${habitId}`, habitData);
  return response.data;
}

export async function deleteHabit(habitId) {
  const response = await client.delete(`/habits/${habitId}`);
  return response.data;
}

export async function verifyStudyPassword(studyId, password) {
  const response = await client.post(`/studies/${studyId}/verify-password`, {
    password,
  });

  return response.data;
}

export async function checkStudySession(studyId) {
  const response = await client.get(`/studies/${studyId}/verify-session`);
  return response.data;
}

export async function toggleHabitCheck(habitId, date, completed) {
  const response = await client.post(`/habits/${habitId}/records`, {
    date,
    completed,
  });

  return response.data;
}

export async function getHabitRecords(habitId, startDate, endDate) {
  const response = await client.get(`/habits/${habitId}/records`, {
    params: {
      weekStart: startDate,
      weekEnd: endDate,
    },
  });

  return response.data;
}
