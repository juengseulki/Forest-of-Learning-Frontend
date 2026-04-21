const TRANSLATION_CACHE_KEY = 'translationCache';

function getCache() {
  try {
    const raw = localStorage.getItem(TRANSLATION_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('번역 캐시를 불러오지 못했습니다.', error);
    return {};
  }
}

function setCache(cache) {
  try {
    localStorage.setItem(TRANSLATION_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('번역 캐시를 저장하지 못했습니다.', error);
  }
}

function makeKey(text, target) {
  return `${target}::${text}`;
}

export function getCachedTranslation(text, target) {
  const cache = getCache();
  return cache[makeKey(text, target)] || '';
}

export function setCachedTranslation(text, target, translatedText) {
  const cache = getCache();
  cache[makeKey(text, target)] = translatedText;
  setCache(cache);
}

export function clearTranslationCache() {
  try {
    localStorage.removeItem(TRANSLATION_CACHE_KEY);
  } catch (error) {
    console.error('번역 캐시를 삭제하지 못했습니다.', error);
  }
}
