import { apiFetch } from './client';

// Backend Task → frontend shape used by Tasks.jsx
function toFrontend(t) {
  return {
    id:        t.id,
    label:     t.title,
    who:       t.assignedToName ?? 'Family',
    done:      t.done,
    stars:     t.stars  ?? 1,
    cat:       capitalise(t.category ?? 'chores'),
    icon:      t.icon   ?? '✅',
    recurring: t.isRecurring ? (t.recurrenceRule ?? 'Daily') : null,
  };
}

function capitalise(s) { return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(); }

function toBackend(task) {
  return {
    title:          task.label,
    category:       (task.cat ?? 'Chores').toLowerCase(),
    assignedToName: task.who  ?? null,
    done:           task.done ?? false,
    stars:          task.stars ?? 1,
    icon:           task.icon  ?? '✅',
    isRecurring:    !!task.recurring,
    recurrenceRule: task.recurring ?? null,
  };
}

export async function listTasks(assignedToName, category) {
  const params = new URLSearchParams();
  if (assignedToName) params.set('assignedToName', assignedToName);
  if (category)       params.set('category',       category.toLowerCase());
  const tasks = await apiFetch(`/tasks?${params}`);
  return tasks.map(toFrontend);
}

export async function createTask(task) {
  const created = await apiFetch('/tasks', {
    method: 'POST',
    body:   JSON.stringify(toBackend(task)),
  });
  return toFrontend(created);
}

export async function toggleTask(id, done) {
  const updated = await apiFetch(`/tasks/${id}`, {
    method: 'PATCH',
    body:   JSON.stringify({ done }),
  });
  return toFrontend(updated);
}

export async function deleteTask(id) {
  return apiFetch(`/tasks/${id}`, { method: 'DELETE' });
}
