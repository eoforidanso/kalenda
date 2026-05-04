import { apiFetch } from './client';

// Backend List → frontend list shape used by Lists.jsx
function listToFrontend(l) {
  return {
    id:    l.id,
    name:  l.name,
    icon:  l.icon  ?? '📝',
    color: l.color ?? '#7c3aed',
    items: (l.items ?? []).map(itemToFrontend),
  };
}

function itemToFrontend(it) {
  return {
    id:      it.id,
    label:   it.text,
    done:    it.done,
    addedBy: it.addedByName ?? '',
  };
}

// ─── Lists ─────────────────────────────────────────────────────────────────────

export async function getLists() {
  const lists = await apiFetch('/lists');
  return lists.map(listToFrontend);
}

export async function createList(name, icon) {
  const list = await apiFetch('/lists', {
    method: 'POST',
    body:   JSON.stringify({ name, icon: icon ?? '📝' }),
  });
  return listToFrontend(list);
}

export async function deleteList(id) {
  return apiFetch(`/lists/${id}`, { method: 'DELETE' });
}

// ─── Items ─────────────────────────────────────────────────────────────────────

export async function addItem(listId, text, addedByName) {
  const item = await apiFetch(`/lists/${listId}/items`, {
    method: 'POST',
    body:   JSON.stringify({ text, addedByName }),
  });
  return itemToFrontend(item);
}

export async function toggleItem(listId, itemId, done) {
  const item = await apiFetch(`/lists/${listId}/items/${itemId}`, {
    method: 'PATCH',
    body:   JSON.stringify({ done }),
  });
  return itemToFrontend(item);
}

export async function removeItem(listId, itemId) {
  return apiFetch(`/lists/${listId}/items/${itemId}`, { method: 'DELETE' });
}

export async function clearCompleted(listId) {
  return apiFetch(`/lists/${listId}/items`, { method: 'DELETE' });
}
