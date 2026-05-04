const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1';

export function getToken()   { return localStorage.getItem('kalenda_token'); }
export function getRefresh() { return localStorage.getItem('kalenda_refresh'); }

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken)  localStorage.setItem('kalenda_token',   accessToken);
  if (refreshToken) localStorage.setItem('kalenda_refresh', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('kalenda_token');
  localStorage.removeItem('kalenda_refresh');
  localStorage.removeItem('kalenda_user');
}

// Singleton refresh promise so concurrent 401s don't fire multiple refresh requests
let refreshPromise = null;

async function doRefresh() {
  const refreshToken = getRefresh();
  if (!refreshToken) return null;
  try {
    const res  = await fetch(`${BASE}/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refreshToken }),
    });
    const json = await res.json();
    if (json.success) { setTokens(json.data); return json.data.accessToken; }
    clearTokens();
    return null;
  } catch {
    clearTokens();
    return null;
  }
}

export async function ensureRefresh() {
  if (!refreshPromise) refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
  return refreshPromise;
}

/**
 * Core fetch wrapper. Handles:
 *  - Attaching Authorization header
 *  - Auto-refresh on 401
 *  - Dispatching 'kalenda:logout' if refresh fails
 *  - Unwrapping { success, data } envelope
 *  - Throwing on error responses
 */
export async function apiFetch(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers ?? {}) };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    const newToken = await ensureRefresh();
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(`${BASE}${path}`, { ...options, headers });
    } else {
      window.dispatchEvent(new CustomEvent('kalenda:logout'));
      throw Object.assign(new Error('Session expired'), { status: 401 });
    }
  }

  if (res.status === 204) return null;

  const json = await res.json();
  if (!json.success) {
    throw Object.assign(new Error(json.error ?? 'API error'), {
      status: res.status,
      issues: json.issues ?? [],
    });
  }
  return json.data;
}
