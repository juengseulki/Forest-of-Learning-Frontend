import client from './client.js';

export async function getEmojiReactions(studyId) {
  const response = await client.get('/emojis', {
    params: { studyId },
  });

  return response.data;
}

export async function addEmojiReaction(studyId, emoji) {
  const response = await client.post('/emojis', {
    studyId,
    emoji,
  });

  return response.data;
}
