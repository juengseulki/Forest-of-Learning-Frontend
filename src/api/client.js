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

  const json = await res.json();

  if (!res.ok) {
    const err = new Error(json.error?.message || '요청에 실패했습니다.');
    err.status = res.status;
    err.code = json.error?.code;
    throw err;
  }

  return { data: json.data };
}

const client = {
  get: (url, options) => request('GET', url, options),
  post: (url, data) => request('POST', url, { data }),
  patch: (url, data) => request('PATCH', url, { data }),
  delete: (url) => request('DELETE', url),
};

export default client;
