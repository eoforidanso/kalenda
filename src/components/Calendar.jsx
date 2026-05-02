import { useState } from 'react';

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const EVENT_DB = {
  '2026-05-01': [
    { id: 1, type: 'photo', icon: '📸', label: 'Weekly photo dump', time: 'All day', color: 'sky', who: 'Family', notes: 'Recurring every Friday', recur: 'weekly' },
  ],
  '2026-05-03': [
    { id: 2, type: 'event', icon: '🎹', label: "Emma's Piano Recital", time: '3:00 PM', color: 'rose', who: 'Emma', notes: 'Riverside Community Hall, Room 4', recur: null },
  ],
  '2026-05-08': [
    { id: 3, type: 'birthday', icon: '💐', label: "Mother's Day", time: 'All day', color: 'pink', who: 'Family', notes: 'Brunch at 11am', recur: 'yearly' },
  ],
  '2026-05-10': [
    { id: 4, type: 'birthday', icon: '🎂', label: "Maya's 8th Birthday", time: 'All day', color: 'violet', who: 'Maya', notes: 'Party at 2pm, invite 10 kids', recur: 'yearly' },
    { id: 5, type: 'event', icon: '🎉', label: "Maya's Birthday Party", time: '2:00 PM', color: 'violet', who: 'Family', notes: 'Book the backyard gazebo', recur: null },
  ],
  '2026-05-15': [
    { id: 6, type: 'event', icon: '🍖', label: "Family BBQ at Grandma's", time: '12:00 PM', color: 'amber', who: 'Family', notes: 'Bring potato salad and drinks', recur: null },
  ],
  '2026-05-19': [
    { id: 7, type: 'birthday', icon: '🎂', label: "Grandma's Birthday", time: 'All day', color: 'emerald', who: 'Grandma', notes: "She'll be 72!", recur: 'yearly' },
  ],
  '2026-05-22': [
    { id: 8, type: 'milestone', icon: '🎓', label: "Jake's Graduation Ceremony", time: '10:00 AM', color: 'emerald', who: 'Jake', notes: 'Main auditorium, bring camera', recur: null },
    { id: 9, type: 'event', icon: '🥂', label: 'Graduation Dinner', time: '6:00 PM', color: 'amber', who: 'Family', notes: 'Reservation at Osteria', recur: null },
  ],
  '2026-05-25': [
    { id: 10, type: 'reminder', icon: '🔔', label: 'Frame firmware update', time: '9:00 AM', color: 'slate', who: 'System', notes: 'v2.4.1 available', recur: null },
  ],
  '2026-05-29': [
    { id: 11, type: 'event', icon: '🌿', label: 'Hiking Trip — Mt. Legon', time: '7:00 AM', color: 'teal', who: 'Dad', notes: 'Pack lunch, 6km trail', recur: null },
  ],
  '2026-06-01': [
    { id: 12, type: 'birthday', icon: '🎂', label: "Dad's Birthday", time: 'All day', color: 'sky', who: 'Dad', notes: '', recur: 'yearly' },
  ],
};

const PHOTO_COUNTS = {
  '2026-05-01': 8, '2026-05-03': 14, '2026-05-08': 3,
  '2026-05-10': 22, '2026-05-15': 31, '2026-05-19': 7,
  '2026-05-22': 19, '2026-05-25': 2, '2026-05-29': 11,
};

const TYPE_FILTERS = ['All', 'Birthday', 'Event', 'Milestone', 'Photo', 'Reminder'];

const TYPE_COLORS = {
  birthday: 'text-violet-500 bg-violet-50 border-violet-200',
  event: 'text-amber-600 bg-amber-50 border-amber-200',
  milestone: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  photo: 'text-sky-500 bg-sky-50 border-sky-200',
  reminder: 'text-gray-500 bg-gray-100 border-gray-200',
};

const COLOR_DOT = {
  rose: 'bg-rose-500', pink: 'bg-pink-500', violet: 'bg-violet-500',
  amber: 'bg-amber-500', emerald: 'bg-emerald-500', sky: 'bg-sky-500',
  teal: 'bg-teal-500', slate: 'bg-slate-500',
};

const COLOR_BADGE = {
  rose: 'bg-rose-50 text-rose-600 border-rose-200',
  pink: 'bg-pink-50 text-pink-600 border-pink-200',
  violet: 'bg-violet-50 text-violet-600 border-violet-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  sky: 'bg-sky-50 text-sky-600 border-sky-200',
  teal: 'bg-teal-50 text-teal-600 border-teal-200',
  slate: 'bg-gray-100 text-gray-500 border-gray-200',
};

const MEMBER_COLORS = {
  Family: 'bg-amber-400', Emma: 'bg-rose-400', Maya: 'bg-violet-400',
  Jake: 'bg-emerald-400', Dad: 'bg-sky-400', Grandma: 'bg-pink-400',
  System: 'bg-slate-500', Mom: 'bg-orange-400',
};

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }
function toKey(y, m, d) {
  return y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}
function todayKey() {
  const n = new Date();
  return toKey(n.getFullYear(), n.getMonth(), n.getDate());
}
function formatDateKey(key) {
  const parts = key.split('-');
  return MONTHS[parseInt(parts[1], 10) - 1] + ' ' + parseInt(parts[2], 10) + ', ' + parts[0];
}
function getUpcoming(fromKey, count) {
  return Object.entries(EVENT_DB)
    .filter(function(entry) { return entry[0] >= fromKey; })
    .sort(function(a, b) { return a[0].localeCompare(b[0]); })
    .flatMap(function(entry) { return entry[1].map(function(e) { return Object.assign({}, e, { dateKey: entry[0] }); }); })
    .slice(0, count);
}

function AddEventModal({ defaultDay, onClose }) {
  const [label, setLabel] = useState('');
  const [date, setDate] = useState(defaultDay || todayKey());
  const [time, setTime] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [type, setType] = useState('event');
  const [color, setColor] = useState('amber');
  const [who, setWho] = useState('Family');
  const [notes, setNotes] = useState('');
  const [recur, setRecur] = useState('none');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e2ecf0', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-800 font-semibold">Add Event</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
          </button>
        </div>
        <div className="space-y-3">
          <input value={label} onChange={function(e) { setLabel(e.target.value); }} placeholder="Event name"
            className="w-full rounded-xl px-3 py-2.5 text-gray-700 text-sm placeholder-gray-300 focus:outline-none" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }} />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider mb-1 block">Date</label>
              <input type="date" value={date} onChange={function(e) { setDate(e.target.value); }}
                className="w-full rounded-xl px-3 py-2.5 text-gray-700 text-sm focus:outline-none" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-gray-400 text-[10px] uppercase tracking-wider">Time</label>
                <button onClick={function() { setAllDay(!allDay); }} className="flex items-center gap-1 text-gray-400 text-[10px]">
                  All day
                  <span className={`w-7 h-4 rounded-full ml-1 relative inline-block transition-colors ${allDay ? 'bg-teal-500' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${allDay ? 'right-0.5' : 'left-0.5'}`} />
                  </span>
                </button>
              </div>
              <input type="time" value={time} onChange={function(e) { setTime(e.target.value); }} disabled={allDay}
                className="w-full rounded-xl px-3 py-2.5 text-gray-700 text-sm focus:outline-none disabled:opacity-30" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }} />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 block">Type</label>
            <div className="flex gap-1.5 flex-wrap">
              {['birthday', 'event', 'milestone', 'photo', 'reminder'].map(function(t) {
                return (
                  <button key={t} onClick={function() { setType(t); }}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize ${type === t ? TYPE_COLORS[t] : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}>
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 block">Color</label>
              <div className="flex gap-2 flex-wrap">
                {['amber', 'rose', 'violet', 'emerald', 'sky', 'teal', 'pink', 'slate'].map(function(c) {
                  return (
                    <button key={c} onClick={function() { setColor(c); }}
                      className={`w-5 h-5 rounded-full ${COLOR_DOT[c]} transition-all ${color === c ? 'ring-2 ring-teal-400/70 scale-110' : 'opacity-50 hover:opacity-80'}`} />
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 block">Who</label>
              <select value={who} onChange={function(e) { setWho(e.target.value); }}
                className="w-full rounded-xl px-3 py-2 text-gray-700 text-sm focus:outline-none" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }}>
                {['Family', 'Mom', 'Dad', 'Emma', 'Maya', 'Jake', 'Grandma'].map(function(m) {
                  return <option key={m} value={m}>{m}</option>;
                })}
              </select>
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-[10px] uppercase tracking-wider mb-1.5 block">Recurrence</label>
            <div className="flex gap-1.5">
              {['none', 'weekly', 'monthly', 'yearly'].map(function(r) {
                return (
                  <button key={r} onClick={function() { setRecur(r); }}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors capitalize ${recur === r ? 'border-teal-500/40 text-teal-500 bg-teal-500/10' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}>
                    {r}
                  </button>
                );
              })}
            </div>
          </div>
          <textarea value={notes} onChange={function(e) { setNotes(e.target.value); }} placeholder="Notes (optional)" rows={2}
            className="w-full rounded-xl px-3 py-2.5 text-gray-700 text-sm placeholder-gray-300 focus:outline-none resize-none" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }} />
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-gray-500 text-sm hover:bg-gray-50 transition-colors" style={{ border: '1px solid #e2ecf0' }}>Cancel</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all" style={{ background: 'linear-gradient(135deg, #5bbfbf, #4db6ac)', boxShadow: '0 4px 16px rgba(91,191,191,0.35)' }}>Save Event</button>
        </div>
      </div>
    </div>
  );
}

function EventPill({ ev, compact }) {
  if (compact) {
    return (
      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-medium border truncate ${COLOR_BADGE[ev.color]}`}>
        <span>{ev.icon}</span>
        <span className="truncate">{ev.label}</span>
      </div>
    );
  }
  return (
    <div className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border ${COLOR_BADGE[ev.color]}`}>
      <span className="text-lg shrink-0 mt-0.5">{ev.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-sm leading-tight">{ev.label}</p>
        <p className="text-[11px] opacity-70 mt-0.5">{ev.time}</p>
        {ev.notes ? <p className="text-[10px] opacity-50 mt-1 leading-snug">{ev.notes}</p> : null}
      </div>
      <div className="shrink-0 text-right">
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${MEMBER_COLORS[ev.who] || 'bg-white/20'} text-white`}>{ev.who[0]}</span>
        {ev.recur ? <p className="text-[9px] opacity-40 mt-1 capitalize">{ev.recur}</p> : null}
      </div>
    </div>
  );
}

function MonthView({ year, month, selectedDay, onSelectDay, filter }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const cells = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, function(_, i) { return i + 1; })
  );
  const today = todayKey();

  return (
    <div className="glass rounded-2xl p-5">
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS_SHORT.map(function(d) {
          return <div key={d} className="text-center text-gray-400 text-[10px] font-semibold uppercase tracking-wider py-1">{d}</div>;
        })}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map(function(day, idx) {
          if (!day) return <div key={idx} />;
          const key = toKey(year, month, day);
          const dayEvents = (EVENT_DB[key] || []).filter(function(e) {
            return filter === 'All' || e.type === filter.toLowerCase();
          });
          const photos = PHOTO_COUNTS[key] || 0;
          const isToday = key === today;
          const isSelected = selectedDay === key;

          return (
            <button key={idx} onClick={function() { onSelectDay(isSelected ? null : key); }}
              className={`min-h-[52px] rounded-xl flex flex-col items-start p-1.5 text-xs transition-all relative ${
                isSelected ? 'ring-1 ring-teal-500/50' :
                isToday ? 'ring-1 ring-teal-400/60' : 'hover:bg-gray-50'
              }`}
              style={isSelected ? { background: 'rgba(91,191,191,0.10)' } : {}}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-medium mb-0.5 text-xs ${
                isToday ? 'text-white font-bold' : 'text-gray-600'
              }`}
              style={isToday ? { background: 'linear-gradient(135deg, #7c3aed, #5b21b6)', boxShadow: '0 2px 8px rgba(124,58,237,0.5)' } : {}}>{day}</span>
              <div className="w-full space-y-0.5">
                {dayEvents.slice(0, 2).map(function(ev) {
                  return <div key={ev.id} className={`w-full h-1 rounded-full ${COLOR_DOT[ev.color]}`} />;
                })}
                {dayEvents.length > 2 ? <p className="text-gray-400 text-[8px]">+{dayEvents.length - 2}</p> : null}
              </div>
              {photos > 0 ? (
                <div className="absolute bottom-1 right-1 flex items-center gap-0.5">
                  <svg viewBox="0 0 12 12" fill="currentColor" className="w-2 h-2 text-gray-300"><path fillRule="evenodd" d="M2 2a1 1 0 00-1 1v6a1 1 0 001 1h8a1 1 0 001-1V3a1 1 0 00-1-1H2zm6 6H2l2-4 1.5 3 1-2 1.5 3z" clipRule="evenodd"/></svg>
                  <span className="text-gray-300 text-[8px]">{photos}</span>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ year, month, day, onSelectDay, filter }) {
  const anchor = day ? new Date(day) : new Date(year, month, 1);
  const startOfWeek = new Date(anchor);
  startOfWeek.setDate(anchor.getDate() - anchor.getDay());
  const weekDays = Array.from({ length: 7 }, function(_, i) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });
  const today = todayKey();

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="grid grid-cols-7" style={{ borderBottom: '1px solid #e2ecf0' }}>
        {weekDays.map(function(d, i) {
          const key = toKey(d.getFullYear(), d.getMonth(), d.getDate());
          const isToday = key === today;
          return (
            <button key={i} onClick={function() { onSelectDay(key); }}
              className={`p-3 text-center last:border-0 hover:bg-gray-50 transition-colors ${isToday ? '' : ''}`}
              style={{ borderRight: '1px solid #e8ecf0', background: isToday ? 'rgba(91,191,191,0.08)' : '' }}>
              <p className="text-gray-400 text-[10px] mb-1">{DAYS_SHORT[d.getDay()]}</p>
              <span className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-sm font-medium ${isToday ? 'text-white' : 'text-gray-600'}`}
                style={isToday ? { background: 'linear-gradient(135deg, #e17055, #d65f4a)', boxShadow: '0 2px 8px rgba(225,112,85,0.4)' } : {}}>
                {d.getDate()}
              </span>
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-7 min-h-[200px]">
        {weekDays.map(function(d, i) {
          const key = toKey(d.getFullYear(), d.getMonth(), d.getDate());
          const dayEvents = (EVENT_DB[key] || []).filter(function(e) {
            return filter === 'All' || e.type === filter.toLowerCase();
          });
          const photos = PHOTO_COUNTS[key] || 0;
          return (
            <div key={i} className="p-1.5 space-y-1" style={{ borderRight: '1px solid #e8ecf0' }}>
              {dayEvents.map(function(ev) { return <EventPill key={ev.id} ev={ev} compact={true} />; })}
              {photos > 0 ? (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] text-sky-400/80 bg-sky-500/10">
                  <span>📷</span><span>{photos}</span>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgendaView({ year, month, filter }) {
  const startKey = toKey(year, month, 1);
  const entries = Object.entries(EVENT_DB)
    .filter(function(entry) { return entry[0] >= startKey; })
    .sort(function(a, b) { return a[0].localeCompare(b[0]); })
    .map(function(entry) {
      return {
        key: entry[0],
        label: formatDateKey(entry[0]),
        evs: entry[1].filter(function(e) { return filter === 'All' || e.type === filter.toLowerCase(); }),
      };
    })
    .filter(function(g) { return g.evs.length > 0; })
    .slice(0, 20);

  if (entries.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <span className="text-4xl block mb-3">📭</span>
        <p className="text-gray-400 text-sm">No upcoming events</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map(function(group) {
        return (
          <div key={group.key} className="glass rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-gray-500 text-xs font-semibold">{group.label}</p>
              {group.key === todayKey() ? (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-500 font-bold border border-teal-500/25">TODAY</span>
              ) : null}
            </div>
            <div className="space-y-2">
              {group.evs.map(function(ev) { return <EventPill key={ev.id} ev={ev} compact={false} />; })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Calendar({ setView }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [viewMode, setViewMode] = useState('month');
  const [selectedDay, setSelectedDay] = useState(todayKey());
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  function prevMonth() {
    if (month === 0) { setYear(function(y) { return y - 1; }); setMonth(11); }
    else setMonth(function(m) { return m - 1; });
  }
  function nextMonth() {
    if (month === 11) { setYear(function(y) { return y + 1; }); setMonth(0); }
    else setMonth(function(m) { return m + 1; });
  }
  function goToday() {
    setYear(now.getFullYear()); setMonth(now.getMonth()); setSelectedDay(todayKey());
  }

  const selectedEvents = selectedDay
    ? (EVENT_DB[selectedDay] || []).filter(function(e) { return filter === 'All' || e.type === filter.toLowerCase(); })
    : [];
  const selectedPhotos = selectedDay ? (PHOTO_COUNTS[selectedDay] || 0) : 0;

  const upcoming = getUpcoming(todayKey(), 6);

  const birthdays = Object.entries(EVENT_DB)
    .flatMap(function(entry) {
      return entry[1].filter(function(e) { return e.type === 'birthday'; }).map(function(e) {
        return Object.assign({}, e, { dateKey: entry[0] });
      });
    })
    .filter(function(e) {
      return e.dateKey >= toKey(year, month, 1) && e.dateKey <= toKey(year, month, 31);
    })
    .sort(function(a, b) { return a.dateKey.localeCompare(b.dateKey); });

  const monthEventCount = Object.entries(EVENT_DB)
    .filter(function(entry) {
      return entry[0] >= toKey(year, month, 1) && entry[0] <= toKey(year, month, 31);
    })
    .flatMap(function(entry) { return entry[1]; }).length;

  const filteredSearch = search.trim()
    ? Object.entries(EVENT_DB).flatMap(function(entry) {
        return entry[1].filter(function(e) { return e.label.toLowerCase().includes(search.toLowerCase()); }).map(function(e) {
          return Object.assign({}, e, { dateKey: entry[0] });
        });
      }).slice(0, 8)
    : null;

  const photoActivity = Object.entries(PHOTO_COUNTS)
    .filter(function(entry) {
      return entry[0] >= toKey(year, month, 1) && entry[0] <= toKey(year, month, 31);
    })
    .sort(function(a, b) { return b[1] - a[1]; })
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ background: 'transparent' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-3.5 flex items-center gap-3 flex-wrap" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div className="flex-1 min-w-0">
          <h1 className="text-gray-800 font-semibold">Calendar</h1>
          <p className="text-gray-500 text-xs">Family events, birthdays and memories</p>
        </div>
        <div className="relative hidden md:block">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"><path fillRule="evenodd" d="M9.965 11.026a5 5 0 111.06-1.06l2.755 2.754a.75.75 0 11-1.06 1.06l-2.755-2.754zM10.5 7a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" clipRule="evenodd"/></svg>
          <input value={search} onChange={function(e) { setSearch(e.target.value); }} placeholder="Search events..."
            className="rounded-xl pl-8 pr-3 py-2 text-gray-600 text-sm placeholder-gray-300 focus:outline-none w-48" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }} />
        </div>
        <div className="flex items-center gap-0.5 rounded-xl p-1" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
          {['month', 'week', 'agenda'].map(function(v) {
            return (
              <button key={v} onClick={function() { setViewMode(v); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${viewMode === v ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
                style={viewMode === v ? { background: 'linear-gradient(135deg, #5bbfbf, #4db6ac)', boxShadow: '0 2px 8px rgba(91,191,191,0.35)' } : {}}>
                {v}
              </button>
            );
          })}
        </div>
        <button onClick={function() { setShowAdd(true); }} className="btn-glass">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M8 2a.75.75 0 01.75.75V7.25h4.5a.75.75 0 010 1.5H8.75v4.5a.75.75 0 01-1.5 0V8.75H2.75a.75.75 0 010-1.5h4.5V2.75A.75.75 0 018 2z"/></svg>
          Add Event
        </button>
      </div>

      {showAdd ? <AddEventModal defaultDay={selectedDay} onClose={function() { setShowAdd(false); }} /> : null}

      {/* Search results */}
      {filteredSearch ? (
        <div className="px-6 pt-4">
          <div className="glass rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Results for "{search}"</p>
              <button onClick={function() { setSearch(''); }} className="text-gray-400 hover:text-gray-600 text-xs transition-colors">Clear</button>
            </div>
            {filteredSearch.length === 0
              ? <p className="text-gray-400 text-sm">No events found.</p>
              : (
                <div className="space-y-2">
                  {filteredSearch.map(function(ev) {
                    return (
                      <div key={ev.id} className={`flex items-center gap-3 px-3 py-2 rounded-xl border ${COLOR_BADGE[ev.color]}`}>
                        <span className="text-lg">{ev.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-tight">{ev.label}</p>
                          <p className="text-[10px] opacity-60">{formatDateKey(ev.dateKey)} · {ev.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            }
          </div>
        </div>
      ) : null}

      <div className="px-6 py-5 grid lg:grid-cols-3 gap-5">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Nav + filter row */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z" clipRule="evenodd"/></svg>
              </button>
              <h2 className="text-gray-800 font-semibold min-w-[150px] text-center">{MONTHS[month]} {year}</h2>
              <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
              </button>
              <button onClick={goToday} className="px-3 py-1.5 text-xs rounded-xl text-gray-500 hover:text-gray-700 transition-colors" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>Today</button>
            </div>
            <div className="flex gap-1 flex-wrap">
              {TYPE_FILTERS.map(function(f) {
                return (
                  <button key={f} onClick={function() { setFilter(f); }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-colors ${filter === f ? 'border-teal-500/40 text-teal-500 bg-teal-500/10' : 'border-gray-200 text-gray-400 hover:text-gray-600'}`}>
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          {viewMode === 'month' ? <MonthView year={year} month={month} selectedDay={selectedDay} onSelectDay={setSelectedDay} filter={filter} /> : null}
          {viewMode === 'week' ? <WeekView year={year} month={month} day={selectedDay} onSelectDay={setSelectedDay} filter={filter} /> : null}
          {viewMode === 'agenda' ? <AgendaView year={year} month={month} filter={filter} /> : null}

          {/* Day detail */}
          {selectedDay && viewMode !== 'agenda' ? (
          <div className="glass rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-800 font-semibold text-sm">{formatDateKey(selectedDay)}</h3>
              <div className="flex items-center gap-2">
                {selectedDay === todayKey() ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-500 border border-teal-500/25 font-semibold">Today</span>
                ) : null}
                <button onClick={function() { setShowAdd(true); }} className="text-teal-500 text-xs hover:text-teal-600 transition-colors">+ Add event</button>
              </div>
            </div>
            {selectedEvents.length === 0 && selectedPhotos === 0 ? (
              <p className="text-gray-400 text-sm py-2">No events this day.</p>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map(function(ev) { return <EventPill key={ev.id} ev={ev} compact={false} />; })}
                  {selectedPhotos > 0 ? (
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-300">
                      <span className="text-lg">📷</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{selectedPhotos} photos taken this day</p>
                        <button onClick={function() { setView('photos'); }} className="text-[11px] text-sky-400 hover:text-sky-300 transition-colors">View in Photos →</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : null}

          {/* On This Day */}
          <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(251,191,36,0.15)' }}>
            <div className="flex items-center gap-2 mb-3">
              <span>📅</span>
              <h3 className="text-amber-400 text-xs font-semibold uppercase tracking-wider">On This Day — Past Years</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                { year: 2025, emoji: '🌸', label: 'Maya planted her first flower garden', photos: 12 },
                { year: 2024, emoji: '🎉', label: "Jake's uni acceptance letter arrived", photos: 5 },
                { year: 2023, emoji: '🌿', label: 'Picnic in Legon Botanical Garden', photos: 18 },
                { year: 2022, emoji: '🐣', label: 'Easter egg hunt — first one!', photos: 27 },
              ].map(function(m, i) {
                return (
                  <button key={i} onClick={function() { setView('memories'); }}
                    className="flex items-start gap-2.5 text-left p-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
                    <span className="text-2xl">{m.emoji}</span>
                    <div>
                      <p className="text-gray-600 text-xs font-medium group-hover:text-gray-800 transition-colors">{m.label}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">{m.year} · {m.photos} photos</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <button onClick={function() { setView('memories'); }} className="text-amber-400 text-xs hover:text-amber-300 mt-2 block transition-colors">
              See full memory timeline →
            </button>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="glass rounded-xl p-3 text-center">
              <p className="text-teal-500 font-bold text-xl">{monthEventCount}</p>
              <p className="text-gray-400 text-[10px]">Events this month</p>
            </div>
            <div className="glass rounded-xl p-3 text-center">
              <p className="text-teal-500 font-bold text-xl">{birthdays.length}</p>
              <p className="text-gray-400 text-[10px]">Birthdays this month</p>
            </div>
          </div>

          {/* Upcoming */}
          <div className="glass rounded-2xl p-4">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Upcoming</h3>
            <div className="space-y-2.5">
              {upcoming.map(function(ev, i) {
                return (
                  <div key={i} className="flex items-start gap-2.5 group">
                    <div className={`w-1.5 h-1.5 rounded-full ${COLOR_DOT[ev.color]} mt-1.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-600 text-xs font-medium leading-tight group-hover:text-gray-800 transition-colors truncate">{ev.label}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">{formatDateKey(ev.dateKey)} · {ev.time}</p>
                    </div>
                    <span className="text-base shrink-0">{ev.icon}</span>
                  </div>
                );
              })}
            </div>
            <button onClick={function() { setViewMode('agenda'); }} className="text-teal-500 text-xs hover:text-teal-600 transition-colors mt-3 block">
              View full agenda →
            </button>
          </div>

          {/* Birthdays */}
          {birthdays.length > 0 ? (
            <div className="glass rounded-2xl p-4" style={{ border: '1px solid rgba(91,191,191,0.20)' }}>
              <div className="flex items-center gap-2 mb-3">
                <span>🎂</span>
                <h3 className="text-teal-500 text-xs font-semibold uppercase tracking-wider">Birthdays — {MONTHS[month]}</h3>
              </div>
              <div className="space-y-2.5">
                {birthdays.map(function(b, i) {
                  const dayNum = parseInt(b.dateKey.split('-')[2], 10);
                  const daysUntil = dayNum - now.getDate();
                  return (
                    <div key={i} className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full ${MEMBER_COLORS[b.who] || 'bg-white/20'} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {b.who[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-600 text-xs font-medium">{b.who}</p>
                        <p className="text-gray-400 text-[10px]">{MONTHS[month]} {dayNum}</p>
                      </div>
                      {daysUntil === 0
                        ? <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-500/15 text-teal-500 font-bold border border-teal-500/25">Today!</span>
                        : daysUntil > 0
                        ? <span className="text-[9px] text-gray-400">in {daysUntil}d</span>
                        : <span className="text-[9px] text-gray-300">passed</span>
                      }
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Photo activity */}
          <div className="glass rounded-2xl p-4">
            <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Photo Activity — {MONTHS[month]}</h3>
            <div className="space-y-2">
              {photoActivity.map(function(entry, i) {
                const dayNum = parseInt(entry[0].split('-')[2], 10);
                const pct = Math.round((entry[1] / 35) * 100);
                return (
                  <div key={i} className="flex items-center gap-2">
                    <button onClick={function() { setSelectedDay(entry[0]); }} className="text-gray-400 text-[10px] w-12 text-right hover:text-gray-600 transition-colors shrink-0">
                      {MONTHS[month].slice(0, 3)} {dayNum}
                    </button>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                      <div className="h-full bg-teal-400 rounded-full" style={{ width: pct + '%' }} />
                    </div>
                    <span className="text-gray-400 text-[10px] w-5 text-right shrink-0">{entry[1]}</span>
                  </div>
                );
              })}
            </div>
            <button onClick={function() { setView('photos'); }} className="text-teal-500 text-xs hover:text-teal-600 transition-colors mt-3 block">
              View all photos →
            </button>
          </div>

          {/* Quick add */}
          <button onClick={function() { setShowAdd(true); }}
            className="w-full py-3 rounded-2xl text-gray-300 hover:text-teal-500 text-sm transition-colors" style={{ border: '2px dashed rgba(0,0,0,0.10)' }}>
            + Add event
          </button>
        </div>
      </div>
    </div>
  );
}
