const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function request(method, url, { data, params } = {}) {
  const fullUrl = new URL(BASE_URL + url);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        fullUrl.searchParams.set(key, value);
      }
    });
  }

  const res = await fetch(fullUrl.toString(), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  if (!res.ok) {
    let errorMessage = '요청에 실패했습니다.';
    let errorCode;

    if (isJson) {
      try {
        const json = await res.json();
        errorMessage = json.error?.message || errorMessage;
        errorCode = json.error?.code;
      } catch (_) {
        // JSON 파싱 실패 시 기본 메시지.
      }
    } else if (res.status === 404) {
      errorMessage = '요청한 경로를 찾을 수 없습니다.';
      errorCode = 'NOT_FOUND';
    } else if (res.status >= 500) {
      errorMessage = '서버 오류가 발생했습니다.';
      errorCode = 'INTERNAL_ERROR';
    }

    const err = new Error(errorMessage);
    err.status = res.status;
    err.code = errorCode;
    throw err;
  }

  if (!isJson) {
    return { data: null };
  }

  const json = await res.json();
  return { data: json.data };
}

const client = {
  get: (url, options) => request('GET', url, options),
  post: (url, data) => request('POST', url, { data }),
  patch: (url, data) => request('PATCH', url, { data }),
  delete: (url) => request('DELETE', url),
};

export default client;
