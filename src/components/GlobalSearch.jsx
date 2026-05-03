import { useState, useEffect, useRef } from 'react';

// ── Search index ─────────────────────────────────────────────────────────────
const PHOTOS = [
  { id:'p1',  label:"Maya's Birthday Party",     who:'Mom',     date:'May 10, 2026',  tags:['birthday','family'],            view:'photos' },
  { id:'p2',  label:'Beach Day — Ada Foah',       who:'Dad',     date:'Apr 20, 2026',  tags:['travel','outdoors'],            view:'photos' },
  { id:'p3',  label:"Emma's Piano Recital",       who:'Mom',     date:'Apr 27, 2026',  tags:['milestone','kids'],             view:'photos' },
  { id:'p4',  label:'Easter Egg Hunt',            who:'Dad',     date:'Mar 29, 2026',  tags:['holiday','kids'],               view:'photos' },
  { id:'p5',  label:"Valentine's Dinner",         who:'Mom',     date:'Feb 14, 2026',  tags:['celebration','family'],        view:'photos' },
  { id:'p6',  label:"Jake's Graduation Ceremony", who:'Grandma', date:'May 22, 2025',  tags:['milestone'],                    view:'photos' },
  { id:'p7',  label:'Christmas Morning',          who:'Grandma', date:'Dec 25, 2025',  tags:['holiday','family'],             view:'photos' },
  { id:'p8',  label:'Hiking Trip — Mt. Legon',    who:'Dad',     date:'May 1, 2026',   tags:['outdoors'],                     view:'photos' },
  { id:'p9',  label:"Mom's 40th Birthday",        who:'Dad',     date:'Mar 3, 2025',   tags:['birthday','milestone'],         view:'photos' },
  { id:'p10', label:'Backyard Summer BBQ',         who:'Dad',     date:'Jul 4, 2025',   tags:['food','family'],                view:'photos' },
];

const EVENTS = [
  { id:'e1',  label:"Emma's Piano Recital",     date:'May 3, 2026',  who:'Emma',   type:'event',     view:'calendar' },
  { id:'e2',  label:"Mother's Day",             date:'May 8, 2026',  who:'Family', type:'birthday',  view:'calendar' },
  { id:'e3',  label:"Maya's 8th Birthday",      date:'May 10, 2026', who:'Maya',   type:'birthday',  view:'calendar' },
  { id:'e4',  label:"Family BBQ at Grandma's",  date:'May 15, 2026', who:'Family', type:'event',     view:'calendar' },
  { id:'e5',  label:"Grandma's Birthday",       date:'May 19, 2026', who:'Grandma',type:'birthday',  view:'calendar' },
  { id:'e6',  label:"Jake's Graduation",        date:'May 22, 2026', who:'Jake',   type:'milestone', view:'calendar' },
  { id:'e7',  label:'Hiking Trip — Mt. Legon',  date:'May 29, 2026', who:'Dad',    type:'event',     view:'calendar' },
  { id:'e8',  label:"Dad's Birthday",           date:'Jun 1, 2026',  who:'Dad',    type:'birthday',  view:'calendar' },
];

const TASKS = [
  { id:'t1',  label:'Take out trash',     who:'Jake',    cat:'Chores',   view:'tasks' },
  { id:'t2',  label:'Wash dishes',        who:'Emma',    cat:'Chores',   view:'tasks' },
  { id:'t3',  label:'Walk the dog',       who:'Jake',    cat:'Chores',   view:'tasks' },
  { id:'t4',  label:'Math homework',      who:'Emma',    cat:'Homework', view:'tasks' },
  { id:'t5',  label:'Science project',    who:'Emma',    cat:'Homework', view:'tasks' },
  { id:'t6',  label:'Practice piano',     who:'Emma',    cat:'Personal', view:'tasks' },
  { id:'t7',  label:'Call Grandma',       who:'Harriet', cat:'Personal', view:'tasks' },
  { id:'t8',  label:'Morning workout',    who:'Dad',     cat:'Personal', view:'tasks' },
];

const LIST_ITEMS = [
  { id:'l1',  label:'Milk',                    list:'Grocery',          view:'lists' },
  { id:'l2',  label:'Eggs',                    list:'Grocery',          view:'lists' },
  { id:'l3',  label:'Chicken breast',          list:'Grocery',          view:'lists' },
  { id:'l4',  label:'Book dentist appointment',list:'To-Do',            view:'lists' },
  { id:'l5',  label:'Oil change for car',      list:'To-Do',            view:'lists' },
  { id:'l6',  label:'Passports',               list:'Vacation Packing', view:'lists' },
  { id:'l7',  label:'Scientific calculator',   list:'School Supplies',  view:'lists' },
];

const MEMBERS = [
  { id:'m1', label:'Harriet A.', sub:'Owner',  view:'family' },
  { id:'m2', label:'Dad',        sub:'Member', view:'family' },
  { id:'m3', label:'Mom',        sub:'Member', view:'family' },
  { id:'m4', label:'Emma',       sub:'Member', view:'family' },
  { id:'m5', label:'Jake',       sub:'Member', view:'family' },
  { id:'m6', label:'Grandma',    sub:'Member', view:'family' },
];

const SECTIONS = [
  { key: 'photos',   label: 'Photos',        icon: '📷', items: PHOTOS,    getSecondary: i => `${i.who} · ${i.date}` },
  { key: 'events',   label: 'Events',        icon: '📅', items: EVENTS,    getSecondary: i => `${i.date} · ${i.who}` },
  { key: 'tasks',    label: 'Tasks',         icon: '✅', items: TASKS,     getSecondary: i => `${i.cat} · ${i.who}` },
  { key: 'lists',    label: 'Lists',         icon: '🛒', items: LIST_ITEMS, getSecondary: i => i.list },
  { key: 'members',  label: 'Family',        icon: '👤', items: MEMBERS,   getSecondary: i => i.sub },
];

function score(item, q) {
  const text = item.label.toLowerCase();
  const sub  = (item.who || item.list || item.sub || '').toLowerCase();
  const tags = (item.tags || []).join(' ').toLowerCase();
  if (text.startsWith(q)) return 3;
  if (text.includes(q))  return 2;
  if (sub.includes(q) || tags.includes(q)) return 1;
  return 0;
}

export default function GlobalSearch({ onClose, setView }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const [cursor, setCursor] = useState(0);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const q = query.trim().toLowerCase();

  const results = q.length < 1 ? [] : SECTIONS.flatMap(sec =>
    sec.items
      .map(item => ({ ...item, _sec: sec, _score: score(item, q) }))
      .filter(item => item._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 4)
  );

  // group results by section
  const grouped = SECTIONS.map(sec => ({
    ...sec,
    hits: results.filter(r => r._sec.key === sec.key),
  })).filter(g => g.hits.length > 0);

  const flat = grouped.flatMap(g => g.hits);

  useEffect(() => { setCursor(0); }, [query]);

  function navigate(item) {
    setView(item._sec.key === 'lists' || item._sec.key === 'members' ? item.view : item._sec.key);
    onClose();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, flat.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); }
    if (e.key === 'Enter' && flat[cursor]) { navigate(flat[cursor]); }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl" style={{ background: '#ffffff', border: '1px solid #e2ecf0' }}>

        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: '1px solid #e8ecf0' }}>
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-gray-400 shrink-0">
            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 111.06-1.06l2.755 2.754a.75.75 0 11-1.06 1.06l-2.755-2.754zM10.5 7a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" clipRule="evenodd"/>
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search photos, events, tasks, lists…"
            className="flex-1 text-gray-800 text-sm placeholder-gray-300 bg-transparent focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-gray-300 hover:text-gray-500 transition-colors shrink-0">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
            </button>
          )}
          <kbd className="hidden sm:block text-[10px] text-gray-300 border border-gray-200 rounded px-1.5 py-0.5 font-mono shrink-0">esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
          {q.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-400 text-sm">Start typing to search across your family's content</p>
              <div className="flex items-center justify-center gap-4 mt-4 flex-wrap">
                {SECTIONS.map(s => (
                  <button key={s.key} onClick={() => { setView(s.key === 'members' ? 'family' : s.key); onClose(); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors border border-gray-100">
                    <span>{s.icon}</span>{s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {q.length > 0 && flat.length === 0 && (
            <div className="px-4 py-10 text-center">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-gray-400 text-sm">No results for "<span className="text-gray-600">{query}</span>"</p>
            </div>
          )}

          {grouped.map(group => (
            <div key={group.key}>
              <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                <span className="text-sm">{group.icon}</span>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.label}</p>
              </div>
              {group.hits.map(item => {
                const idx = flat.indexOf(item);
                const active = idx === cursor;
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item)}
                    onMouseEnter={() => setCursor(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${active ? 'bg-teal-50' : 'hover:bg-gray-50'}`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${active ? 'bg-teal-100' : 'bg-gray-100'}`}>
                      {group.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${active ? 'text-teal-700' : 'text-gray-700'}`}>{item.label}</p>
                      <p className="text-gray-400 text-[10px] truncate">{group.getSecondary(item)}</p>
                    </div>
                    {active && (
                      <kbd className="text-[10px] text-teal-400 border border-teal-200 rounded px-1.5 py-0.5 font-mono shrink-0">↵</kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {flat.length > 0 && (
            <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: '1px solid #f0f4f8' }}>
              <div className="flex items-center gap-3 text-[10px] text-gray-300">
                <span><kbd className="border border-gray-200 rounded px-1 font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="border border-gray-200 rounded px-1 font-mono">↵</kbd> open</span>
                <span><kbd className="border border-gray-200 rounded px-1 font-mono">esc</kbd> close</span>
              </div>
              <p className="text-[10px] text-gray-300">{flat.length} result{flat.length !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
