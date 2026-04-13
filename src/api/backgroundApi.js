import client from './client.js';

// 배경 목록 조회
export async function getBackgrounds() {
  const response = await client.get('/backgrounds');
  return response.data;
}

// 배경 단건 조회
export async function getBackground(backgroundId) {
  const response = await client.get(`/backgrounds/${backgroundId}`);
  return response.data;
}
