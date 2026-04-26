import client from './client.js';
import {
  getCachedTranslation,
  setCachedTranslation,
} from '../shared/utils/translationCache.js';

const pendingRequests = new Map();

function normalizeText(text) {
  if (text == null) return '';
  return String(text).trim();
}

function makeKey(text, target) {
  return `${target}::${text}`;
}

function resolveTranslatedText(response) {
  return (
    response?.data?.translatedText ??
    response?.translatedText ??
    response?.data ??
    ''
  );
}

export async function translate(text, target = 'en') {
  const normalizedText = normalizeText(text);

  if (!normalizedText) return '';

  const cached = getCachedTranslation(normalizedText, target);
  if (cached) return cached;

  const requestKey = makeKey(normalizedText, target);

  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }

  const requestPromise = (async () => {
    const response = await client.post('/translate', {
      text: normalizedText,
      target,
    });

    const translatedText = normalizeText(resolveTranslatedText(response));

    const finalText = translatedText || normalizedText;

    setCachedTranslation(normalizedText, target, finalText);

    return finalText;
  })();

  pendingRequests.set(requestKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    pendingRequests.delete(requestKey);
  }
}
