import { useState } from 'react';

const FAMILY = [
  { name: 'Harriet', initial: 'H', color: '#f472b6', bg: 'from-pink-400 to-rose-500' },
  { name: 'Dad',     initial: 'D', color: '#38bdf8', bg: 'from-sky-400 to-blue-500' },
  { name: 'Mom',     initial: 'M', color: '#fb7185', bg: 'from-rose-400 to-pink-500' },
  { name: 'Emma',    initial: 'E', color: '#34d399', bg: 'from-emerald-400 to-teal-500' },
  { name: 'Jake',    initial: 'J', color: '#fbbf24', bg: 'from-amber-400 to-orange-500' },
  { name: 'Grandma', initial: 'G', color: '#a78bfa', bg: 'from-violet-400 to-purple-500' },
];

const REWARD_TARGETS = { Jake: 10, Emma: 8, Harriet: 5, Dad: 0, Mom: 0, Grandma: 0 };

const initialTasks = [
  // Daily chores
  { id: 1,  label: 'Take out trash',       who: 'Jake',    done: false, stars: 2, cat: 'Chores',   icon: '🗑️',  recurring: 'Daily'   },
  { id: 2,  label: 'Wash dishes',          who: 'Emma',    done: true,  stars: 1, cat: 'Chores',   icon: '🍽️',  recurring: 'Daily'   },
  { id: 3,  label: 'Walk the dog',         who: 'Jake',    done: false, stars: 3, cat: 'Chores',   icon: '🐕',  recurring: 'Daily'   },
  { id: 4,  label: 'Vacuum living room',   who: 'Harriet', done: false, stars: 2, cat: 'Chores',   icon: '🧹',  recurring: 'Weekly'  },
  { id: 5,  label: 'Set dinner table',     who: 'Emma',    done: false, stars: 1, cat: 'Chores',   icon: '🍴',  recurring: 'Daily'   },
  { id: 6,  label: 'Clean bathroom',       who: 'Harriet', done: true,  stars: 3, cat: 'Chores',   icon: '🚿',  recurring: 'Weekly'  },
  // Homework
  { id: 7,  label: 'Math homework',        who: 'Emma',    done: false, stars: 2, cat: 'Homework', icon: '📐',  recurring: null      },
  { id: 8,  label: 'Read 20 minutes',      who: 'Jake',    done: true,  stars: 1, cat: 'Homework', icon: '📚',  recurring: 'Daily'   },
  { id: 9,  label: 'Science project',      who: 'Emma',    done: false, stars: 4, cat: 'Homework', icon: '🔬',  recurring: null      },
  // Personal
  { id: 10, label: 'Practice piano',       who: 'Emma',    done: false, stars: 2, cat: 'Personal', icon: '🎹',  recurring: 'Daily'   },
  { id: 11, label: 'Morning workout',      who: 'Dad',     done: true,  stars: 0, cat: 'Personal', icon: '💪',  recurring: 'Daily'   },
  { id: 12, label: 'Call Grandma',         who: 'Harriet', done: false, stars: 0, cat: 'Personal', icon: '📞',  recurring: 'Weekly'  },
];

const REWARDS = [
  { who: 'Jake',  reward: '🎮 Extra 1hr screen time', target: 10, earned: 7 },
  { who: 'Emma',  reward: '🍦 Ice cream trip',         target: 8,  earned: 5 },
];

function getMember(name) { return FAMILY.find(f => f.name === name) || FAMILY[0]; }

function StarBadge({ count }) {
  if (!count) return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} viewBox="0 0 12 12" fill="#fbbf24" className="w-2.5 h-2.5">
          <path d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.1L6 8.02 3.22 9.56l.53-3.1L1.5 4.27l3.11-.45z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Tasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState('All');
  const [catFilter, setCatFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ label: '', who: 'Jake', stars: 1, cat: 'Chores', icon: '✅', recurring: null });

  const members = filter === 'All' ? FAMILY.map(f => f.name) : [filter];
  const cats = ['All', 'Chores', 'Homework', 'Personal'];

  const filtered = tasks
    .filter(t => filter === 'All' || t.who === filter)
    .filter(t => catFilter === 'All' || t.cat === catFilter);

  const grouped = cats.slice(1).reduce((acc, cat) => {
    const items = filtered.filter(t => t.cat === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  function toggle(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  function addTask() {
    if (!newTask.label.trim()) return;
    setTasks(prev => [...prev, { ...newTask, id: Date.now(), done: false }]);
    setNewTask({ label: '', who: 'Jake', stars: 1, cat: 'Chores', icon: '✅', recurring: null });
    setShowAdd(false);
  }

  // Stars earned per person today
  const starsToday = FAMILY.reduce((acc, m) => {
    acc[m.name] = tasks.filter(t => t.who === m.name && t.done).reduce((s, t) => s + t.stars, 0);
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ background: 'transparent' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 px-4 md:px-6 py-3.5 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold">Chores & Tasks</h1>
          <p className="text-gray-500 text-xs">{tasks.filter(t => t.done).length}/{tasks.length} completed today</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-glass">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M8 2a.75.75 0 01.75.75V7.25h4.5a.75.75 0 010 1.5H8.75v4.5a.75.75 0 01-1.5 0V8.75H2.75a.75.75 0 010-1.5h4.5V2.75A.75.75 0 018 2z"/></svg>
          Add Task
        </button>
      </div>

      <div className="px-4 md:px-6 py-5 space-y-5">

        {/* Reward tracker — Skylight star system */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-gray-800 font-semibold text-sm mb-4">⭐ Star Rewards</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {REWARDS.map((r, i) => {
              const m = getMember(r.who);
              const earned = starsToday[r.who] || 0;
              const total = r.earned + earned;
              const pct = Math.min((total / r.target) * 100, 100);
              return (
                <div key={i} className="rounded-xl p-4" style={{ background: `${m.color}10`, border: `1px solid ${m.color}25` }}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.bg} flex items-center justify-center text-white text-sm font-bold`}>{m.initial}</div>
                    <div>
                      <p className="text-gray-800 font-medium text-sm">{r.who}</p>
                      <p className="text-gray-400 text-xs">Reward: {r.reward}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="font-bold text-sm" style={{ color: m.color }}>{total}<span className="text-gray-400">/{r.target} ⭐</span></p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${m.color}, ${m.color}aa)` }} />
                  </div>
                  {pct >= 100 && (
                    <p className="text-xs mt-2 font-semibold" style={{ color: m.color }}>🎉 Reward unlocked!</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Member filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button onClick={() => setFilter('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === 'All' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
              style={filter === 'All' ? { background: 'linear-gradient(135deg,#5bbfbf,#4db6ac)', boxShadow: '0 2px 10px rgba(91,191,191,0.35)' } : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
              All
            </button>
            {FAMILY.map(m => (
              <button key={m.name} onClick={() => setFilter(m.name)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === m.name ? '' : 'text-gray-500 hover:text-gray-700'}`}
                style={filter === m.name ? { background: m.color + '18', border: `1px solid ${m.color}35`, color: m.color } : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${m.bg} inline-block`} />{m.name}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-gray-200" />
          {cats.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${catFilter === c ? 'text-teal-600 bg-teal-50' : 'text-gray-400 hover:text-gray-600'}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Task groups */}
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat} className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #e8ecf0' }}>
              <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider">{cat}</h3>
              <p className="text-gray-400 text-xs">{items.filter(t => t.done).length}/{items.length}</p>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              {items.map(t => {
                const m = getMember(t.who);
                return (
                  <div key={t.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => toggle(t.id)}>
                    {/* Checkbox */}
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all`}
                      style={{ borderColor: t.done ? m.color : 'rgba(0,0,0,0.15)', background: t.done ? m.color + '25' : 'transparent' }}>
                      {t.done && <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke={m.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="text-lg shrink-0">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm transition-all ${t.done ? 'text-gray-300 line-through' : 'text-gray-700'}`}>{t.label}</p>
                        <StarBadge count={t.stars} />
                      </div>
                      {t.recurring && <p className="text-gray-400 text-[10px] mt-0.5">🔁 {t.recurring}</p>}
                    </div>
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${m.bg} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{m.initial}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="glass rounded-2xl p-10 text-center">
            <p className="text-gray-400 text-sm">No tasks found.</p>
          </div>
        )}
      </div>

      {/* Add task modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: '#ffffff', border: '1px solid #e2ecf0', boxShadow: '0 24px 80px rgba(0,0,0,0.15)' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-800 font-semibold">New Task</h2>
              <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 transition-colors">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Task name</label>
                <input value={newTask.label} onChange={e => setNewTask(p => ({ ...p, label: e.target.value }))}
                  placeholder="e.g. Clean bedroom" autoFocus
                  className="w-full rounded-xl px-3 py-2.5 text-gray-700 text-sm placeholder-gray-300 focus:outline-none" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Assign to</label>
                  <select value={newTask.who} onChange={e => setNewTask(p => ({ ...p, who: e.target.value }))}
                    className="w-full rounded-xl px-3 py-2.5 text-gray-700 text-sm focus:outline-none appearance-none" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }}>
                    {FAMILY.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1.5 block">Category</label>
                  <select value={newTask.cat} onChange={e => setNewTask(p => ({ ...p, cat: e.target.value }))}
                    className="w-full rounded-xl px-3 py-2.5 text-gray-700 text-sm focus:outline-none appearance-none" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }}>
                    <option>Chores</option><option>Homework</option><option>Personal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Stars ⭐ (reward value)</label>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setNewTask(p => ({ ...p, stars: n }))}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${newTask.stars === n ? 'text-amber-600' : 'text-gray-400'}`}
                      style={newTask.stars === n ? { background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)' } : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={addTask} className="btn-glass w-full justify-center mt-1">Add Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
