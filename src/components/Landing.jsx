import { useState, useEffect, useRef } from 'react';
import { register, login } from '../api/auth';

// ─────────────────────────────────────────────
//  FRAME MOCKUP (hero visual)
// ─────────────────────────────────────────────
const frameSlides = [
  { bg: 'from-rose-500 via-pink-500 to-orange-400',      label: "Maya's 6th Birthday",  who: 'Mom · 2 yrs ago'  },
  { bg: 'from-sky-500 via-blue-500 to-indigo-500',       label: 'Beach Day, Cape Coast', who: 'Dad · last summer' },
  { bg: 'from-emerald-500 via-teal-500 to-cyan-500',     label: 'Forest Hike',            who: 'Emma · 3 mos ago' },
  { bg: 'from-violet-500 via-purple-500 to-fuchsia-500', label: '10th Anniversary',       who: 'Dad · 6 mos ago'  },
];

function FrameMockup({ scale = 1 }) {
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
  const w = Math.round(300 * scale);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Glow halo */}
      <div className="absolute pointer-events-none" style={{ width: `${w * 1.4}px`, height: `${w * 0.9}px`, background: 'radial-gradient(ellipse, rgba(91,191,191,0.52) 0%, rgba(52,211,153,0.18) 40%, transparent 70%)', filter: 'blur(52px)', top: '-8%', left: '50%', transform: 'translateX(-50%)' }} />
      <div className="absolute pointer-events-none" style={{ width: `${w * 0.9}px`, height: `${w * 0.5}px`, background: 'radial-gradient(ellipse, rgba(255,255,255,0.14) 0%, transparent 70%)', filter: 'blur(28px)', top: '5%', left: '50%', transform: 'translateX(-50%)' }} />

      {/* Floating notification chips */}
      <div className="absolute z-30" style={{ right: `${-w * 0.18}px`, top: '12%', animation: 'floatMedium 3s ease-in-out infinite' }}>
        <div className="flex items-center gap-1.5 pl-2.5 pr-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap"
          style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.36)', color: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.5)' }}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:'11px',height:'11px',opacity:0.75}}><rect x="1" y="2" width="12" height="11" rx="1.5"/><path d="M5 1v2M9 1v2M1 6h12"/></svg>
          Soccer · 3:30 PM
        </div>
      </div>
      <div className="absolute z-30" style={{ left: `${-w * 0.2}px`, top: '34%', animation: 'floatSlow 4.5s ease-in-out infinite', animationDelay: '1.4s' }}>
        <div className="flex items-center gap-1.5 pl-2.5 pr-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.28)', color: 'rgba(255,255,255,0.92)', boxShadow: '0 8px 32px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.4)' }}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:'11px',height:'11px',opacity:0.75}}><circle cx="7" cy="7" r="6"/><path d="M4.5 7l2 2 3.5-3.5"/></svg>
          Jake finished chores
        </div>
      </div>
      <div className="absolute z-30" style={{ right: `${-w * 0.14}px`, top: '58%', animation: 'floatMedium 5s ease-in-out infinite', animationDelay: '2.8s' }}>
        <div className="flex items-center gap-1.5 pl-2.5 pr-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap"
          style={{ background: 'rgba(251,191,36,0.22)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(251,191,36,0.4)', color: '#fef3c7', boxShadow: '0 8px 24px rgba(251,191,36,0.25), inset 0 1px 0 rgba(255,255,255,0.3)' }}>
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:'11px',height:'11px',opacity:0.75}}><path d="M7 1v1.5M4 9V7a3 3 0 016 0v2M1.5 9h11l1 3.5H.5L1.5 9zM5.5 12.5a1.5 1.5 0 003 0"/></svg>
          Jake's birthday in 9d
        </div>
      </div>

      {/* Device */}
      <div className="relative" style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.65)) drop-shadow(0 12px 24px rgba(0,0,0,0.40)) drop-shadow(0 2px 4px rgba(0,0,0,0.25))', transformStyle: 'preserve-3d' }}>
        <div className="rounded-[22px] p-[9px]" style={{
          background: 'linear-gradient(145deg, #3a3a3a 0%, #1e1e1e 40%, #2a2a2a 70%, #161616 100%)',
          boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.14), inset 0 -2px 0 rgba(0,0,0,0.6), inset 2px 0 0 rgba(255,255,255,0.06), inset -2px 0 0 rgba(0,0,0,0.3)',
        }}>
          <div style={{ width: `${w}px`, borderRadius: '13px', overflow: 'hidden', aspectRatio: '16/10', position: 'relative' }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} transition-opacity duration-300`} style={{ opacity: fading ? 0 : 1 }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 38% 38%, rgba(255,255,255,0.22) 0%, transparent 55%)' }} />
            </div>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)', zIndex: 5 }} />
            <div className="absolute top-2.5 left-3 z-10">
              <p className="font-mono font-bold tracking-wide" style={{ fontSize: `${w * 0.047}px`, color: 'white', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}>10:32</p>
              <p style={{ fontSize: `${w * 0.033}px`, color: 'rgba(255,255,255,0.5)' }}>Thu · May 1</p>
            </div>
            <div className="absolute bottom-0 inset-x-0 z-10 px-3 py-2.5" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)' }}>
              <p className="font-semibold leading-tight" style={{ fontSize: `${w * 0.048}px`, color: 'white' }}>{slide.label}</p>
              <p style={{ fontSize: `${w * 0.036}px`, color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{slide.who}</p>
            </div>
            <div className="absolute top-2.5 right-2.5 z-10 flex gap-1">
              {frameSlides.map((_, i) => <div key={i} className="rounded-full transition-all duration-400" style={{ width: i===idx ? '14px' : '4px', height: '4px', background: i===idx ? 'white' : 'rgba(255,255,255,0.35)' }} />)}
            </div>
          </div>
          <div className="flex items-center justify-between px-2 pt-1.5 pb-0.5">
            <span style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)' }}>KALENDA OS</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 6px #34d399' }} />
              <span style={{ fontSize: '7px', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)' }}>WI-FI</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 rounded-[22px] pointer-events-none" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.4)' }} />
      </div>
      {/* Stand */}
      <div style={{ width: `${w * 0.24}px`, height: `${w * 0.065}px`, background: 'linear-gradient(180deg, #2a2a2a, #1a1a1a)', borderRadius: `0 0 ${w*0.04}px ${w*0.04}px`, boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }} />
      <div style={{ width: `${w * 0.43}px`, height: `${w * 0.03}px`, background: 'linear-gradient(90deg, #161616, #2e2e2e 40%, #2e2e2e 60%, #161616)', borderRadius: '6px', boxShadow: '0 6px 20px rgba(0,0,0,0.55)' }} />
      <div style={{ width: `${w * 0.66}px`, height: `${w * 0.056}px`, marginTop: `${w * 0.02}px`, background: 'radial-gradient(ellipse, rgba(0,0,0,0.48) 0%, transparent 70%)', filter: `blur(${w * 0.035}px)`, borderRadius: '50%' }} />
      <div style={{ width: `${w * 0.52}px`, height: `${w * 0.025}px`, background: 'radial-gradient(ellipse, rgba(91,191,191,0.2) 0%, transparent 70%)', filter: `blur(${w * 0.025}px)`, borderRadius: '50%', marginTop: `-${w * 0.012}px` }} />
    </div>
  );
}

// ─────────────────────────────────────────────
//  AUTH MODAL
// ─────────────────────────────────────────────
function AuthModal({ onEnter, onClose, initialMode = 'signin' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('demo@kalenda.app');
  const [password, setPassword] = useState('kalenda2026');
  const [name, setName] = useState('Demo Family');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const DEMO_USER = { id: 'demo', name: 'Demo Family', email: 'demo@kalenda.app', familyId: 'demo-family' };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (mode === 'signup' && !name) { setError('Please enter your name.'); return; }

    // Demo shortcut — no backend needed
    if (email === 'demo@kalenda.app' && password === 'kalenda2026') {
      onEnter(DEMO_USER);
      return;
    }

    setLoading(true);
    try {
      let data;
      if (mode === 'signup') {
        data = await register({ name, email, password, familyName: name + "'s Family" });
      } else {
        data = await login({ email, password });
      }
      onEnter(data.user);
    } catch (err) {
      setError(err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(10,30,30,0.72)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }} />

      <div className="relative w-full max-w-md rounded-[32px] p-8 z-10" style={{
        background: 'rgba(255,255,255,0.97)',
        boxShadow: '0 64px 160px rgba(0,0,0,0.22), 0 24px 60px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,1)',
        animation: 'fadeInUp 0.35s cubic-bezier(.22,.68,0,1.2) both',
      }}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors" style={{ background: 'rgba(0,0,0,0.05)' }}>
          <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-7">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-black text-base shadow-lg" style={{ background: 'linear-gradient(135deg,#2d9b9b,#5bbfbf)', boxShadow: '0 6px 20px rgba(91,191,191,0.4)' }}>K</div>
          <span className="font-black text-gray-900 text-lg tracking-tight">Kalenda</span>
        </div>

        {/* Toggle */}
        <div className="flex gap-1 p-1 rounded-2xl mb-7" style={{ background: 'rgba(240,248,248,0.9)', border: '1px solid rgba(219,234,234,0.8)' }}>
          {[['signin','Sign In'],['signup','Create Account']].map(([m,l]) => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              className="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-200"
              style={mode===m ? { background:'#fff', color:'#0f172a', boxShadow:'0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)' } : { color:'#94a3b8' }}>
              {l}
            </button>
          ))}
        </div>

        <h2 className="font-black text-gray-900 mb-1 tracking-tight" style={{ fontSize:'1.5rem', letterSpacing:'-0.03em' }}>
          {mode==='signin' ? 'Welcome back' : 'Join 4,200+ families'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">{mode==='signin' ? 'Sign in to your Kalenda family hub.' : 'Free for 14 days — no credit card needed.'}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode==='signup' && (
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Your name</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Harriet Appiah" autoComplete="name"
                className="w-full px-4 py-3.5 text-sm text-gray-800 outline-none placeholder-gray-300 input-glass" />
            </div>
          )}
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@family.com" autoComplete="email"
              className="w-full px-4 py-3.5 text-sm text-gray-800 outline-none placeholder-gray-300 input-glass" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
              {mode==='signin' && <button type="button" className="text-xs font-semibold transition-colors" style={{color:'#3ab5b5'}}>Forgot?</button>}
            </div>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"
              autoComplete={mode==='signin'?'current-password':'new-password'}
              className="w-full px-4 py-3.5 text-sm text-gray-800 outline-none placeholder-gray-300 input-glass" />
          </div>
          {error && <div className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm" style={{ background:'rgba(254,242,242,0.9)', border:'1px solid rgba(252,165,165,0.5)', color:'#dc2626' }}><span>⚠️</span>{error}</div>}
          <button type="submit" disabled={loading}
            className="w-full py-4 rounded-2xl text-white font-black text-sm transition-all duration-200 active:scale-[0.98] mt-1"
            style={{ background: loading ? '#8bd8d8' : 'linear-gradient(135deg,#2d9b9b 0%,#3ab5b5 50%,#5bbfbf 100%)', boxShadow: loading ? 'none' : '0 6px 24px rgba(91,191,191,0.45), inset 0 1px 0 rgba(255,255,255,0.25)', letterSpacing:'-0.01em' }}>
            {loading ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Please wait…</span>
              : mode==='signin' ? 'Sign In to Kalenda →' : 'Create My Family Hub →'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{background:'rgba(226,236,240,0.8)'}}/>
          <span className="text-[11px] text-gray-400 font-semibold tracking-widest">OR</span>
          <div className="flex-1 h-px" style={{background:'rgba(226,236,240,0.8)'}}/>
        </div>
        <button type="button" className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-semibold text-gray-700 transition-all duration-200 active:scale-[0.98]"
          style={{ background:'rgba(255,255,255,0.9)', border:'1.5px solid rgba(226,236,240,0.9)', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
          <svg viewBox="0 0 24 24" className="w-4 h-4">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
        <button type="button" onClick={() => onEnter({ id: 'demo', name: 'Demo Family', email: 'demo@kalenda.app', familyId: 'demo-family' })}
          className="w-full py-3 mt-3 rounded-2xl text-sm font-semibold transition-all hover:opacity-70"
          style={{ color:'#3ab5b5' }}>
          Try demo — no sign up needed →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  SECTION COMPONENTS
// ─────────────────────────────────────────────

const FEATURES = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:'20px',height:'20px'}}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
    color: '#5bbfbf', bg: 'from-teal-500 to-cyan-500',
    title: 'Wi-Fi Photo Frame',
    headline: 'Your memories, always on display.',
    body: 'A living frame that cycles your family\'s best photos — automatically synced from every phone, no USB required.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:'20px',height:'20px'}}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>,
    color: '#34d399', bg: 'from-emerald-500 to-teal-500',
    title: 'Shared Calendar',
    headline: 'Every schedule, in one view.',
    body: 'Color-coded per family member. Add events from any device and they appear instantly on every screen.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:'20px',height:'20px'}}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>,
    color: '#fbbf24', bg: 'from-amber-500 to-orange-500',
    title: 'Chores & Tasks',
    headline: 'Assign, track, celebrate.',
    body: 'Build responsibility in kids and keep the household running — with streaks, rewards, and real-time updates.',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{width:'20px',height:'20px'}}><path d="M15 4l5 5L8 21H3v-5L15 4zM14 7l3 3"/></svg>,
    color: '#f472b6', bg: 'from-pink-500 to-rose-500',
    title: 'AI Memory Studio',
    headline: 'Old photos, reborn.',
    body: 'Restore faded photos, remove blur, upscale to 4K, colorize black & white — powered by AI in one tap.',
  },
];

const TESTIMONIALS = [
  { name: 'Sarah K.', role: 'Mom of 3 · Accra',     quote: 'Kalenda replaced our whiteboard, photo frame, and group chat. Our kids do their chores now — because everyone can see.' },
  { name: 'James T.', role: 'Dad · London',          quote: 'Grandma in Kumasi sees new photos of the grandkids every day — without ever touching an app.' },
  { name: 'Priya M.', role: 'Parent · Toronto',      quote: 'The AI restoration made me cry. A faded photo of my parents — colorized, sharp, beautiful again.' },
  { name: 'David L.', role: 'Father of 2 · NYC',    quote: 'Setup took 4 minutes. The whole family was using it within the hour.' },
  { name: 'Amara F.', role: 'Mom · Nairobi',         quote: 'My husband travels for work. Kalenda keeps our family connected — every single day.' },
  { name: 'Chen W.',  role: 'Parent · Singapore',    quote: 'The AI studio is magical. We restored 30-year-old wedding photos of my in-laws — they were in tears.' },
];

const PRICING = [
  {
    name: 'Starter', price: '$0', period: 'forever', color: '#94a3b8',
    desc: 'For individuals getting started.',
    features: ['1 family member', '50 photos', 'Basic calendar', 'Community support'],
    cta: 'Start free', highlight: false,
  },
  {
    name: 'Family', price: '$7', period: '/month', color: '#5bbfbf',
    desc: 'Everything your household needs.',
    features: ['Up to 8 members', 'Unlimited photos & videos', 'Shared calendar + reminders', 'Chores & task system', 'Shopping & meal lists', 'AI Memory Studio (20/mo)', 'Priority support', '3 Wi-Fi frames'],
    cta: 'Start 14-day free trial', highlight: true, badge: 'Most Popular',
  },
  {
    name: 'Extended', price: '$14', period: '/month', color: '#a78bfa',
    desc: 'For larger or multi-generation families.',
    features: ['Unlimited members', 'Unlimited storage', 'Everything in Family', 'AI Memory Studio unlimited', 'Custom frame themes', 'Shared albums with guests', 'Dedicated support', 'Unlimited frames'],
    cta: 'Get Extended', highlight: false,
  },
];

const FAQS = [
  { q: 'What hardware do I need?', a: 'Any screen with a browser works — a smart TV, tablet, old iPad, Amazon Fire tablet, or even a spare phone in landscape mode. No special hardware required.' },
  { q: 'How does the Wi-Fi frame work?', a: 'After setup, Kalenda displays your family photos on any screen in a beautiful slideshow. New photos added from any member\'s phone appear automatically within minutes.' },
  { q: 'Is my family\'s data private?', a: 'Yes — all photos and data are end-to-end encrypted. We never use your memories for advertising or share them with third parties. COPPA compliant for families with children.' },
  { q: 'Can I try it before paying?', a: 'Absolutely. The Starter plan is free forever. The Family plan comes with a full 14-day free trial — no credit card required to start.' },
  { q: 'Does it work with Google Calendar?', a: 'Yes. Kalenda syncs bidirectionally with Google Calendar and can import iCal feeds. Events added in Kalenda appear in Google Calendar and vice versa.' },
  { q: 'How good is the AI photo restoration?', a: 'Genuinely impressive. Our AI can colorize black & white photos, remove blur and grain, restore faded colors, and upscale low-resolution images to 4K quality.' },
];

// ─────────────────────────────────────────────
//  MAIN LANDING PAGE
// ─────────────────────────────────────────────
export default function Landing({ onEnter }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function openSignup() { setAuthMode('signup'); setAuthOpen(true); }
  function openSignin() { setAuthMode('signin'); setAuthOpen(true); }
  function openDemo()  { onEnter({ id: 'demo', name: 'Demo Family', email: 'demo@kalenda.app', familyId: 'demo-family' }); }

  function handleHeroMouseMove(e) {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    const MAX = 8;
    setTilt({
      x: Math.max(-MAX, Math.min(MAX, ((e.clientY - r.top - r.height * 0.5) / (r.height * 0.5)) * -MAX)),
      y: Math.max(-MAX, Math.min(MAX, ((e.clientX - r.left - r.width * 0.5) / (r.width * 0.5)) * MAX)),
    });
  }
  function handleHeroMouseLeave() { setTilt({ x: 0, y: 0 }); }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#fffbf5', color: '#0f172a' }}>

      {/* ══════════ NAVBAR ══════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={scrolled
          ? { background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderBottom: '1px solid rgba(226,236,240,0.8)', boxShadow: '0 2px 20px rgba(0,0,0,0.06)' }
          : { background: 'transparent' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: 'linear-gradient(135deg,#2d9b9b,#5bbfbf)', boxShadow: '0 4px 12px rgba(91,191,191,0.4)' }}>K</div>
            <span className="font-black text-gray-900 text-lg tracking-tight">Kalenda</span>
            <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full font-bold tracking-wide" style={{ background: 'rgba(245,158,11,0.12)', color: '#d97706', border: '1px solid rgba(245,158,11,0.28)' }}>new</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-2.5">
            <button onClick={openSignin} className="hidden sm:block text-sm font-semibold text-gray-600 px-4 py-2 rounded-xl transition-colors hover:text-gray-900 hover:bg-gray-50">Sign in</button>
            <button onClick={openSignup} className="text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#2d9b9b,#5bbfbf)', boxShadow: '0 4px 16px rgba(91,191,191,0.40)' }}>
              Get started free
            </button>
          </div>
        </div>
      </header>

      {/* ══════════ HERO ══════════ */}
      <section className="relative pt-36 pb-28 sm:pt-52 sm:pb-44 overflow-hidden" style={{ background: 'linear-gradient(165deg, #0b4040 0%, #165e5e 18%, #1e7a7a 42%, #2d9b9b 68%, #3db5b5 100%)' }}>
        {/* Background mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute orb-1" style={{ top:'-20%', left:'-15%', width:'70%', height:'70%', background:'radial-gradient(circle, rgba(91,191,191,0.55) 0%, transparent 65%)', filter:'blur(80px)' }}/>
          <div className="absolute orb-2" style={{ top:'30%', right:'-20%', width:'60%', height:'60%', background:'radial-gradient(circle, rgba(52,211,153,0.35) 0%, transparent 70%)', filter:'blur(90px)' }}/>
          <div className="absolute orb-3" style={{ bottom:'-10%', left:'20%', width:'50%', height:'50%', background:'radial-gradient(circle, rgba(34,211,238,0.28) 0%, transparent 65%)', filter:'blur(70px)' }}/>
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
          {/* Frame corner motif decoratives */}
          <div className="absolute top-6 left-6 pointer-events-none" style={{ opacity: 0.22 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M2 18V4a2 2 0 012-2h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <div className="absolute top-6 right-6 pointer-events-none" style={{ opacity: 0.22 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M34 18V4a2 2 0 00-2-2H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <div className="absolute bottom-28 left-6 pointer-events-none" style={{ opacity: 0.14 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M2 18v14a2 2 0 002 2h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>
          <div className="absolute bottom-28 right-6 pointer-events-none" style={{ opacity: 0.14 }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M34 18v14a2 2 0 01-2 2H18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </div>

          {/* Eyebrow */}
          <div className="flex justify-center mb-7">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: 'rgba(255,255,255,0.14)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,0.26)', color:'rgba(255,255,255,0.92)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#fbbf24' }} />
              4,200 families already home
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-14">
            <h1 className="font-black leading-[1.12] tracking-tight mb-9"
              style={{ fontSize: 'clamp(2.75rem, 5vw, 3.5rem)', color: 'white', letterSpacing: '-0.03em', textShadow: '0 4px 32px rgba(0,0,0,0.2)' }}>
              The frame that holds
              <br />
              <span style={{ background: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 45%, #f59e0b 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                your family together.
              </span>
            </h1>
            <p className="mx-auto" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.5rem', lineHeight: 1.4, maxWidth: '600px', letterSpacing: '-0.01em' }}>
              Every photo, every plan, every memory — alive on one beautiful screen. Synced in real time from every phone in your home.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <button onClick={openSignup}
              className="flex items-center gap-2.5 px-7 py-4 rounded-2xl text-base font-black transition-all duration-200 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)', color: '#1c1917', boxShadow: '0 6px 28px rgba(245,158,11,0.45), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(0,0,0,0.08)', border: '1px solid rgba(255,255,255,0.2)', letterSpacing: '-0.01em' }}>
              Start your family's story
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={openDemo}
              className="flex items-center gap-2 px-7 py-4 rounded-2xl text-base font-semibold transition-all duration-200 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}>
              Try Demo — no sign up
            </button>
          </div>

          {/* Hero visual — 3D tilt frame */}
          <div ref={heroRef} onMouseMove={handleHeroMouseMove} onMouseLeave={handleHeroMouseLeave}
            className="flex justify-center overflow-visible" style={{ perspective: '1400px' }}>
            <div style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: `transform ${tilt.x===0&&tilt.y===0 ? '0.9s' : '0.08s'} cubic-bezier(.22,.68,0,1.2)`,
              transformStyle: 'preserve-3d',
            }}>
              <div className="scale-75 sm:scale-100 origin-top">
                <FrameMockup scale={1.1} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }} />
      </section>

      {/* ══════════ SOCIAL PROOF BAR ══════════ */}
      <section className="py-12 border-b" style={{ borderColor: 'rgba(245,158,11,0.12)', background: '#fffbf5' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-[0.18em] mb-8" style={{ color: '#d97706', letterSpacing: '0.2em' }}>Home to families in 38 countries</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { n: '4,200+', l: 'Families at home' },
              { n: '38',     l: 'Countries' },
              { n: '1.2M+',  l: 'Memories synced' },
              { n: '4.9 ★',  l: 'Average family rating' },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="font-black text-3xl tracking-tight mb-1" style={{ letterSpacing: '-0.04em', color: '#d97706' }}>{s.n}</p>
                <p className="text-sm text-gray-500">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES — Part 1: Hero Feature (Wi-Fi Frame) ══════════ */}
      <section id="features" className="py-32 sm:py-44 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          {/* Section label */}
          <div className="text-center mb-16 sm:mb-20 reveal" ref={el => el && new IntersectionObserver(([e]) => e.isIntersecting && e.target.classList.add('visible'), { threshold: 0.2 }).observe(el)}>
            <p className="text-xs font-black uppercase tracking-[0.18em] mb-4" style={{ color: '#d97706' }}>What makes Kalenda home</p>
            <h2 className="font-black text-gray-900 mb-6" style={{ fontSize: 'clamp(2.875rem, 4vw, 3.25rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Four things your<br className="hidden sm:block" /> family will love.
            </h2>
            <p className="mx-auto" style={{ color: '#64748b', fontSize: '1.5rem', lineHeight: 1.3, maxWidth: '660px' }}>No more juggling 5 apps. One beautiful hub — photos, calendar, chores, and AI — that actually feels like home.</p>
          </div>

          {/* ── Hero feature: Wi-Fi Frame ── */}
          <div className="relative rounded-[36px] overflow-hidden mb-8 reveal" ref={el => el && new IntersectionObserver(([e]) => e.isIntersecting && e.target.classList.add('visible'), { threshold: 0.15 }).observe(el)}
            style={{ background: 'linear-gradient(135deg, #0b4040 0%, #1a6b6b 40%, #2d9b9b 100%)', minHeight: '400px' }}>

            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute orb-1" style={{ top: '-30%', right: '-15%', width: '60%', height: '120%', background: 'radial-gradient(circle, rgba(91,191,191,0.45) 0%, transparent 65%)', filter: 'blur(70px)' }} />
              <div className="absolute orb-2" style={{ bottom: '-20%', left: '-10%', width: '50%', height: '80%', background: 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 65%)', filter: 'blur(60px)' }} />
              <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-8 sm:p-12 lg:p-14">
              {/* Left: copy */}
              <div className="flex-1 max-w-md">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
                  style={{ background: 'rgba(251,191,36,0.22)', border: '1px solid rgba(251,191,36,0.4)', color: '#fde68a' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#fbbf24' }} /> Signature feature
                </div>
                <h3 className="font-black text-white mb-4" style={{ fontSize: 'clamp(1.75rem, 2.8vw, 2.25rem)', letterSpacing: '-0.03em', lineHeight: 1.12 }}>
                  Your memories, always on display.
                </h3>
                <p className="mb-6" style={{ color: 'rgba(255,255,255,0.72)', fontSize: '1.0625rem', lineHeight: 1.55 }}>
                  A living Wi-Fi photo frame that cycles your family's best moments — auto-synced from every phone. No USB, no fuss, just beauty.
                </p>
                <button onClick={openSignup}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white transition-all duration-200 active:scale-95"
                  style={{ background: 'rgba(255,255,255,0.16)', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}>
                  Try it free
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>

              {/* Right: key specs — no frame hardware repeat */}
              <div className="flex-shrink-0 w-full lg:w-72">
                {[
                  { label: 'Works on any screen', note: 'TV · tablet · spare phone' },
                  { label: 'Syncs in under 2 min', note: 'From any iOS or Android' },
                  { label: 'Runs 24 / 7 hands-free', note: 'Auto-rotates, no touching' },
                  { label: '4K photo quality', note: 'AI-upscaled before display' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 py-4"
                    style={{ borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: 'rgba(110,231,183,0.7)' }} />
                    <div>
                      <p className="font-semibold text-white" style={{ fontSize: '0.9375rem', lineHeight: 1.3 }}>{item.label}</p>
                      <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Secondary features: 3 cards ── */}
          <div className="grid sm:grid-cols-3 gap-5 lg:gap-6">
            {FEATURES.slice(1).map((f, fi) => (
              <div key={f.title}
                className={`reveal reveal-delay-${fi + 1} group relative rounded-3xl p-7 overflow-hidden transition-all duration-300 hover:-translate-y-1`}
                ref={el => el && new IntersectionObserver(([e]) => e.isIntersecting && e.target.classList.add('visible'), { threshold: 0.15 }).observe(el)}
                style={{ background: '#fffbf5', border: '1px solid rgba(245,158,11,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.08), 0 4px 16px ${f.color}20`; e.currentTarget.style.borderColor = f.color + '50'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = 'rgba(245,158,11,0.1)'; }}>

                {/* Corner glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle, ${f.color}20 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }} />

                {/* Icon */}
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: f.color + '18', border: `1.5px solid ${f.color}35`, boxShadow: `0 4px 14px ${f.color}22`, color: f.color }}>
                  {f.icon}
                </div>

                <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: f.color }}>{f.title}</p>
                <h3 className="text-gray-900 font-bold mb-3" style={{ fontSize: '1.25rem', letterSpacing: '-0.025em', lineHeight: 1.25 }}>{f.headline}</h3>
                <p className="text-gray-500 mb-5" style={{ fontSize: '1.0625rem', lineHeight: 1.55 }}>{f.body}</p>

                {f.title === 'AI Memory Studio' ? (
                    <div className="rounded-2xl overflow-hidden mt-1" style={{ border: `1px solid ${f.color}28`, height: '96px' }}>
                    <div className="flex" style={{ height: '76px' }}>
                      <div className="flex-1 relative overflow-hidden" style={{ background: '#e2e8f0' }}>
                        <div className="h-full flex flex-col items-center justify-center gap-2 px-3">
                          <div className="w-10 h-10 rounded-xl" style={{ background: 'linear-gradient(135deg, #cbd5e1, #94a3b8)', opacity: 0.55 }} />
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Before</p>
                            <p className="text-[9px] text-slate-400 text-center mt-0.5" style={{ lineHeight: 1.4 }}>Faded · Blurred</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-px" style={{ background: `${f.color}35` }} />
                      <div className="flex-1 relative overflow-hidden" style={{ background: `${f.color}12` }}>
                        <div className="h-full flex flex-col items-center justify-center gap-2 px-3">
                          <div className="w-10 h-10 rounded-xl" style={{ background: `linear-gradient(135deg, ${f.color}70, ${f.color})` }} />
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.15em] text-center" style={{ color: f.color }}>After</p>
                            <p className="text-[9px] text-center mt-0.5" style={{ lineHeight: 1.4, color: f.color }}>4K · Colorized</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="py-2 text-center text-[10px] font-bold" style={{ background: `${f.color}10`, color: f.color }}>
                      Colorized · 4K · Restored in 1 tap
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="how-it-works" className="py-32 sm:py-44" style={{ background: 'linear-gradient(165deg, #0b4040 0%, #165e5e 25%, #1e7a7a 55%, #2d9b9b 100%)' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.18em] mb-4" style={{ color: '#6ee7b7' }}>Setup in minutes</p>
            <h2 className="font-black mb-6" style={{ color: 'white', fontSize: 'clamp(2.875rem, 4vw, 3.25rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>You’re four steps away from home.</h2>
            <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: '1.5rem', lineHeight: 1.3 }}>No tech skills needed. If you can set up Netflix, you can set up Kalenda.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n:'1', title:'Download the app', body:'Install Kalenda on each family member\'s phone — iOS or Android.' },
              { n:'2', title:'Create your hub',   body:'Set up your family hub and invite each member with their colour.' },
              { n:'3', title:'Plug in your frame', body:'Open Kalenda on any screen and set it as your family frame display.' },
              { n:'4', title:'Enjoy together',     body:'Photos, calendar, chores and AI features are all live in seconds.' },
            ].map(step => (
              <div key={step.n} className="relative rounded-3xl p-7" style={{ background: 'rgba(255,255,255,0.09)', backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)', border:'1px solid rgba(255,255,255,0.15)', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.22)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black mb-5" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1.5px solid rgba(255,255,255,0.3)' }}>{step.n}</div>
                <h3 className="text-white font-bold mb-2" style={{ fontSize: '1rem', letterSpacing: '-0.01em' }}>{step.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '0.9375rem', lineHeight: 1.6 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="py-32 sm:py-44 overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.18em] mb-4" style={{ color: '#d97706' }}>From families who found their home</p>
            <h2 className="font-black text-gray-900 mb-6" style={{ fontSize: 'clamp(2.875rem, 4vw, 3.25rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Some things you can only feel.
            </h2>
            <div className="flex items-center justify-center gap-1">
              {Array(5).fill(0).map((_,i) => <span key={i} className="text-amber-400 text-lg">★</span>)}
              <span className="ml-2 text-gray-500 text-sm font-semibold">4.9 / 5 from 2,100+ reviews</span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="rounded-3xl p-7 flex flex-col" style={{ background: i % 3 === 1 ? 'linear-gradient(135deg, #0b4040, #1e7a7a)' : '#fffbf5', border: `1px solid ${i%3===1 ? 'rgba(255,255,255,0.12)' : 'rgba(245,158,11,0.12)'}`, boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                <p className="flex-1 mb-6" style={{ color: i%3===1 ? 'rgba(255,255,255,0.82)' : '#4b5563', fontStyle:'italic', fontSize: '1.0625rem', lineHeight: 1.6 }}>“{t.quote}”</p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: `1px solid ${i%3===1 ? 'rgba(255,255,255,0.12)' : 'rgba(226,236,240,0.7)'}` }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-sm font-black"
                    style={{ background: i%3===1 ? 'rgba(255,255,255,0.18)' : 'rgba(91,191,191,0.14)', color: i%3===1 ? 'white' : '#2d9b9b', border: i%3===1 ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(91,191,191,0.25)' }}>
                    {t.name.split(' ').map(w => w[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: i%3===1 ? 'white' : '#0f172a' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: i%3===1 ? 'rgba(255,255,255,0.48)' : '#94a3b8' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section id="pricing" className="py-32 sm:py-44" style={{ background: '#fffbf5' }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-black uppercase tracking-[0.18em] mb-4" style={{ color: '#d97706' }}>Find your family's plan</p>
            <h2 className="font-black text-gray-900 mb-6" style={{ fontSize: 'clamp(2.875rem, 4vw, 3.25rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>One price. Your whole family.</h2>
            <p className="mx-auto" style={{ color: '#64748b', fontSize: '1.5rem', lineHeight: 1.3, maxWidth: '660px' }}>One subscription. Your family’s memories, routines, and connection — finally in one place.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {PRICING.map((p, i) => (
              <div key={p.name} className="relative rounded-3xl p-7 flex flex-col transition-all duration-300"
                style={p.highlight
                  ? { background: 'linear-gradient(145deg, #0b4040, #1e7a7a)', border: '1px solid rgba(91,191,191,0.4)', boxShadow: '0 24px 64px rgba(11,64,64,0.25), 0 4px 16px rgba(91,191,191,0.20)' }
                  : { background: '#ffffff', border: '1px solid rgba(226,236,240,0.9)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                {p.badge && <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black" style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', color: '#1c1917', boxShadow:'0 4px 14px rgba(245,158,11,0.45)' }}>{p.badge}</div>}
                <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: p.highlight ? 'rgba(255,255,255,0.5)' : p.color }}>{p.name}</p>
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="font-black text-4xl" style={{ color: p.highlight ? 'white' : '#0f172a', letterSpacing:'-0.05em' }}>{p.price}</span>
                  <span className="text-sm font-medium" style={{ color: p.highlight ? 'rgba(255,255,255,0.5)' : '#94a3b8' }}>{p.period}</span>
                </div>
                <p className="text-sm mb-6" style={{ color: p.highlight ? 'rgba(255,255,255,0.6)' : '#64748b' }}>{p.desc}</p>
                <ul className="space-y-3 flex-1 mb-7">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: p.highlight ? 'rgba(255,255,255,0.85)' : '#374151' }}>
                      <svg viewBox="0 0 12 12" fill="none" className="w-4 h-4 shrink-0">
                        <circle cx="6" cy="6" r="6" fill={p.highlight ? 'rgba(255,255,255,0.18)' : p.color + '22'}/>
                        <path d="M3 6l2 2 4-4" stroke={p.highlight ? '#6ee7b7' : p.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={openSignup}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.98]"
                  style={p.highlight
                    ? { background: 'linear-gradient(135deg,#5bbfbf,#3ab5b5)', color: 'white', boxShadow: '0 4px 20px rgba(91,191,191,0.45), inset 0 1px 0 rgba(255,255,255,0.25)' }
                    : { background: 'rgba(245,158,11,0.07)', color: '#92400e', border: '1px solid rgba(245,158,11,0.2)' }}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">All plans include a 14-day free trial. Cancel anytime. No hidden fees.</p>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section id="faq" className="py-32 sm:py-44">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-black uppercase tracking-[0.18em] mb-4" style={{ color: '#d97706' }}>Got questions?</p>
            <h2 className="font-black text-gray-900" style={{ fontSize: 'clamp(2.875rem, 4vw, 3.25rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>Everything you’re wondering.</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl overflow-hidden transition-all duration-200"
                style={{ border: `1px solid ${openFaq===i ? 'rgba(245,158,11,0.3)' : 'rgba(226,236,240,0.8)'}`, background: openFaq===i ? '#fffbeb' : '#ffffff', boxShadow: openFaq===i ? '0 4px 20px rgba(245,158,11,0.06)' : 'none' }}>
                <button className="w-full flex items-center justify-between px-6 py-4.5 text-left" style={{ paddingTop:'18px', paddingBottom:'18px' }}
                  onClick={() => setOpenFaq(openFaq===i ? null : i)}>
                  <span className="font-semibold text-gray-900 pr-4 text-sm sm:text-base">{faq.q}</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-200"
                    style={{ background: openFaq===i ? 'rgba(245,158,11,0.18)' : 'rgba(0,0,0,0.06)', transform: openFaq===i ? 'rotate(45deg)' : 'none' }}>
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M6 2v8M2 6h8" stroke={openFaq===i ? '#d97706' : '#94a3b8'} strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                </button>
                {openFaq===i && <div className="px-6 pb-5 text-sm leading-relaxed text-gray-600">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="py-32 sm:py-44 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #0b4040 0%, #165e5e 30%, #1e7a7a 65%, #2d9b9b 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute orb-2" style={{ top:'-30%', right:'-20%', width:'60%', height:'60%', background:'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 65%)', filter:'blur(80px)' }}/>
          <div className="absolute orb-3" style={{ bottom:'-20%', left:'-10%', width:'55%', height:'55%', background:'radial-gradient(circle, rgba(91,191,191,0.4) 0%, transparent 65%)', filter:'blur(70px)' }}/>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] mb-5" style={{ color: '#6ee7b7' }}>Start today</p>
          <h2 className="font-black text-white mb-6" style={{ fontSize: 'clamp(2.875rem, 4vw, 3.25rem)', letterSpacing: '-0.03em', lineHeight: 1.15 }}>
            Your family deserves<br />a frame this good.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: '1.5rem', lineHeight: 1.35, maxWidth: '620px', margin: '0 auto 2.5rem' }}>
            4,200 families are already home. Join them — free to start, live in 4 minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={openSignup}
              className="flex items-center gap-2.5 px-8 rounded-2xl font-black transition-all duration-200 active:scale-95 text-base"
              style={{ paddingTop:'18px', paddingBottom:'18px', background:'linear-gradient(135deg,#d97706,#f59e0b 50%,#fbbf24 100%)', color:'#1c1917', boxShadow:'0 8px 32px rgba(245,158,11,0.45), inset 0 1px 0 rgba(255,255,255,0.35)', border:'1px solid rgba(255,255,255,0.2)', letterSpacing:'-0.01em' }}>
              Start your family's story
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={openSignin} className="px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:opacity-80" style={{ color:'rgba(255,255,255,0.78)' }}>
              Sign in instead
            </button>
          </div>
          <p className="mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.38)' }}>No credit card required · Cancel anytime · COPPA compliant</p>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="py-14 border-t" style={{ borderColor: 'rgba(245,158,11,0.12)', background:'#fffbf5' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8">

          {/* Single unified grid — brand full-width on mobile, 4-col on sm+ */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-8 gap-y-10 mb-12">

            {/* Brand + mission */}
            <div className="sm:col-span-1 flex flex-col items-center text-center sm:items-start sm:text-left">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background:'linear-gradient(135deg,#2d9b9b,#5bbfbf)', boxShadow:'0 4px 12px rgba(91,191,191,0.35)' }}>K</div>
                <span className="font-black text-gray-900 text-lg tracking-tight">Kalenda</span>
              </div>
              <p className="text-sm leading-relaxed mb-2 max-w-[240px]" style={{ color: '#d97706', fontStyle: 'italic', fontWeight: 600 }}>
                "Kalenda exists to bring families closer — one shared moment at a time."
              </p>
              <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-[240px]">
                The smart Wi-Fi photo frame built for modern families.
              </p>
              <div className="flex gap-3">
                <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                  style={{ background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.08)' }}>
                  <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5 shrink-0"><path d="M10.12 7.36c-.02-1.58.88-2.37 1.62-2.88-.9-1.28-2.28-1.43-2.77-1.46-1.18-.12-2.3.69-2.9.69-.6 0-1.54-.67-2.53-.65-1.3.02-2.5.76-3.17 1.92-1.35 2.35-.35 5.83.97 7.74.64.94 1.41 1.99 2.41 1.95.97-.04 1.33-.63 2.51-.63 1.18 0 1.5.63 2.53.61 1.04-.02 1.7-.95 2.34-1.9.47-.68.82-1.44 1.04-2.24-1.36-.58-2.05-2.14-2.05-3.15zM8.2 2.28C8.73 1.64 9.07.76 8.97 0c-.73.03-1.63.5-2.17 1.13-.48.56-.91 1.48-.79 2.34.79.06 1.6-.4 2.19-1.19z"/></svg>
                  App Store
                </a>
                <a href="https://play.google.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                  style={{ background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.08)' }}>
                  <svg viewBox="0 0 14 14" fill="currentColor" className="w-3.5 h-3.5 shrink-0"><path d="M1.5 1.07C1.19 1.4 1 1.93 1 2.63v8.74c0 .7.19 1.23.5 1.56l.08.08 4.9-4.9v-.11L1.58.99l-.08.08zm5.93 6.68L5.56 5.88v-.12l1.87-1.87.04.02 2.22 1.26c.63.36.63.94 0 1.3l-2.22 1.26-.04.02zM7.52 8l-1.96 1.96-4.06 4.06c.42.14.92.08 1.56-.28L9.7 10.1 7.52 8zM1.5.25 7.52 6 9.7 3.82 3.06.28C2.42-.08 1.92-.14 1.5.25z"/></svg>
                  Google Play
                </a>
              </div>
            </div>

            {/* Link columns */}
            {[
              { title: 'Product',  links: ['Features', 'Pricing', 'Changelog'] },
              { title: 'Company',  links: ['About', 'Blog', 'Careers'] },
              { title: 'Support',  links: ['Help Center', 'Privacy Policy', 'Contact'] },
            ].map(col => (
              <div key={col.title} className="text-center sm:text-left">
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">{col.title}</p>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}><a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-3" style={{ borderTop: '1px solid rgba(226,236,240,0.6)' }}>
            <p className="text-sm text-gray-400 text-center sm:text-left">© 2026 Kalenda · Built for families everywhere</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-400">All systems operational</span>
            </div>
          </div>

        </div>
      </footer>

      {/* ══════════ AUTH MODAL ══════════ */}
      {authOpen && <AuthModal onEnter={(n) => { setAuthOpen(false); onEnter(n); }} onClose={() => setAuthOpen(false)} initialMode={authMode} />}
    </div>
  );
}
