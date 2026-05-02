import { useState, useEffect, useRef } from 'react';

// ─────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────
const frameSlides = [
  { bg: 'from-rose-500 via-pink-500 to-orange-400',      emoji: '🌸', label: "Maya's 6th Birthday",   who: 'Mom · 2 yrs ago'   },
  { bg: 'from-sky-500 via-blue-500 to-indigo-500',       emoji: '🌊', label: 'Beach Day, Cape Coast',  who: 'Dad · last summer'  },
  { bg: 'from-emerald-500 via-teal-500 to-cyan-500',     emoji: '🌿', label: 'Forest Hike',             who: 'Emma · 3 mos ago'   },
  { bg: 'from-violet-500 via-purple-500 to-fuchsia-500', emoji: '🎉', label: '10th Anniversary',        who: 'Dad · 6 mos ago'    },
];

const calDays   = [null,null,null,null,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
const calEvents = { 3:'#5bbfbf', 8:'#f472b6', 10:'#fb923c', 15:'#34d399', 22:'#38bdf8', 28:'#a78bfa' };
const calMembers = [['H','#f472b6'],['D','#38bdf8'],['M','#fb7185'],['E','#34d399'],['J','#fbbf24']];

const FEATURES = [
  { icon:'🖼️', color:'#5bbfbf', title:'Wi-Fi Photo Frame',  desc:'Beautiful memories cycling live on every screen.' },
  { icon:'📅', color:'#34d399', title:'Shared Calendar',    desc:'Color-coded for every member. Zero double-bookings.' },
  { icon:'✅', color:'#fbbf24', title:'Chores & Tasks',      desc:'Assign, reward, and celebrate every win together.' },
  { icon:'✨', color:'#f472b6', title:'AI Memory Studio',   desc:'Restore, enhance, and upscale your oldest memories.' },
];

// ─────────────────────────────────────────────
//  GLASS STYLE HELPERS
// ─────────────────────────────────────────────
const darkGlass = {
  background: 'rgba(255,255,255,0.10)',
  backdropFilter: 'blur(24px) saturate(150%)',
  WebkitBackdropFilter: 'blur(24px) saturate(150%)',
  border: '1px solid rgba(255,255,255,0.20)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), inset 0 -1px 0 rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.14)',
};

// ─────────────────────────────────────────────
//  FRAME MOCKUP
// ─────────────────────────────────────────────
function FrameMockup() {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);
  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setIdx(i => (i + 1) % frameSlides.length); setFading(false); }, 320);
    }, 3200);
    return () => clearInterval(t);
  }, []);
  const slide = frameSlides[idx];
  return (
    <div className="relative flex flex-col items-center">
      {/* Notification pills */}
      <div className="absolute -right-6 top-6 z-30" style={{ animation: 'floatMedium 3s ease-in-out infinite' }}>
        <div className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-2xl text-xs font-semibold shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.40)', color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.5)' }}>
          <span className="text-sm">📅</span> Soccer · 3:30 PM
        </div>
      </div>
      <div className="absolute -left-6 top-[88px] z-30" style={{ animation: 'floatSlow 4.5s ease-in-out infinite', animationDelay: '1.4s' }}>
        <div className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-2xl text-xs font-semibold shadow-2xl"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.32)', color: 'rgba(255,255,255,0.94)', boxShadow: '0 8px 32px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.4)' }}>
          <span className="text-sm">✅</span> Jake finished chores
        </div>
      </div>

      {/* Glow halo behind frame */}
      <div className="absolute" style={{ width: '340px', height: '240px', background: 'radial-gradient(ellipse, rgba(91,191,191,0.45) 0%, transparent 70%)', filter: 'blur(40px)', top: '10px' }} />

      {/* Frame device */}
      <div className="relative" style={{ filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.55)) drop-shadow(0 8px 16px rgba(0,0,0,0.3))', transformStyle: 'preserve-3d' }}>
        {/* Outer aluminum bezel */}
        <div className="rounded-[24px] p-[10px] relative" style={{
          background: 'linear-gradient(145deg, #3a3a3a 0%, #1e1e1e 40%, #2a2a2a 70%, #161616 100%)',
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -2px 0 rgba(0,0,0,0.6), inset 2px 0 0 rgba(255,255,255,0.06), inset -2px 0 0 rgba(0,0,0,0.3)',
        }}>
          {/* Screen */}
          <div className="w-[280px] rounded-[14px] overflow-hidden relative" style={{ aspectRatio: '16/10' }}>
            {/* Photo */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} flex items-center justify-center transition-opacity duration-350`}
              style={{ opacity: fading ? 0 : 1 }}>
              <span className="text-[80px]" style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.5))' }}>{slide.emoji}</span>
            </div>
            {/* Screen glass reflection overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)', zIndex: 5 }} />
            {/* Clock */}
            <div className="absolute top-3 left-3.5 z-10">
              <p className="text-white font-mono text-[13px] font-bold tracking-wide" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>10:32</p>
              <p className="text-white/55 text-[9px] tracking-wide">Thu · May 1</p>
            </div>
            {/* Bottom caption gradient */}
            <div className="absolute bottom-0 inset-x-0 z-10 px-3 py-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
              <p className="text-white text-[13px] font-semibold leading-tight">{slide.label}</p>
              <p className="text-white/55 text-[10px] mt-0.5">{slide.who}</p>
            </div>
            {/* Slide dots */}
            <div className="absolute top-3 right-3 z-10 flex gap-1">
              {frameSlides.map((_, i) => (
                <div key={i} className="rounded-full transition-all duration-400"
                  style={{ width: i===idx ? '16px' : '4px', height: '4px', background: i===idx ? 'white' : 'rgba(255,255,255,0.38)' }} />
              ))}
            </div>
          </div>
          {/* Bottom bezel bar */}
          <div className="flex items-center justify-between px-2.5 pt-2 pb-0.5">
            <span className="text-[8px] font-medium tracking-wider" style={{ color: 'rgba(255,255,255,0.28)' }}>KALENDA OS</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 6px #34d399, 0 0 12px rgba(52,211,153,0.5)' }} />
              <span className="text-[8px] tracking-wider" style={{ color: 'rgba(255,255,255,0.28)' }}>WI-FI</span>
            </div>
          </div>
        </div>
        {/* Bezel edge highlight */}
        <div className="absolute inset-0 rounded-[24px] pointer-events-none" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.4)' }} />
      </div>
      {/* Stand neck */}
      <div style={{ width: '72px', height: '20px', background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)', borderRadius: '0 0 12px 12px', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }} />
      {/* Stand base */}
      <div style={{ width: '130px', height: '9px', background: 'linear-gradient(90deg, #161616, #2e2e2e 40%, #2e2e2e 60%, #161616)', borderRadius: '6px', boxShadow: '0 6px 20px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)' }} />
    </div>
  );
}

// ─────────────────────────────────────────────
//  CALENDAR PREVIEW
// ─────────────────────────────────────────────
function CalendarPreview() {
  return (
    <div className="rounded-3xl p-4" style={darkGlass}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-white text-sm font-bold tracking-tight">May 2026</p>
        <div className="flex gap-1">
          {calMembers.map(([l, c], i) => (
            <div key={i} className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-white text-[9px] font-black"
              style={{ background: c, boxShadow: `0 2px 8px ${c}60` }}>{l}</div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 gap-px mb-2">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <p key={i} className="text-center text-[9px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.38)' }}>{d}</p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {calDays.map((d, i) => {
          if (!d) return <div key={i} className="h-7" />;
          const col = calEvents[d];
          const isToday = d === 1;
          return (
            <div key={i} className="flex flex-col items-center gap-0.5 h-7">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
                style={isToday
                  ? { background: '#e17055', color: 'white', fontWeight: 800, boxShadow: '0 2px 8px rgba(225,112,85,0.5)' }
                  : { color: col ? 'white' : 'rgba(255,255,255,0.58)' }}>
                {d}
              </div>
              {col && <div className="w-1.5 h-1.5 rounded-full" style={{ background: col, boxShadow: `0 0 4px ${col}` }} />}
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.10)' }}>
        {[
          { dot: '#fb923c', text: "Jake's Birthday 🎂", sub: 'May 10 · 9 days away' },
          { dot: '#34d399', text: 'Family BBQ',          sub: 'May 15 · all members' },
        ].map((ev, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: ev.dot, boxShadow: `0 0 6px ${ev.dot}` }} />
            <div>
              <p className="text-white/85 text-[11px] font-semibold leading-none">{ev.text}</p>
              <p className="text-white/40 text-[9px] mt-0.5">{ev.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  AI BEFORE / AFTER
// ─────────────────────────────────────────────
function AIBeforeAfter() {
  const [enhanced, setEnhanced] = useState(false);
  return (
    <div className="rounded-3xl overflow-hidden" style={darkGlass}>
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/8' }}>
        {/* Before */}
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)' }}>
          <div className="grid grid-cols-3 gap-1.5 opacity-20">
            {['🌸','🌊','🌿','🎉','🍂','❄️'].map((e, i) => (
              <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ filter: 'grayscale(1) brightness(0.5)', background: 'rgba(255,255,255,0.04)' }}>{e}</div>
            ))}
          </div>
          <div className="absolute top-2.5 left-3 px-2 py-0.5 rounded-lg text-[10px] font-bold tracking-widest"
            style={{ background: 'rgba(0,0,0,0.55)', color: 'rgba(255,255,255,0.4)' }}>BEFORE</div>
        </div>
        {/* After */}
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-700"
          style={{ opacity: enhanced ? 1 : 0, background: 'linear-gradient(135deg, #ec4899 0%, #f97316 50%, #fbbf24 100%)' }}>
          <div className="grid grid-cols-3 gap-1.5">
            {['🌸','🌊','🌿','🎉','🍂','❄️'].map((e, i) => (
              <div key={i} className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                style={{ background: 'rgba(255,255,255,0.20)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)' }}>{e}</div>
            ))}
          </div>
          <div className="absolute top-2.5 right-3 px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wide"
            style={{ background: 'rgba(251,191,36,0.3)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.5)', boxShadow: '0 0 12px rgba(251,191,36,0.3)' }}>ENHANCED ✨</div>
        </div>
        {/* Divider line */}
        {enhanced && <div className="absolute inset-y-0 left-1/2 w-0.5 z-10" style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.8), transparent)' }} />}
      </div>
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-white/90 text-xs font-bold">AI Memory Enhancement</p>
          <p className="text-white/45 text-[10px] mt-0.5">Restore color · remove blur · upscale to 4K</p>
        </div>
        <button onClick={() => setEnhanced(e => !e)}
          className="text-[11px] font-bold px-3.5 py-1.5 rounded-xl transition-all duration-300 active:scale-95"
          style={enhanced
            ? { background: 'rgba(251,191,36,0.22)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.45)', boxShadow: '0 0 16px rgba(251,191,36,0.25)' }
            : { background: 'rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.25)' }}>
          {enhanced ? '← Original' : 'Enhance ✨'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  DASHBOARD PREVIEW
// ─────────────────────────────────────────────
function DashboardPreview() {
  const [done, setDone] = useState([true, true, false]);
  const schedule = [
    { t: '8:00', l: 'School Drop-off', c: '#38bdf8', w: 'D' },
    { t: '3:30', l: 'Soccer Practice',  c: '#fbbf24', w: 'J' },
    { t: '7:00', l: 'Family Dinner',    c: '#5bbfbf', w: '★' },
  ];
  const chores = ['🗑️ Trash', '🍽️ Dishes', '🐕 Walk Dog'];
  return (
    <div className="rounded-3xl overflow-hidden" style={darkGlass}>
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg flex items-center justify-center text-white font-black text-[10px]"
            style={{ background: 'linear-gradient(135deg,#5bbfbf,#3a9e9e)', boxShadow: '0 2px 8px rgba(91,191,191,0.5)' }}>K</div>
          <span className="text-white/75 text-[11px] font-bold tracking-tight">Today · May 1, 2026</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <span className="text-[11px]">⛅</span>
          <span className="text-white/50 text-[9px] font-semibold">72°F · Accra</span>
        </div>
      </div>
      <div className="p-3 grid grid-cols-2 gap-3">
        {/* Schedule */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>Schedule</p>
          <div className="space-y-1.5">
            {schedule.map((ev, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.07)', borderLeft: `3px solid ${ev.c}`, boxShadow: `inset 3px 0 8px ${ev.c}18` }}>
                <p className="text-[9px] font-mono w-6 shrink-0" style={{ color: 'rgba(255,255,255,0.38)' }}>{ev.t}</p>
                <p className="text-[10px] flex-1 truncate font-medium" style={{ color: 'rgba(255,255,255,0.78)' }}>{ev.l}</p>
                <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[7px] font-black shrink-0"
                  style={{ background: ev.c, boxShadow: `0 2px 6px ${ev.c}60` }}>{ev.w}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Chores */}
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.38)' }}>Chores</p>
          <div className="space-y-1.5">
            {chores.map((c, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-xl cursor-pointer transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.07)' }}
                onClick={() => setDone(p => p.map((v, j) => j === i ? !v : v))}>
                <div className="w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{ borderColor: done[i] ? '#5bbfbf' : 'rgba(255,255,255,0.22)', background: done[i] ? '#5bbfbf' : 'transparent', boxShadow: done[i] ? '0 0 8px rgba(91,191,191,0.5)' : 'none' }}>
                  {done[i] && <svg viewBox="0 0 8 8" fill="none" className="w-2 h-2"><path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <p className="text-[10px] transition-all duration-200"
                  style={{ color: done[i] ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.78)', textDecoration: done[i] ? 'line-through' : 'none' }}>{c}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl"
          style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.22)', boxShadow: 'inset 0 1px 0 rgba(251,191,36,0.15)' }}>
          <span className="text-base">🍽️</span>
          <div>
            <p className="text-[10px] font-bold" style={{ color: 'rgba(251,191,36,0.95)' }}>Tonight: Grilled Salmon + Rice</p>
            <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.40)' }}>AI meal suggestion · tap to swap</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN LANDING
// ─────────────────────────────────────────────
export default function Landing({ onEnter }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('demo@kalenda.app');
  const [password, setPassword] = useState('kalenda2026');
  const [name, setName] = useState('Demo Family');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 3D tilt state for the frame mockup
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);
  const isSettling = useRef(false);

  function handleMouseMove(e) {
    if (!panelRef.current) return;
    const r = panelRef.current.getBoundingClientRect();
    const cx = r.left + r.width * 0.5;
    const cy = r.top + r.height * 0.3;
    const MAX = 10;
    setTilt({
      x: Math.max(-MAX, Math.min(MAX, ((e.clientY - cy) / (r.height * 0.3)) * -MAX)),
      y: Math.max(-MAX, Math.min(MAX, ((e.clientX - cx) / (r.width * 0.5)) * MAX)),
    });
  }
  function handleMouseLeave() { setTilt({ x: 0, y: 0 }); }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !name) { setError('Please enter your name.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onEnter(name || email.split('@')[0]); }, 900);
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#f2f7f7' }}>

      {/* ══════════════════════════════════════
          LEFT: Marketing panel
      ══════════════════════════════════════ */}
      <div
        ref={panelRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="hidden lg:flex flex-col w-[56%] overflow-y-auto relative noise"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* ── Aurora / animated mesh background ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          {/* Base gradient */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0b4040 0%, #165e5e 20%, #1e7a7a 45%, #2d9b9b 70%, #3db5b5 100%)' }} />
          {/* Animated blobs */}
          <div className="absolute orb-1" style={{ top: '-15%', left: '-15%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(91,191,191,0.55) 0%, transparent 65%)', filter: 'blur(70px)' }} />
          <div className="absolute orb-2" style={{ top: '35%', right: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(52,211,153,0.35) 0%, transparent 70%)', filter: 'blur(80px)' }} />
          <div className="absolute orb-3" style={{ bottom: '-10%', left: '15%', width: '55%', height: '55%', background: 'radial-gradient(circle, rgba(34,211,238,0.28) 0%, transparent 65%)', filter: 'blur(60px)' }} />
          <div className="absolute orb-4" style={{ top: '55%', left: '-5%', width: '40%', height: '40%', background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)', filter: 'blur(50px)' }} />
          {/* Subtle top shimmer */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 40%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.4) 60%, transparent 100%)' }} />
        </div>

        {/* ── Scrollable content ── */}
        <div className="relative z-10 flex flex-col gap-10 px-10 py-10">

          {/* Logo row */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl"
              style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.40)', color: 'white', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 24px rgba(0,0,0,0.2)' }}>K</div>
            <span className="text-white font-black text-xl tracking-tight">Kalenda</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-bold tracking-wide"
              style={{ background: 'rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.30)' }}>v2</span>
            <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.88)', border: '1px solid rgba(255,255,255,0.20)', backdropFilter: 'blur(8px)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              4,200+ families
            </div>
          </div>

          {/* ─── HERO: 3D Frame ─── */}
          <div className="flex justify-center" style={{ perspective: '1200px' }}>
            <div style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
              transition: `transform ${tilt.x === 0 && tilt.y === 0 ? '0.9s' : '0.08s'} cubic-bezier(.22,.68,0,1.2)`,
              transformStyle: 'preserve-3d',
            }}>
              <FrameMockup />
            </div>
          </div>

          {/* Headline */}
          <div className="text-center">
            <h1 className="text-white font-black leading-[1.1] tracking-tight mb-4"
              style={{ fontSize: 'clamp(2rem, 2.6vw, 2.75rem)', textShadow: '0 4px 24px rgba(0,0,0,0.25)', letterSpacing: '-0.02em' }}>
              The smart Wi‑Fi frame
              <br />
              <span style={{ background: 'linear-gradient(135deg, #a7f3d0, #6ee7b7, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                for your whole family.
              </span>
            </h1>
            <p className="font-semibold mb-2" style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1rem', letterSpacing: '-0.01em' }}>
              A smart Wi‑Fi photo frame that becomes your family's shared command center.
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.62)', maxWidth: '400px', margin: '0 auto' }}>
              Calendar · chores · shopping lists · AI memories — synced live to every screen.
            </p>
          </div>

          {/* ─── FEATURES 2×2 ─── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-4" style={{ color: 'rgba(255,255,255,0.40)' }}>
              What Kalenda does
            </p>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.map((f, fi) => (
                <div key={f.title} className="flex items-start gap-3 p-3.5 rounded-3xl transition-transform duration-200 hover:-translate-y-0.5" style={{ ...darkGlass, cursor: 'default' }}>
                  <div className="w-8 h-8 rounded-2xl flex items-center justify-center text-base shrink-0"
                    style={{ background: f.color + '28', border: `1.5px solid ${f.color}45`, boxShadow: `0 4px 12px ${f.color}30` }}>
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-white text-[12px] font-bold leading-tight">{f.title}</p>
                    <p className="text-[10px] mt-1 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── CALENDAR ─── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Color-coded family calendar
            </p>
            <CalendarPreview />
          </div>

          {/* ─── AI BEFORE/AFTER ─── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.40)' }}>
              AI Memory Studio — tap to enhance
            </p>
            <AIBeforeAfter />
          </div>

          {/* ─── DASHBOARD ─── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-3" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Family command center
            </p>
            <DashboardPreview />
          </div>

          {/* ─── TESTIMONIALS ─── */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] mb-4" style={{ color: 'rgba(255,255,255,0.40)' }}>
              Loved by families worldwide
            </p>
            <div className="space-y-3">
              {[
                { name: 'Sarah K.', role: 'Mom of 3', quote: 'Kalenda replaced our whiteboard, our photo frame, and our family group chat — all in one beautiful screen.', avatar: '👩', stars: 5 },
                { name: 'James T.', role: 'Dad', quote: 'The Wi-Fi frame feature alone is worth every penny. Our grandparents love seeing new photos every day.', avatar: '👨‍💼', stars: 5 },
                { name: 'Priya M.', role: 'Parent', quote: 'Finally, a family app that feels truly premium. The calendar sync is flawless.', avatar: '👩‍💻', stars: 5 },
              ].map(t => (
                <div key={t.name} className="flex items-start gap-3 p-4 rounded-3xl" style={darkGlass}>
                  <span className="text-2xl shrink-0 mt-0.5">{t.avatar}</span>
                  <div>
                    <div className="flex gap-0.5 mb-1.5">
                      {Array(t.stars).fill(0).map((_, i) => <span key={i} className="text-[11px]">⭐</span>)}
                    </div>
                    <p className="text-[12px] leading-relaxed mb-2" style={{ color: 'rgba(255,255,255,0.82)', fontStyle: 'italic' }}>"{t.quote}"</p>
                    <p className="text-white text-[11px] font-bold">{t.name}{' '}
                      <span className="font-normal" style={{ color: 'rgba(255,255,255,0.48)' }}>· {t.role}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs pb-4" style={{ color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>
            © 2026 Kalenda · Privacy · Terms
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT: Auth panel
      ══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 lg:p-12 relative overflow-y-auto"
        style={{ background: 'linear-gradient(160deg, #f0fafa 0%, #e8f5f5 30%, #f5fafa 60%, #f2f7f7 100%)' }}>

        {/* Right-side background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute orb-1" style={{ top: '-20%', right: '-20%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(91,191,191,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div className="absolute orb-3" style={{ bottom: '5%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(168,218,218,0.15) 0%, transparent 70%)', filter: 'blur(50px)' }} />
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex flex-col items-center gap-2 mb-8 text-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg"
              style={{ background: 'linear-gradient(135deg,#3ab5b5,#5bbfbf)', boxShadow: '0 8px 24px rgba(91,191,191,0.35)' }}>K</div>
            <span className="text-gray-800 font-black text-2xl tracking-tight">Kalenda</span>
          </div>
          <p className="text-gray-500 text-xs max-w-xs leading-relaxed">A smart Wi‑Fi photo frame that becomes your family's shared command center.</p>
        </div>

        {/* ─── Floating Auth Card ─── */}
        <div className="relative z-10 w-full max-w-[420px] auth-card px-10 py-10">

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 rounded-2xl mb-8" style={{ background: 'rgba(240,244,248,0.9)', border: '1px solid rgba(226,236,240,0.8)' }}>
            {[['signin','Sign In'],['signup','Create Account']].map(([m, l]) => (
              <button key={m}
                onClick={() => { setMode(m); setError(''); }}
                className="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200"
                style={mode === m
                  ? { background: '#ffffff', color: '#0f172a', boxShadow: '0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)', letterSpacing: '-0.01em' }
                  : { background: 'transparent', color: '#94a3b8' }}>
                {l}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="font-black text-gray-900 mb-1.5 tracking-tight" style={{ fontSize: '1.6rem', letterSpacing: '-0.03em' }}>
              {mode === 'signin' ? 'Welcome back 👋' : 'Set up your family hub'}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {mode === 'signin' ? 'Sign in to your Kalenda account to continue.' : 'Free for 14 days — no credit card required.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Your name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Harriet Appiah" autoComplete="name"
                  className="w-full px-4 py-3.5 text-sm text-gray-800 outline-none placeholder-gray-300 input-glass"
                  style={{ width: '100%' }} />
              </div>
            )}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-widest">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@family.com" autoComplete="email"
                className="w-full px-4 py-3.5 text-sm text-gray-800 outline-none placeholder-gray-300 input-glass" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                {mode === 'signin' && (
                  <button type="button" className="text-xs font-semibold transition-colors hover:opacity-70" style={{ color: '#3ab5b5' }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full px-4 py-3.5 text-sm text-gray-800 outline-none placeholder-gray-300 input-glass" />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium"
                style={{ background: 'rgba(254,242,242,0.9)', border: '1px solid rgba(252,165,165,0.6)', color: '#dc2626', backdropFilter: 'blur(8px)' }}>
                <span>⚠️</span>{error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-black text-sm transition-all duration-200 active:scale-[0.98] mt-2"
              style={{
                background: loading ? '#8bd8d8' : 'linear-gradient(135deg, #2d9b9b 0%, #3ab5b5 50%, #5bbfbf 100%)',
                boxShadow: loading ? 'none' : '0 6px 24px rgba(91,191,191,0.45), 0 2px 8px rgba(91,191,191,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
                letterSpacing: '-0.01em',
              }}>
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in…
                  </span>
                : mode === 'signin' ? 'Sign In to Kalenda →' : 'Create My Family Hub →'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(226,236,240,0.8)' }} />
            <span className="text-[11px] text-gray-400 font-semibold tracking-widest">OR</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(226,236,240,0.8)' }} />
          </div>

          <div className="space-y-3">
            {/* Google */}
            <button type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-semibold text-gray-700 transition-all duration-200 active:scale-[0.98]"
              style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid rgba(226,236,240,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)', backdropFilter: 'blur(8px)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#b0d4d4'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(91,191,191,0.12), inset 0 1px 0 rgba(255,255,255,1)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(226,236,240,0.9)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)'; }}>
              <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            {/* Guest */}
            <button type="button" onClick={() => onEnter('Guest')}
              className="w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200 hover:opacity-70"
              style={{ color: '#3ab5b5', background: 'transparent', letterSpacing: '-0.01em' }}>
              Explore as guest →
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-8 pt-6" style={{ borderTop: '1px solid rgba(226,236,240,0.7)' }}>
            {[
              { icon: '🔒', label: 'End-to-end encrypted' },
              { icon: '🛡️', label: 'COPPA compliant' },
              { icon: '✅', label: '14-day free trial' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 tracking-wide">
                <span className="text-xs">{b.icon}</span> {b.label}
              </div>
            ))}
          </div>
        </div>

        <p className="absolute bottom-5 text-[11px] text-gray-400" style={{ letterSpacing: '0.04em' }}>
          © 2026 Kalenda &nbsp;·&nbsp;{' '}
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy</span>
          &nbsp;·&nbsp;{' '}
          <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms</span>
        </p>
      </div>
    </div>
  );
}
