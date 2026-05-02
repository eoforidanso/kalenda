import { useState } from 'react';

const features = [
  { icon: '🖼️', title: 'Smart Photo Frame OS', desc: 'Display memories on any screen — auto-curated, always fresh.' },
  { icon: '📅', title: 'Shared Family Calendar', desc: 'One schedule, every member. Color-coded, conflict-free.' },
  { icon: '✨', title: 'AI Memory Studio', desc: 'Enhance, restore, and relive your best family moments.' },
  { icon: '🏡', title: 'Family Command Center', desc: 'Tasks, lists, meals, and chores — all in one place.' },
];

const testimonials = [
  { name: 'Sarah K.', role: 'Mom of 3', quote: 'Kalenda replaced our whiteboard, our frame, and our family group chat.', avatar: '👩' },
  { name: 'James T.', role: 'Dad', quote: 'The photo frame feature alone is worth every penny. Our grandparents love it.', avatar: '👨‍💼' },
  { name: 'Priya M.', role: 'Parent', quote: 'Finally, a family app that actually feels premium.', avatar: '👩‍💻' },
];

export default function Landing({ onEnter }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
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

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #2d9b9b 0%, #3ab5b5 40%, #5bbfbf 70%, #7ecece 100%)' }}
      >
        {/* Background texture orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #1a7a7a 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 60%)' }} />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg" style={{ background: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.4)' }}>
            K
          </div>
          <span className="text-white font-semibold text-xl tracking-tight">Kalenda</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.3)' }}>v2</span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 w-fit" style={{ background: 'rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.95)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse inline-block" />
            Now available · 4,200+ families
          </div>
          <h1 className="text-white font-bold leading-tight mb-5" style={{ fontSize: 'clamp(2.2rem, 3vw, 3rem)', textShadow: '0 2px 20px rgba(0,0,0,0.15)' }}>
            Your family's<br />digital heart.
          </h1>
          <p className="text-lg leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.85)', maxWidth: '400px' }}>
            One beautiful hub for your shared calendar, photo frames, memories, tasks, and everything in between.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 gap-3" style={{ maxWidth: '420px' }}>
            {features.map((f) => (
              <div key={f.title} className="flex items-start gap-3 p-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
                <span className="text-xl mt-0.5 flex-shrink-0">{f.icon}</span>
                <div>
                  <p className="text-white text-sm font-semibold">{f.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="relative z-10">
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {testimonials.map((t) => (
              <div key={t.name} className="flex-shrink-0 p-3.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', minWidth: '200px', maxWidth: '220px' }}>
                <p className="text-xs italic leading-relaxed mb-2.5" style={{ color: 'rgba(255,255,255,0.85)' }}>"{t.quote}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-base">{t.avatar}</span>
                  <div>
                    <p className="text-white text-xs font-semibold">{t.name}</p>
                    <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold" style={{ background: 'linear-gradient(135deg, #3ab5b5, #5bbfbf)' }}>K</div>
          <span className="text-gray-800 font-semibold text-xl">Kalenda</span>
        </div>

        {/* Card */}
        <div className="w-full max-w-md">

          {/* Mode toggle */}
          <div className="flex gap-1 p-1 rounded-2xl mb-8" style={{ background: '#f0f4f8', border: '1px solid #e2ecf0' }}>
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200"
              style={mode === 'signin'
                ? { background: '#ffffff', color: '#1e293b', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }
                : { background: 'transparent', color: '#94a3b8' }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(''); }}
              className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200"
              style={mode === 'signup'
                ? { background: '#ffffff', color: '#1e293b', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }
                : { background: 'transparent', color: '#94a3b8' }}
            >
              Create Account
            </button>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-bold text-gray-900 mb-1.5" style={{ fontSize: '1.6rem' }}>
              {mode === 'signin' ? 'Welcome back 👋' : 'Create your family hub'}
            </h2>
            <p className="text-gray-500 text-sm">
              {mode === 'signin'
                ? 'Sign in to your Kalenda account to continue.'
                : 'Get started free — your first 14 days are on us.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Harriet Appiah"
                  autoComplete="name"
                  className="w-full px-4 py-3.5 rounded-2xl text-sm text-gray-800 outline-none transition-all placeholder-gray-300"
                  style={{ background: '#f8fafc', border: '1.5px solid #e2ecf0', boxShadow: 'none' }}
                  onFocus={e => { e.target.style.borderColor = '#5bbfbf'; e.target.style.boxShadow = '0 0 0 3px rgba(91,191,191,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2ecf0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@family.com"
                autoComplete="email"
                className="w-full px-4 py-3.5 rounded-2xl text-sm text-gray-800 outline-none transition-all placeholder-gray-300"
                style={{ background: '#f8fafc', border: '1.5px solid #e2ecf0' }}
                onFocus={e => { e.target.style.borderColor = '#5bbfbf'; e.target.style.boxShadow = '0 0 0 3px rgba(91,191,191,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2ecf0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider">Password</label>
                {mode === 'signin' && (
                  <button type="button" className="text-xs font-medium" style={{ color: '#5bbfbf' }}>Forgot password?</button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                className="w-full px-4 py-3.5 rounded-2xl text-sm text-gray-800 outline-none transition-all placeholder-gray-300"
                style={{ background: '#f8fafc', border: '1.5px solid #e2ecf0' }}
                onFocus={e => { e.target.style.borderColor = '#5bbfbf'; e.target.style.boxShadow = '0 0 0 3px rgba(91,191,191,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#e2ecf0'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: '#fff1f1', border: '1px solid #fecaca', color: '#dc2626' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-semibold text-sm transition-all duration-200 mt-2"
              style={{
                background: loading ? '#8bd8d8' : 'linear-gradient(135deg, #3ab5b5 0%, #5bbfbf 100%)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(91,191,191,0.4)',
                letterSpacing: '0.01em',
              }}
            >
              {loading
                ? <span className="flex items-center justify-center gap-2"><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Signing in…</span>
                : mode === 'signin' ? 'Sign In to Kalenda' : 'Create My Family Hub →'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: '#e2ecf0' }} />
            <span className="text-xs text-gray-400 font-medium">or</span>
            <div className="flex-1 h-px" style={{ background: '#e2ecf0' }} />
          </div>

          {/* Social / Guest */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-sm font-medium text-gray-700 transition-all"
              style={{ background: '#ffffff', border: '1.5px solid #e2ecf0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#c0d8e0'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#e2ecf0'}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => onEnter('Guest')}
              className="w-full py-3 rounded-2xl text-sm font-medium transition-all"
              style={{ color: '#5bbfbf', background: 'transparent' }}
            >
              Explore as guest →
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-8 pt-6" style={{ borderTop: '1px solid #f0f4f8' }}>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M8 1L10.2 5.5L15 6.2L11.5 9.6L12.4 14.5L8 12.1L3.6 14.5L4.5 9.6L1 6.2L5.8 5.5L8 1Z" stroke="#10b981" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              End-to-end encrypted
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M8 1.5L13.5 4V8C13.5 11.5 11 14.3 8 15C5 14.3 2.5 11.5 2.5 8V4L8 1.5Z" stroke="#3ab5b5" strokeWidth="1.5" strokeLinejoin="round"/></svg>
              COPPA compliant
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><circle cx="8" cy="8" r="6.5" stroke="#f59e0b" strokeWidth="1.5"/><path d="M5.5 8L7 9.5L10.5 6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Free 14-day trial
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs text-gray-400">
          © 2026 Kalenda · <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy</span> · <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms</span>
        </p>
      </div>
    </div>
  );
}
