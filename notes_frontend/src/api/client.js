//
// Simple API client using fetch with Authorization handling and base URL from env
//

const DEFAULT_BASE = 'http://localhost:3001';

// PUBLIC_INTERFACE
export function getApiBase() {
  /** Returns the API base URL from environment or falls back to localhost. */
  return process.env.REACT_APP_API_BASE || DEFAULT_BASE;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', body, token, headers = {}, signal } = {}) {
  /** Performs an HTTP request to the backend API with JSON handling and optional Bearer token.
   * path: string - resource path starting with '/'
   * method: HTTP method
   * body: object for JSON payload
   * token: JWT token for Authorization header
   * headers: additional headers
   * signal: AbortSignal for cancellation
   * Returns: { data, status } or throws Error with message and status
   */
  const url = `${getApiBase()}${path}`;
  const reqHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (token) {
    reqHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: reqHeaders,
    body: body ? JSON.stringify(body) : undefined,
    signal,
    credentials: 'include',
    mode: 'cors',
  });

  const contentType = res.headers.get('content-type') || '';
  let payload = null;
  if (contentType.includes('application/json')) {
    payload = await res.json().catch(() => null);
  } else {
    payload = await res.text().catch(() => null);
  }

  if (!res.ok) {
    const message = (payload && (payload.detail || payload.message)) || `Request failed: ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  return { data: payload, status: res.status };
}

// PUBLIC_INTERFACE
export const api = {
  // Auth endpoints
  login: (email, password) => apiRequest('/auth/login', { method: 'POST', body: { email, password } }),
  register: (email, password) => apiRequest('/auth/register', { method: 'POST', body: { email, password } }),
  me: (token) => apiRequest('/auth/me', { method: 'GET', token }),

  // Notes CRUD
  listNotes: ({ q, tag, page = 1, pageSize = 10 } = {}, token) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (tag) params.set('tag', tag);
    if (page) params.set('page', String(page));
    if (pageSize) params.set('pageSize', String(pageSize));
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiRequest(`/notes${qs}`, { method: 'GET', token });
  },
  getNote: (id, token) => apiRequest(`/notes/${encodeURIComponent(id)}`, { method: 'GET', token }),
  createNote: (note, token) => apiRequest('/notes', { method: 'POST', body: note }, { token }),
  updateNote: (id, note, token) => apiRequest(`/notes/${encodeURIComponent(id)}`, { method: 'PUT', body: note, token }),
  deleteNote: (id, token) => apiRequest(`/notes/${encodeURIComponent(id)}`, { method: 'DELETE', token }),
};

export default api;
