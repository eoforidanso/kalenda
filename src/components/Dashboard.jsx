import { useState, useEffect, useRef } from 'react';

// Family member color system (like Cozi)
const FAMILY = [
  { name: 'Harriet', initial: 'H', color: '#f472b6', bg: 'from-pink-400 to-rose-500' },
  { name: 'Dad',     initial: 'D', color: '#38bdf8', bg: 'from-sky-400 to-blue-500' },
  { name: 'Mom',     initial: 'M', color: '#fb7185', bg: 'from-rose-400 to-pink-500' },
  { name: 'Emma',    initial: 'E', color: '#34d399', bg: 'from-emerald-400 to-teal-500' },
  { name: 'Jake',    initial: 'J', color: '#fbbf24', bg: 'from-amber-400 to-orange-500' },
  { name: 'Grandma', initial: 'G', color: '#a78bfa', bg: 'from-violet-400 to-purple-500' },
];

// Today's schedule per member (color-coded like Cozi)
const todaySchedule = [
  { time: '8:00 AM',  label: 'School Drop-off',     who: 'Dad',     duration: '30m' },
  { time: '9:30 AM',  label: 'Yoga Class',           who: 'Mom',     duration: '1h' },
  { time: '10:00 AM', label: 'Dentist Appt.',        who: 'Emma',    duration: '45m' },
  { time: '12:00 PM', label: 'Lunch w/ Grandma',     who: 'Harriet', duration: '1h' },
  { time: '3:30 PM',  label: 'Soccer Practice',      who: 'Jake',    duration: '1.5h' },
  { time: '5:00 PM',  label: 'Piano Lesson',         who: 'Emma',    duration: '45m' },
  { time: '7:00 PM',  label: 'Family Dinner',        who: 'All',     duration: '1h' },
];

// Chores
const initialChores = [
  { id: 1, label: 'Take out trash',     who: 'Jake',    done: false, icon: '🗑️' },
  { id: 2, label: 'Wash dishes',        who: 'Emma',    done: true,  icon: '🍽️' },
  { id: 3, label: 'Walk the dog',       who: 'Jake',    done: false, icon: '🐕' },
  { id: 4, label: 'Vacuum living room', who: 'Harriet', done: false, icon: '🧹' },
  { id: 5, label: 'Set dinner table',   who: 'Emma',    done: false, icon: '🍴' },
];

// Shopping list
const initialList = [
  { id: 1, label: 'Milk',           done: false, cat: '🥛' },
  { id: 2, label: 'Bread',          done: true,  cat: '🍞' },
  { id: 3, label: 'Eggs (12)',       done: false, cat: '🥚' },
  { id: 4, label: 'Chicken breast',  done: false, cat: '🍗' },
  { id: 5, label: 'Broccoli',        done: true,  cat: '🥦' },
  { id: 6, label: 'Orange juice',    done: false, cat: '🍊' },
];

// Meals
const meals = {
  breakfast: { label: 'Avocado Toast & Eggs',  icon: '🥑' },
  lunch:     { label: 'Caesar Salad Wraps',    icon: '🌯' },
  dinner:    { label: 'Grilled Salmon + Rice', icon: '🐟' },
};

// Upcoming events
const upcomingEvents = [
  { date: 'May 3',  label: "Emma's Piano Recital", icon: '🎹', who: 'Emma', isBirthday: false },
  { date: 'May 8',  label: "Mother's Day",          icon: '💐', who: 'Mom',  isBirthday: false },
  { date: 'May 10', label: "Jake's Birthday 🎂",    icon: '🎂', who: 'Jake', isBirthday: true  },
  { date: 'May 15', label: 'Family BBQ',            icon: '🍖', who: 'All',  isBirthday: false },
];

const MONTH_MAP = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
function daysFromToday(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [mon, day] = dateStr.split(' ');
  const target = new Date(today.getFullYear(), MONTH_MAP[mon], parseInt(day));
  if (target < today) target.setFullYear(today.getFullYear() + 1);
  return Math.round((target - today) / 86400000);
}

// On This Day memories
const onThisDay = [
  { year: 2024, emoji: '🎂', label: "Maya's 6th birthday", photos: 14 },
  { year: 2023, emoji: '🌸', label: 'Cherry blossom walk',  photos: 8  },
  { year: 2022, emoji: '🐣', label: 'Easter egg hunt',      photos: 22 },
];

const activity = [
  { who: 'Dad',     avatar: 'bg-sky-400',     action: 'shared a photo', photo: '🌊', time: '2m ago',  unread: true  },
  { who: 'Mom',     avatar: 'bg-rose-400',    action: 'shared a photo', photo: '🌸', time: '18m ago', unread: true  },
  { who: 'Emma',    avatar: 'bg-emerald-400', action: 'shared 3 photos', photo: '🎂', time: '1h ago',  unread: false },
  { who: 'Grandma', avatar: 'bg-violet-400',  action: 'reacted ❤️',     photo: '',   time: '2h ago',  unread: false },
];

function getMemberColor(name) {
  return FAMILY.find(f => f.name === name)?.color || '#a78bfa';
}
function getMemberBg(name) {
  return FAMILY.find(f => f.name === name)?.bg || 'from-violet-400 to-purple-500';
}

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="text-right">
      <p className="text-gray-800 font-mono text-sm tracking-widest">{now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
      <p className="text-gray-400 text-xs">{now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}</p>
    </div>
  );
}

function WeatherWidget() {
  return (
    <div className="flex items-center gap-3 rounded-xl px-4 py-2.5" style={{ background: 'rgba(91,191,191,0.08)', border: '1px solid rgba(91,191,191,0.20)' }}>
      <span className="text-2xl">⛅</span>
      <div>
        <p className="text-gray-800 text-sm font-semibold">72°F · Partly Cloudy</p>
        <p className="text-gray-400 text-xs">Accra, Ghana</p>
      </div>
    </div>
  );
}

function Photo3D({ p }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setTilt({ x: ((e.clientY - cy) / (rect.height / 2)) * -10, y: ((e.clientX - cx) / (rect.width / 2)) * 10 });
    setShine({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  }
  function handleMouseLeave() { setTilt({ x: 0, y: 0 }); setShine({ x: 50, y: 50 }); }
  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective: '700px' }}>
      <div className={`aspect-square rounded-2xl bg-gradient-to-br ${p.bg} relative group cursor-pointer overflow-hidden`}
        style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transition: 'transform 0.12s ease', transformStyle: 'preserve-3d', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100" style={{ background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.18) 0%, transparent 65%)` }} />
        <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">{p.emoji}</div>
        <div className="absolute inset-0 flex items-end p-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }}>
          <div><p className="text-white text-[10px] font-semibold">{p.label}</p><p className="text-white/50 text-[9px]">{p.who}</p></div>
        </div>
        <div className="absolute inset-0 rounded-2xl" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  );
}

const recentPhotos = [
  { bg: 'from-rose-800 via-pink-700 to-orange-700',     emoji: '🌸', label: "Maya's Birthday", who: 'Mom' },
  { bg: 'from-sky-800 via-blue-700 to-indigo-800',      emoji: '🌊', label: 'Beach Day',        who: 'Dad' },
  { bg: 'from-emerald-800 via-teal-700 to-green-800',   emoji: '🌿', label: 'Forest Hike',      who: 'Emma' },
  { bg: 'from-violet-800 via-purple-700 to-fuchsia-800',emoji: '🎉', label: 'Anniversary',      who: 'Dad' },
  { bg: 'from-amber-800 via-orange-700 to-red-800',     emoji: '🍂', label: 'Fall Trip',         who: 'Jake' },
  { bg: 'from-cyan-800 via-sky-700 to-blue-800',        emoji: '❄️', label: 'Winter Walk',      who: 'Grandma' },
];

export default function Dashboard({ setView }) {
  const [chores, setChores] = useState(initialChores);
  const [shopList, setShopList] = useState(initialList);
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredSchedule = activeFilter === 'All'
    ? todaySchedule
    : todaySchedule.filter(e => e.who === activeFilter || e.who === 'All');

  const choresDone = chores.filter(c => c.done).length;
  const shopDone = shopList.filter(s => s.done).length;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0" style={{ background: 'transparent' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 px-4 md:px-6 py-5 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold">Today</h1>
          <p className="text-gray-500 text-xs">Good morning, Harriet 👋 · Your family’s command center</p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block"><WeatherWidget /></div>
          <LiveClock />
        </div>
      </div>

      <div className="px-4 md:px-6 py-8 space-y-10">

        {/* Family member filter bar — like Cozi color coding */}
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Family Members</h2>
            <button onClick={() => setView('family')} className="text-teal-500 text-xs hover:text-teal-600 transition-colors">Manage →</button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            <button
              onClick={() => setActiveFilter('All')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${activeFilter === 'All' ? 'text-white' : 'text-gray-500 hover:text-gray-700'}`}
              style={activeFilter === 'All' ? { background: 'linear-gradient(135deg, #5bbfbf, #4db6ac)', boxShadow: '0 2px 10px rgba(91,191,191,0.35)' } : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <span>👨‍👩‍👧‍👦</span> All
            </button>
            {FAMILY.map(m => (
              <button
                key={m.name}
                onClick={() => setActiveFilter(m.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${activeFilter === m.name ? '' : 'text-gray-500 hover:text-gray-700'}`}
                style={activeFilter === m.name
                  ? { background: m.color + '22', border: `1px solid ${m.color}44`, boxShadow: `0 2px 12px ${m.color}30`, color: m.color }
                  : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <span className={`w-4 h-4 rounded-full bg-gradient-to-br ${m.bg} inline-block`} />
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* TODAY'S SCHEDULE — color-coded by member (Cozi style) */}
          <div className="lg:col-span-2 glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-gray-800 font-semibold text-sm">Today's Schedule</h2>
              <button onClick={() => setView('calendar')} className="text-teal-500 text-xs hover:text-teal-600 transition-colors">Full Calendar →</button>
            </div>
            {filteredSchedule.length === 0 ? (
              <p className="text-gray-400 text-sm py-4 text-center">No events for {activeFilter} today.</p>
            ) : (
              <div className="space-y-2.5">
                {filteredSchedule.map((ev, i) => {
                  const color = ev.who === 'All' ? '#a78bfa' : getMemberColor(ev.who);
                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors hover:bg-gray-50" style={{ borderLeft: `3px solid ${color}` }}>
                      <div className="w-20 shrink-0">
                        <p className="text-gray-400 text-xs font-mono">{ev.time}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 text-sm font-semibold truncate">{ev.label}</p>
                        <p className="text-gray-400 text-xs mt-0.5">{ev.duration}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {ev.who === 'All' ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(91,191,191,0.15)', color: '#4db6ac', border: '1px solid rgba(91,191,191,0.30)' }}>All</span>
                        ) : (
                          <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${getMemberBg(ev.who)} flex items-center justify-center text-white text-[9px] font-bold`}>
                            {ev.who[0]}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <button onClick={() => setView('calendar')} className="mt-3 w-full py-2 text-xs text-gray-300 hover:text-teal-500 rounded-xl transition-colors" style={{ border: '1px dashed rgba(0,0,0,0.10)' }}>
              + Add event
            </button>
          </div>

          {/* Right column */}
          <div className="space-y-5">

            {/* MEAL PLAN (Skylight / Cozi style) */}
            <div className="glass rounded-3xl p-5" style={{ border: '1px solid rgba(251,191,36,0.15)' }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-amber-500 text-xs font-semibold uppercase tracking-wider">🍽️ Today's Meals</h3>
                <button onClick={() => setView('aistudio')} className="text-amber-400 text-[10px] hover:text-amber-500 transition-colors">AI Plan →</button>
              </div>
              <div className="space-y-2.5">
                {[['Breakfast', meals.breakfast], ['Lunch', meals.lunch], ['Dinner', meals.dinner]].map(([label, m]) => (
                  <div key={label} className="flex items-center gap-3 px-3.5 py-3 rounded-2xl" style={{ background: 'rgba(251,191,36,0.06)' }}>
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider">{label}</p>
                      <p className="text-gray-700 text-xs font-medium">{m.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UPCOMING BIRTHDAYS */}
            <div className="glass rounded-3xl p-5" style={{ border: '1px solid rgba(91,191,191,0.20)' }}>
              <h3 className="text-teal-500 text-xs font-semibold uppercase tracking-wider mb-4">🎂 Coming Up</h3>
              <div className="space-y-3">
                {upcomingEvents.map((e, i) => {
                  const color = e.who === 'All' ? '#a78bfa' : getMemberColor(e.who);
                  return (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="text-base shrink-0">{e.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-600 text-xs font-medium truncate">{e.label}</p>
                        <p className="text-gray-400 text-[10px]">{e.date}</p>
                      </div>
                      <span className="text-[10px] font-semibold shrink-0" style={{ color }}>
                        {daysFromToday(e.date) === 0 ? 'Today!' : `${daysFromToday(e.date)}d`}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setView('calendar')} className="text-teal-500 text-[11px] hover:text-teal-600 mt-3 block transition-colors">Full calendar →</button>
            </div>
          </div>
        </div>

        {/* CHORES + SHOPPING — side by side (Skylight style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Chores */}
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-gray-800 font-semibold">Chores & Tasks</h2>
                <p className="text-gray-400 text-xs mt-0.5">{choresDone}/{chores.length} done today</p>
              </div>
              <button onClick={() => setView('tasks')} className="text-teal-500 text-xs hover:text-teal-600 transition-colors">All tasks →</button>
            </div>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(choresDone / chores.length) * 100}%`, background: 'linear-gradient(90deg, #5bbfbf, #34d399)' }} />
            </div>
            <div className="space-y-2.5">
              {chores.map(c => {
                const color = getMemberColor(c.who);
                return (
                  <div key={c.id}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-colors hover:bg-gray-50"
                    onClick={() => setChores(prev => prev.map(x => x.id === c.id ? { ...x, done: !x.done } : x))}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all`}
                      style={{ borderColor: c.done ? color : 'rgba(0,0,0,0.15)', background: c.done ? color + '25' : 'transparent' }}>
                      {c.done && <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span className="text-base shrink-0">{c.icon}</span>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm transition-all ${c.done ? 'text-gray-300 line-through' : 'text-gray-700'}`}>{c.label}</p>
                    </div>
                    <span className={`w-5 h-5 rounded-full bg-gradient-to-br ${getMemberBg(c.who)} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                      {c.who[0]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shopping list */}
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-gray-800 font-semibold">Shopping List</h2>
                <p className="text-gray-400 text-xs mt-0.5">{shopDone}/{shopList.length} checked off</p>
              </div>
              <button onClick={() => setView('lists')} className="text-teal-500 text-xs hover:text-teal-600 transition-colors">All lists →</button>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(shopDone / shopList.length) * 100}%`, background: 'linear-gradient(90deg, #5bbfbf, #6ee7b7)' }} />
            </div>
            <div className="space-y-2.5">
              {shopList.map(s => (
                <div key={s.id}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => setShopList(prev => prev.map(x => x.id === s.id ? { ...x, done: !x.done } : x))}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all`}
                    style={{ borderColor: s.done ? '#5bbfbf' : 'rgba(0,0,0,0.15)', background: s.done ? 'rgba(91,191,191,0.18)' : 'transparent' }}>
                    {s.done && <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#5bbfbf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className="text-base shrink-0">{s.cat}</span>
                  <p className={`flex-1 text-sm transition-all ${s.done ? 'text-gray-300 line-through' : 'text-gray-700'}`}>{s.label}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setView('lists')} className="mt-4 w-full py-2.5 text-xs text-gray-300 hover:text-teal-500 rounded-2xl transition-colors" style={{ border: '1px dashed rgba(0,0,0,0.10)' }}>
              + Add item
            </button>
          </div>
        </div>

        {/* Bottom row: On This Day + Recent Photos + Activity */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* On This Day */}
          <div className="glass rounded-3xl p-5" style={{ border: '1px solid rgba(251,191,36,0.18)' }}>
            <div className="flex items-center gap-2 mb-4">
              <span>📅</span>
              <h3 className="text-amber-400 text-xs font-semibold uppercase tracking-wider">On This Day</h3>
            </div>
            <div className="space-y-3">
              {onThisDay.map((m, i) => (
                <button key={i} onClick={() => setView('memories')} className="w-full flex items-start gap-3 rounded-2xl px-3 py-2.5 hover:bg-gray-50 transition-colors text-left">
                  <span className="text-xl mt-0.5">{m.emoji}</span>
                  <div>
                    <p className="text-gray-600 text-xs font-medium">{m.label}</p>
                    <p className="text-gray-400 text-[10px]">{m.year} · {m.photos} photos</p>
                  </div>
                </button>
              ))}
              <button onClick={() => setView('memories')} className="text-amber-400 text-[11px] hover:text-amber-300 transition-colors">See all memories →</button>
            </div>
          </div>

          {/* Recent Photos */}
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Recent Photos</h3>
              <button onClick={() => setView('photos')} className="text-teal-500 text-xs hover:text-teal-600 transition-colors">View all →</button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {recentPhotos.map((p, i) => <Photo3D key={i} p={p} />)}
            </div>
          </div>

          {/* Family Activity */}
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Family Activity</h3>
              <button onClick={() => setView('notifications')} className="text-teal-500 text-xs hover:text-teal-600 transition-colors">All →</button>
            </div>
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-2xl ${a.unread ? '' : 'hover:bg-gray-50'} transition-colors`}
                  style={a.unread ? { background: 'rgba(91,191,191,0.08)', border: '1px solid rgba(91,191,191,0.20)' } : {}}>
                  <div className={`w-7 h-7 rounded-full ${a.avatar} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>{a.who[0]}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-600 text-xs"><span className="text-gray-800 font-medium">{a.who}</span> {a.action} {a.photo}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{a.time}</p>
                  </div>
                  {a.unread && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
