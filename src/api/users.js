import { apiFetch } from './client';

export async function getMe() {
  return apiFetch('/users/me');
}

export async function updateMe(patch) {
  return apiFetch('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}
