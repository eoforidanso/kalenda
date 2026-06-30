import { apiFetch, setTokens, clearTokens } from './client';

export async function register({ name, email, password, familyName }) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    body:   JSON.stringify({ name, email, password, familyName }),
  });
  setTokens(data);
  return data; // { accessToken, refreshToken, expiresIn, user }
}

export async function login({ email, password }) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body:   JSON.stringify({ email, password }),
  });
  setTokens(data);
  return data; // { accessToken, refreshToken, expiresIn, user }
}

export async function googleAuth(idToken) {
  const data = await apiFetch('/auth/google', {
    method: 'POST',
    body:   JSON.stringify({ idToken }),
  });
  setTokens(data);
  return data;
}

export async function logout() {
  try { await apiFetch('/auth/logout', { method: 'POST' }); } catch { /* ignore */ }
  clearTokens();
}
