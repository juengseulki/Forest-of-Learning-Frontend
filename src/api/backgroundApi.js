import client from './client.js';

export async function getBackgrounds() {
  const response = await client.get('/backgrounds');
  return response.data;
}

export async function getBackground(backgroundId) {
  const response = await client.get(`/backgrounds/${backgroundId}`);
  return response.data;
}
