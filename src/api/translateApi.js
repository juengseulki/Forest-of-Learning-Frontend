import client from './client.js';
import {
  getCachedTranslation,
  setCachedTranslation,
} from '../shared/utils/translationCache.js';

const pendingRequests = new Map();

function makeKey(text, target) {
  return `${target}::${text}`;
}

export async function translate(text, target = 'en') {
  if (!text?.trim()) return '';

  const cached = getCachedTranslation(text, target);
  if (cached) return cached;

  const requestKey = makeKey(text, target);

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  const requestPromise = (async () => {
    const data = await client.post('/translate', {
      text,
      target,
    });

    const translatedText = data.translatedText || '';
    setCachedTranslation(text, target, translatedText);

    return translatedText;
  })();

  pendingRequests.set(requestKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    pendingRequests.delete(requestKey);
  }
}
