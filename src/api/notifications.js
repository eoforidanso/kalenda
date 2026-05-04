import { apiFetch } from './client';

export async function listNotifications(onlyUnread = false) {
  const url = onlyUnread ? '/notifications?unread=true' : '/notifications';
  return apiFetch(url);
}

export async function markRead(id) {
  return apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllRead() {
  return apiFetch('/notifications/mark-all-read', { method: 'POST' });
}

export async function dismissNotification(id) {
  return apiFetch(`/notifications/${id}`, { method: 'DELETE' });
}
