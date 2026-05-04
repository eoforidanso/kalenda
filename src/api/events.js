import { apiFetch } from './client';

// ─── Shape mapping ─────────────────────────────────────────────────────────────
// Backend CalendarEvent → frontend event shape used by Calendar.jsx

const TYPE_ICON = {
  birthday: '🎂', event: '📅', milestone: '🎓', photo: '📸', reminder: '🔔',
};

/** Backend row → { id, type, icon, label, time, color, who, notes, recur, dateKey } */
function toFrontend(ev) {
  const d       = new Date(ev.startAt);
  const dateKey = d.toISOString().slice(0, 10);
  const type    = ev.type || 'event';
  const time    = ev.allDay
    ? 'All day'
    : d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return {
    id:      ev.id,
    type,
    icon:    ev.icon ?? TYPE_ICON[type] ?? '📅',
    label:   ev.title,
    time,
    color:   ev.color ?? 'slate',
    who:     ev.assignedToName ?? 'Family',
    notes:   ev.description   ?? '',
    recur:   ev.isRecurring    ? (ev.recurrenceRule ?? 'weekly') : null,
    dateKey,
  };
}

/** Frontend form values → backend CreateEventDto */
function toBackend(ev, dateKey) {
  let startAt;
  if (!ev.time || ev.time === 'All day') {
    const [y, m, d] = dateKey.split('-').map(Number);
    startAt = new Date(y, m - 1, d).toISOString();
  } else {
    // ev.time is either "HH:MM" (from <input type="time">) or "3:00 PM"
    const hmMatch  = ev.time.match(/^(\d{1,2}):(\d{2})$/);
    const ampmMatch = ev.time.match(/(\d+):(\d+)\s*(AM|PM)/i);
    let h = 0, min = 0;
    if (hmMatch) {
      h   = parseInt(hmMatch[1]);
      min = parseInt(hmMatch[2]);
    } else if (ampmMatch) {
      h   = parseInt(ampmMatch[1]);
      min = parseInt(ampmMatch[2]);
      if (ampmMatch[3].toUpperCase() === 'PM' && h < 12) h += 12;
      if (ampmMatch[3].toUpperCase() === 'AM' && h === 12) h = 0;
    }
    const [y, m, d] = dateKey.split('-').map(Number);
    startAt = new Date(y, m - 1, d, h, min).toISOString();
  }

  return {
    title:           ev.label,
    description:     ev.notes   ?? null,
    startAt,
    allDay:          !ev.time || ev.time === 'All day',
    color:           ev.color   ?? 'slate',
    assignedToName:  ev.who     ?? null,
    isRecurring:     !!ev.recur,
    recurrenceRule:  ev.recur   ?? null,
    type:            ev.type    ?? 'event',
    icon:            ev.icon    ?? null,
  };
}

// ─── Group flat event list into eventDB dict { 'YYYY-MM-DD': [ev, ...] } ──────
export function buildEventDB(events) {
  const db = {};
  for (const ev of events) {
    const fe = toFrontend(ev);
    const { dateKey, ...rest } = fe;
    if (!db[dateKey]) db[dateKey] = [];
    db[dateKey].push(rest);
  }
  return db;
}

// ─── API calls ─────────────────────────────────────────────────────────────────

export async function listEvents(from, to) {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to)   params.set('to',   to);
  const events = await apiFetch(`/events?${params}`);
  return events.map(toFrontend);
}

/** Creates an event. Returns frontend shape with dateKey. */
export async function createEvent(formValues, dateKey) {
  const created = await apiFetch('/events', {
    method: 'POST',
    body:   JSON.stringify(toBackend(formValues, dateKey)),
  });
  return toFrontend(created);
}

export async function updateEvent(id, formValues, dateKey) {
  const updated = await apiFetch(`/events/${id}`, {
    method: 'PATCH',
    body:   JSON.stringify(toBackend(formValues, dateKey)),
  });
  return toFrontend(updated);
}

export async function deleteEvent(id) {
  return apiFetch(`/events/${id}`, { method: 'DELETE' });
}
