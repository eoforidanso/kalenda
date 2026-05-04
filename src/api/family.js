import { apiFetch } from './client';

export async function getMyFamily() {
  // Returns the first family the authenticated user belongs to
  return apiFetch('/families/mine');
}

export async function createInvite(familyId, email) {
  return apiFetch(`/families/${familyId}/invites`, {
    method: 'POST',
    body:   JSON.stringify({ email }),
  });
}

export async function validateInvite(token) {
  return apiFetch(`/families/invites/${token}`);
}

export async function acceptInvite(token, displayName, color) {
  return apiFetch(`/families/invites/${token}/accept`, {
    method: 'POST',
    body:   JSON.stringify({ displayName, color }),
  });
}
