import { apiFetch } from './client';

/** Amount is always sent/received as a float (dollars). Server converts to cents. */

export async function listTransactions(page = 1, limit = 50) {
  return apiFetch(`/budget/transactions?page=${page}&limit=${limit}`);
}

export async function createTransaction({ type, label, amount, category, who, date }) {
  return apiFetch('/budget/transactions', {
    method: 'POST',
    body: JSON.stringify({ type, label, amount, category, who, date }),
  });
}

export async function deleteTransaction(id) {
  return apiFetch(`/budget/transactions/${id}`, { method: 'DELETE' });
}
