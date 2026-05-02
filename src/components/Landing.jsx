import { useState, useEffect } from 'react';

// ── FRAME MOCKUP ──────────────────────────────────────────────
const frameSlides = [
  { bg: 'from-rose-500 via-pink-500 to-orange-400',     emoji: '🌸', label: "Maya's 6th Birthday", who: 'Mom · 2 yrs ago' },
  { bg: 'from-sky-500 via-blue-500 to-indigo-500',      emoji: '🌊', label: 'Beach Day, Cape Coast',  who: 'Dad · last summer' },
  { bg: 'from-emerald-500 via-teal-500 to-cyan-500',    emoji: '🌿', label: 'Forest Hike',             who: 'Emma · 3 mos ago' },
  { bg: 'from-violet-500 via-purple-500 to-fuchsia-500', emoji: '🎉', label: '10th Anniversary',       who: 'Dad · 6 mos ago' },
];

function FrameMockup() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setIdx(i => (i + 1) % frameSlides.length); setFading(false); }, 300);
    }, 3000);
    return () => clearInterval(t);
  }, []);
  const slide = frameSlides[idx];
  return (
    <div className="relative flex flex-col items-center py-4">
      {/* Floating notification bubbles */}
      <div className="absolute -right-4 top-8 z-20" style={{ animation: 'bounce 3s ease-in-out infinite' }}>
        <div className="px-2.5 py-1.5 rounded-xl text-xs font-medium shadow-lg" style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.35)', color: 'white' }}>
          📅 Soccer · 3:30 PM
        </div>
      </div>
      <div className="absolute -left-4 top-24 z-20" style={{ animation: 'bounce 4s ease-in-out infinite', animationDelay: '1.2s' }}>
        <div className="px-2.5 py-1.5 rounded-xl text-xs font-medium shadow-lg" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.28)', color: 'rgba(255,255,255,0.9)' }}>
          ✅ Jake finished chores
        </div>
      </div>
      {/* Frame device */}
      <div style={{ filter: 'drop-shadow(0 28px 56px rgba(0,0,0,0.5))' }}>
        <div className="rounded-[22px] p-[10px]" style={{ background: 'linear-gradient(145deg,#2c2c2c,#1a1a1a)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12),inset 0 -1px 0 rgba(0,0,0,0.5)' }}>
          <div className="w-72 rounded-xl overflow-hidden relative" style={{ aspectRatio: '16/10' }}>
            <div
              className={`absolute inset-0 bg-gradient-to-br ${slide.bg} flex items-center justify-center transition-opacity duration-300`}
              style={{ opacity: fading ? 0 : 1 }}
            >
              <span className="text-7xl" style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }}>{slide.emoji}</span>
            </div>
            <div className="absolute top-3 left-3 z-10">
              <p className="text-white font-mono text-xs font-semibold" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>10:32 AM</p>
              <p className="text-white/55 text-[9px]">Thursday · May 1</p>
            </div>
            <div className="absolute bottom-0 inset-x-0 z-10 px-3 py-2.5" style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.75),transparent)' }}>
              <p className="text-white text-xs font-semibold">{slide.label}</p>
              <p className="text-white/50 text-[9px]">{slide.who}</p>
            </div>
            <div className="absolute top-3 right-3 z-10 flex gap-1">
              {frameSlides.map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-300"
                  style={{ width: i === idx ? '14px' : '4px', height: '4px', background: i === idx ? 'white' : 'rgba(255,255,255,0.4)' }} />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between px-2 pt-2 pb-0.5">
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Kalenda Frame OS</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 5px #34d399' }} />
              <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.3)' }}>Wi-Fi</span>
            </div>
          </div>
        </div>
      </div>
      {/* Stand */}
      <div style={{ width: '68px', height: '18px', background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)', borderRadius: '0 0 10px 10px', boxShadow: '0 6px 16px rgba(0,0,0,0.4)' }} />
      <div style={{ width: '120px', height: '8px', background: 'linear-gradient(90deg,#1a1a1a,#2c2c2c,#1a1a1a)', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
    </div>
  );
}

// ── CALENDAR PREVIEW ──────────────────────────────────────────
const calDays = [null,null,null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
const calEvents = { 3:'#5bbfbf', 8:'#f472b6', 10:'#fb923c', 15:'#34d399', 22:'#38bdf8', 28:'#a78bfa' };
const members = [['H','#f472b6'],['D','#38bdf8'],['M','#fb7185'],['E','#34d399'],['J','#fbbf24']];

function CalendarPreview() {
  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)' }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-white text-sm font-semibold">May 2026</p>
        <div className="flex gap-1">
          {members.map(([l, c], i) => (
            <div key={i} className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: c }}>{l}</div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px mb-1.5">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <p key={i} className="text-center text-[9px] font-semibold" style={{ color: 'rgba(255,255,255,0.45)' }}>{d}</p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {calDays.map((d, i) => {
          if (!d) return <div key={i} className="h-7" />;
          const col = calEvents[d];
          return (
            <div key={i} className="flex flex-col items-center gap-0.5 h-7">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium"
                style={d === 1 ? { background: '#e17055', color: 'white', fontWeight: 700 } : { color: col ? 'white' : 'rgba(255,255,255,0.65)' }}>
                {d}
              </div>
              {col && <div className="w-1.5 h-1.5 rounded-full" style={{ background: col }} />}
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-2.5 space-y-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        {[
          { dot: '#fb923c', text: "Jake's Birthday 🎂", sub: 'May 10 · 9 days away' },
          { dot: '#34d399', text: 'Family BBQ',          sub: 'May 15 · all members' },
        ].map((ev, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ev.dot }} />
            <div>
              <p className="text-white/80 text-[11px] font-medium leading-none">{ev.text}</p>
              <p className="text-white/40 text-[9px]">{ev.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI BEFORE / AFTER ─────────────────────────────────────────
function AIBeforeAfter() {
  const [enhanced, setEnhanced] = useState(false);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)' }}>
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/8' }}>
        {/* Before state */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#374151,#1f2937)' }}>
          <div className="grid grid-cols-3 gap-1.5 opacity-25">
            {['🌸','🌊','🌿','🎉','🍂','❄️'].map((e, i) => (
              <div key={i} className="w-10 h-10 rounded flex items-center justify-center text-xl"
                style={{ filter: 'grayscale(1) brightness(0.5)', background: 'rgba(255,255,255,0.05)' }}>{e}</div>
            ))}
          </div>
          <div className="absolute top-2 left-3 px-2 py-0.5 rounded text-[10px] font-bold"
            style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.45)' }}>BEFORE</div>
        </div>
        {/* After state */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
          style={{ opacity: enhanced ? 1 : 0, background: 'linear-gradient(135deg,#ec4899,#f97316,#fbbf24)' }}>
          <div className="grid grid-cols-3 gap-1.5">
            {['🌸','🌊','🌿','🎉','🍂','❄️'].map((e, i) => (
              <div key={i} className="w-10 h-10 rounded flex items-center justify-center text-xl"
                style={{ background: 'rgba(255,255,255,0.18)' }}>{e}</div>
            ))}
          </div>
          <div className="absolute top-2 right-3 px-2 py-0.5 rounded text-[10px] font-bold"
            style={{ background: 'rgba(251,191,36,0.3)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.5)' }}>ENHANCED ✨</div>
        </div>
        {enhanced && <div className="absolute inset-y-0 left-1/2 w-px bg-white/60 z-10" />}
      </div>
      <div className="px-3 py-2.5 flex items-center justify-between">
        <div>
          <p className="text-white/85 text-xs font-semibold">AI Memory Enhancement</p>
          <p className="text-white/45 text-[10px]">Restore color · remove blur · upscale to 4K</p>
        </div>
        <button onClick={() => setEnhanced(e => !e)}
          className="text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all duration-200"
          style={enhanced
            ? { background: 'rgba(251,191,36,0.25)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.4)' }
            : { background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.25)' }}>
          {enhanced ? '← Original' : 'Enhance ✨'}
        </button>
      </div>
    </div>
  );
}

// ── DASHBOARD PREVIEW ─────────────────────────────────────────
function DashboardPreview() {
  const [done, setDone] = useState([true, true, false]);
  const schedule = [
    { t: '8:00', l: 'School Drop-off', w: 'D', c: '#38bdf8' },
    { t: '3:30', l: 'Soccer Practice',  w: 'J', c: '#fbbf24' },
    { t: '7:00', l: 'Family Dinner',    w: '★', c: '#5bbfbf' },
  ];
  const chores = ['🗑️ Trash', '🍽️ Dishes', '🐕 Walk Dog'];
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.11)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)' }}>
      <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-lg flex items-center justify-center text-white font-black text-[9px]"
            style={{ background: 'linear-gradient(135deg,#5bbfbf,#3a9e9e)' }}>K</div>
          <span className="text-white/70 text-[10px] font-semibold">Today · May 1, 2026</span>
        </div>
        <span className="text-white/40 text-[9px]">⛅ 72°F</span>
      </div>
      <div className="p-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-white/45 text-[9px] font-bold uppercase tracking-wider mb-1.5">Schedule</p>
          <div className="space-y-1">
            {schedule.map((ev, i) => (
              <div key={i} className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.07)', borderLeft: `2px solid ${ev.c}` }}>
                <p className="text-white/40 text-[9px] font-mono w-7 shrink-0">{ev.t}</p>
                <p className="text-white/75 text-[10px] flex-1 truncate">{ev.l}</p>
                <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[7px] font-bold shrink-0"
                  style={{ background: ev.c }}>{ev.w}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-white/45 text-[9px] font-bold uppercase tracking-wider mb-1.5">Chores</p>
          <div className="space-y-1">
            {chores.map((c, i) => (
              <div key={i} className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.07)' }}
                onClick={() => setDone(p => p.map((v, j) => j === i ? !v : v))}>
                <div className="w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all"
                  style={{ borderColor: done[i] ? '#5bbfbf' : 'rgba(255,255,255,0.25)', background: done[i] ? '#5bbfbf' : 'transparent' }}>
                  {done[i] && (
                    <svg viewBox="0 0 8 8" fill="none" className="w-2 h-2">
                      <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                <p className="text-[10px] transition-all"
                  style={{ color: done[i] ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.75)', textDecoration: done[i] ? 'line-through' : 'none' }}>
                  {c}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 pb-2.5">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl"
          style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <span className="text-sm">🍽️</span>
          <div>
            <p className="text-[10px] font-semibold" style={{ color: 'rgba(251,191,36,0.9)' }}>Tonight: Grilled Salmon + Rice</p>
            <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.4)' }}>AI meal suggestion · tap to swap</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── FEATURES ──────────────────────────────────────────────────
const FEATURES = [
  { icon: '📅', color: '#5bbfbf', title: 'Shared Calendar',  desc: 'Color-coded for every member. Never double-book again.' },
  { icon: '✅', color: '#34d399', title: 'Chores & Tasks',    desc: 'Assign, track, and celebrate with star rewards.' },
  { icon: '🛒', color: '#fbbf24', title: 'Shopping Lists',    desc: 'Shared lists that sync to every frame instantly.' },
  { icon: '✨', color: '#f472b6', title: 'AI Memory Studio',  desc: 'Restore old photos, enhance colors, relive moments.' },
];

// ── MAIN LANDING ──────────────────────────────────────────────
export default function Landing({ onEnter }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('demo@kalenda.app');
  const [password, setPassword] = useState('kalenda2026');
  const [name, setName] = useState('Demo Family');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !name) { setError('Please enter your name.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onEnter(name || email.split('@')[0]); }, 900);
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#f5f8fa', fontFamily: 'Inter, sans-serif' }}>

      {/* ── LEFT MARKETING PANEL ── */}
      <div className="hidden lg:flex flex-col w-[56%] overflow-y-auto relative"
        style={{ background: 'linear-gradient(160deg,#1e7a7a 0%,#2d9b9b 30%,#3ab5b5 60%,#5bbfbf 100%)', scrollbarWidth: 'none' }}>
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle,#ffffff,transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle,#0a4a4a,transparent 70%)' }} />
        </div>

        <div className="relative z-10 flex flex-col gap-8 px-10 py-10">

          {/* Logo bar */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg"
              style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.35)', color: 'white' }}>K</div>
            <span className="text-white font-bold text-xl tracking-tight">Kalenda</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.28)' }}>v2</span>
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
              style={{ background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.22)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              4,200+ families
            </div>
          </div>

          {/* Hero: animated frame */}
          <div className="flex justify-center">
            <FrameMockup />
          </div>

          {/* Headline */}
          <div className="text-center">
            <h1 className="text-white font-black leading-tight mb-3"
              style={{ fontSize: 'clamp(1.8rem,2.4vw,2.6rem)', textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}>
              The smart Wi‑Fi frame for<br />your whole family.
            </h1>
            <p className="font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.96)', fontSize: '0.95rem' }}>
              A smart Wi‑Fi photo frame that becomes your family's shared command center.
            </p>
            <p className="text-sm leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.66)', maxWidth: '400px', margin: '0 auto' }}>
              Shared calendar · chores · shopping lists · meal plans · AI memories —
              all synced live to every screen in your home.
            </p>
          </div>

          {/* What Kalenda does */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.48)' }}>
              What Kalenda does
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {FEATURES.map(f => (
                <div key={f.title} className="flex items-start gap-2.5 p-3 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.16)', backdropFilter: 'blur(8px)' }}>
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm shrink-0"
                    style={{ background: f.color + '33', border: `1px solid ${f.color}55` }}>{f.icon}</div>
                  <div>
                    <p className="text-white text-xs font-semibold leading-tight">{f.title}</p>
                    <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar preview */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.48)' }}>
              Family calendar — color-coded by member
            </p>
            <CalendarPreview />
          </div>

          {/* AI Before/After */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.48)' }}>
              AI Memory Studio — tap to enhance
            </p>
            <AIBeforeAfter />
          </div>

          {/* Dashboard preview */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.48)' }}>
              Family command center
            </p>
            <DashboardPreview />
          </div>

          {/* Testimonials */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.48)' }}>
              Loved by families
            </p>
            <div className="space-y-2.5">
              {[
                { name: 'Sarah K.', role: 'Mom of 3', quote: 'Kalenda replaced our whiteboard, our photo frame, and our family group chat — all in one beautiful screen.', avatar: '👩' },
                { name: 'James T.', role: 'Dad', quote: 'The Wi-Fi frame feature alone is worth every penny. Our grandparents love seeing new photos every day.', avatar: '👨‍💼' },
                { name: 'Priya M.', role: 'Parent', quote: 'Finally, a family app that actually feels premium. The calendar sync is flawless.', avatar: '👩‍💻' },
              ].map(t => (
                <div key={t.name} className="flex items-start gap-3 p-3.5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <span className="text-2xl shrink-0">{t.avatar}</span>
                  <div>
                    <p className="text-xs italic leading-relaxed mb-1.5" style={{ color: 'rgba(255,255,255,0.82)' }}>"{t.quote}"</p>
                    <p className="text-white text-xs font-semibold">{t.name}{' '}
                      <span className="font-normal" style={{ color: 'rgba(255,255,255,0.5)' }}>· {t.role}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs pb-4" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2026 Kalenda · Privacy · Terms</p>
        </div>
      </div>

      {/* ── RIGHT AUTH PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 lg:p-12 relative overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden flex flex-col items-center gap-2 mb-8 text-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold"
              style={{ background: 'linear-gradient(135deg,#3ab5b5,#5bbfbf)' }}>K</div>
            <span className="text-gray-800 font-semibold text-xl">Kalenda</span>
          </div>
          <p className="text-gray-500 text-xs max-w-xs">A smart Wi‑Fi photo frame that becomes your family's shared command center.</p>
        </div>

        <div className="w-full max-w-md">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 rounded-2xl mb-7" style={{ background: '#f0f4f8', border: '1px solid #e2ecf0' }}>
            {[['signin','Sign In'],['signup','Create Account']].map(([m, l]) => (
              <button key={m} onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200"
                style={mode === m
                  ? { background: '#ffffff', color: '#1e293b', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }
                  : { background: 'transparent', color: '#94a3b8' }}>
                {l}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="font-bold text-gray-900 mb-1.5" style={{ fontSize: '1.5rem' }}>
              {mode === 'signin' ? 'Welcome back 👋' : 'Set up your family hub'}
            </h2>
            <p className="text-gray-500 text-sm">
              {mode === 'signin' ? 'Sign in to your Kalenda account to continue.' : 'Free for 14 days — no credit card required.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Your name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Harriet Appiah" autoComplete="name"
                  className="w-full px-4 py-3.5 rounded-2xl text-sm text-gray-800 outline-none placeholder-gray-300"
                  style={{ background: '#f8fafc', border: '1.5px solid #e2ecf0' }}
                  onFocus={e => { e.target.style.borderColor = '#5bbfbf'; e.target.style.boxShadow = '0 0 0 3px rgba(91,191,191,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2ecf0'; e.target.style.boxShadow = 'none'; }} />
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@family.com" autoComplete="email"
                className="w-full px-4 py-3.5 rounded-2xl text-sm text-gray-800 outline-none placeholder-gray-300"
                style={{ background: '#f8fafc', border: '1.5px solid #e2ecf0' }}
                onFocus={e => { e.target.style.borderColor = '#5bbfbf'; e.target.style.boxShadow = '0 0 0 3px rgba(91,191,191,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2ecf0'; e.target.style.boxShadow = 'none'; }} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Password</label>
                {mode === 'signin' && (
                  <button type="button" className="text-xs font-medium" style={{ color: '#5bbfbf' }}>Forgot password?</button>
                )}
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full px-4 py-3.5 rounded-2xl text-sm text-gray-800 outline-none placeholder-gray-300"
                style={{ background: '#f8fafc', border: '1.5px solid #e2ecf0' }}
                onFocus={e => { e.target.style.borderColor = '#5bbfbf'; e.target.style.boxShadow = '0 0 0 3px rgba(91,191,191,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2ecf0'; e.target.style.boxShadow = 'none'; }} />
            </div>
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                style={{ background: '#fff1f1', border: '1px solid #fecaca', color: '#dc2626' }}>
                <span>⚠️</span> {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-semibold text-sm transition-all duration-200 mt-1"
              style={{ background: loading ? '#8bd8d8' : 'linear-gradient(135deg,#3ab5b5,#5bbfbf)', boxShadow: loading ? 'none' : '0 4px 20px rgba(91,191,191,0.4)' }}>
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in…
                  </span>
                : mode === 'signin' ? 'Sign In to Kalenda' : 'Create My Family Hub →'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: '#e2ecf0' }} />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px" style={{ background: '#e2ecf0' }} />
          </div>

          <div className="space-y-3">
            <button type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-medium text-gray-700 transition-all"
              style={{ background: '#ffffff', border: '1.5px solid #e2ecf0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#c0d8e0'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e2ecf0'}>
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button type="button" onClick={() => onEnter('Guest')}
              className="w-full py-3 rounded-2xl text-sm font-medium" style={{ color: '#5bbfbf' }}>
              Explore as guest →
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-7 pt-5" style={{ borderTop: '1px solid #f0f4f8' }}>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M8 1L10.2 5.5L15 6.2L11.5 9.6L12.4 14.5L8 12.1L3.6 14.5L4.5 9.6L1 6.2L5.8 5.5L8 1Z" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              Encrypted
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <path d="M8 1.5L13.5 4V8C13.5 11.5 11 14.3 8 15C5 14.3 2.5 11.5 2.5 8V4L8 1.5Z" stroke="#3ab5b5" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
              COPPA safe
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
                <circle cx="8" cy="8" r="6.5" stroke="#f59e0b" strokeWidth="1.5"/>
                <path d="M5.5 8L7 9.5L10.5 6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              14-day free trial
            </div>
          </div>
        </div>

        <p className="absolute bottom-5 text-xs text-gray-400">
          © 2026 Kalenda ·{' '}
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy</span>
          {' · '}
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms</span>
        </p>
      </div>
    </div>
  );
}
