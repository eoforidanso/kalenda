import { apiFetch } from './client';

export function getPlan() {
  return apiFetch('/payments/plan').then(r => r.data ?? { plan: 'free' });
}

export function createCheckout() {
  return apiFetch('/payments/checkout', { method: 'POST' }).then(r => r.data);
}
