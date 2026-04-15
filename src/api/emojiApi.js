import client from './client.js';

// 이모지 반응 목록 조회
export async function getEmojiReactions(studyId) {
  const response = await client.get('/emojis', { params: { studyId } });
  return response.data;
}

// 이모지 반응 추가
export async function addEmojiReaction(studyId, emoji) {
  const response = await client.post('/emojis', { studyId, emoji });
  return response.data;
}
