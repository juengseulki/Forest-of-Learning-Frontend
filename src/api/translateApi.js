import {
  getCachedTranslation,
  setCachedTranslation,
} from '../shared/utils/translationCache.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const pendingRequests = new Map();

function makeKey(text, target) {
  return `${target}::${text}`;
}

export async function translate(text, target = 'en') {
  if (!text?.trim()) return '';

  const cached = getCachedTranslation(text, target);
  if (cached) {
    return cached;
  }

  const requestKey = makeKey(text, target);

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  const requestPromise = (async () => {
    const res = await fetch(`${BASE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, target }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || '번역 요청 실패');
    }

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
