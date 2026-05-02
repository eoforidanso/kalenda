import { useState } from 'react';

function Toggle({ value, onChange, accent = '#5bbfbf' }) {
  return (
    <button onClick={() => onChange(!value)}
      className="relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0"
      style={{ background: value ? accent : 'rgba(0,0,0,0.10)' }}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function Section({ title, subtitle, children, accent }) {
  return (
    <div className="glass rounded-2xl p-5" style={accent ? { border: `1px solid ${accent}25` } : {}}>
      <h2 className="text-gray-800 font-semibold text-sm mb-1">{title}</h2>
      {subtitle && <p className="text-gray-400 text-xs mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  );
}

function InputField({ label, value, onChange, disabled, type = 'text' }) {
  return (
    <div>
      <label className="text-gray-400 text-xs mb-1.5 block">{label}</label>
      <input type={type} value={value} onChange={onChange} disabled={disabled}
        className={`w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors ${disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 focus:border-teal-500/50'}`}
        style={{ background: disabled ? 'rgba(0,0,0,0.02)' : '#f8fafc', border: `1px solid ${disabled ? '#e8ecf0' : '#e2ecf0'}` }} />
    </div>
  );
}

const SYNC_PROVIDERS = [
  { id: 'google',  label: 'Google Calendar',      icon: '🔵', color: '#4285F4', connected: true,  email: 'harriet@gmail.com', lastSync: '2 min ago' },
  { id: 'apple',   label: 'Apple Calendar',       icon: '🍎', color: '#ffffff', connected: false, email: '',                  lastSync: null        },
  { id: 'outlook', label: 'Outlook / Office 365', icon: '📘', color: '#0078D4', connected: false, email: '',                  lastSync: null        },
  { id: 'ical',    label: 'iCal / .ics Feed',     icon: '📅', color: '#a78bfa', connected: false, email: '',                  lastSync: null        },
];

const REMINDER_PRESETS = ['5 min', '15 min', '30 min', '1 hour', '1 day', '2 days'];

export default function Settings() {
  const [name, setName]           = useState('Harriet Appiah');
  const [email]                   = useState('harriet@example.com');

  // Notifications
  const [notifyPhoto, setNotifyPhoto]       = useState(true);
  const [notifyReact, setNotifyReact]       = useState(true);
  const [notifyEvents, setNotifyEvents]     = useState(true);
  const [notifyChores, setNotifyChores]     = useState(true);
  const [notifyBirthday, setNotifyBirthday] = useState(true);
  const [notifyWeekly, setNotifyWeekly]     = useState(true);
  const [agendaEmail, setAgendaEmail]       = useState(true);
  const [agendaTime, setAgendaTime]         = useState('7:00 AM');

  // Calendar sync
  const [syncProviders, setSyncProviders]     = useState(SYNC_PROVIDERS);
  const [syncing, setSyncing]                 = useState(null);
  const [defaultReminder, setDefaultReminder] = useState('30 min');
  const [secondReminder, setSecondReminder]   = useState('1 day');
  const [calSyncNotify, setCalSyncNotify]     = useState(true);

  // AI
  const [aiEnhance, setAiEnhance] = useState(true);
  const [aiRestore, setAiRestore] = useState(true);
  const [aiMealAI, setAiMealAI]   = useState(true);

  // Mobile app
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsSent, setSmsSent]         = useState(false);

  function handleConnect(id) {
    setSyncing(id);
    setTimeout(() => {
      setSyncProviders(prev => prev.map(p => p.id === id ? { ...p, connected: true, email: 'harriet@example.com', lastSync: 'Just now' } : p));
      setSyncing(null);
    }, 1800);
  }

  function handleDisconnect(id) {
    setSyncProviders(prev => prev.map(p => p.id === id ? { ...p, connected: false, email: '', lastSync: null } : p));
  }

  function sendAppLink() {
    setSmsSent(true);
    setTimeout(() => setSmsSent(false), 3000);
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ background: 'transparent' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-3.5" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <h1 className="text-gray-800 font-semibold">Settings</h1>
        <p className="text-gray-400 text-xs mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="px-6 py-5 max-w-2xl space-y-5">

        {/* ── PROFILE ─────────────────────────────── */}
        <Section title="Profile">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: 'linear-gradient(135deg, #f472b6, #fb7185)' }}>H</div>
            <div>
              <button className="text-xs text-teal-500 hover:text-teal-600 transition-colors">Change photo</button>
              <p className="text-gray-400 text-xs mt-0.5">JPG or PNG, max 2 MB</p>
            </div>
          </div>
          <div className="space-y-3">
            <InputField label="Display name" value={name} onChange={e => setName(e.target.value)} />
            <InputField label="Email" value={email} disabled />
          </div>
          <button className="mt-4 btn-glass">Save Changes</button>
        </Section>

        {/* ── CALENDAR SYNC ───────────────────────── */}
        <Section title="Calendar Sync" subtitle="Connect your calendars so family events appear automatically — like Skylight & Cozi." accent="#5bbfbf">
          <div className="space-y-3">
            {syncProviders.map(p => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors"
                style={{ background: p.connected ? `${p.color}0d` : 'rgba(0,0,0,0.02)', border: `1px solid ${p.connected ? p.color + '30' : '#e2ecf0'}` }}>
                <span className="text-2xl shrink-0">{p.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 text-sm font-medium">{p.label}</p>
                  {p.connected
                    ? <p className="text-gray-400 text-xs">{p.email} · Synced {p.lastSync}</p>
                    : <p className="text-gray-400 text-xs">Not connected</p>}
                </div>
                {p.connected ? (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> Synced
                    </span>
                    <button onClick={() => handleDisconnect(p.id)} className="text-gray-400 hover:text-red-500 text-xs transition-colors px-2 py-1 rounded-lg" style={{ border: '1px solid #e2ecf0' }}>
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleConnect(p.id)}
                    className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all text-white"
                    style={{ background: syncing === p.id ? 'rgba(91,191,191,0.3)' : 'linear-gradient(135deg,#5bbfbf,#4db6ac)', boxShadow: '0 2px 8px rgba(91,191,191,0.35)', opacity: syncing === p.id ? 0.7 : 1 }}
                    disabled={syncing === p.id}>
                    {syncing === p.id ? 'Connecting…' : 'Connect'}
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid #e2ecf0' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Notify family on calendar changes</p>
                <p className="text-gray-400 text-xs">Alert everyone when events are added or updated</p>
              </div>
              <Toggle value={calSyncNotify} onChange={setCalSyncNotify} />
            </div>
          </div>
        </Section>

        {/* ── REMINDERS ───────────────────────────── */}
        <Section title="Reminders" subtitle="Set default reminders for events — up to 2 per event, like Cozi Gold." accent="#22d3ee">
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-xs mb-2 block">First reminder (default)</label>
              <div className="flex flex-wrap gap-2">
                {REMINDER_PRESETS.map(r => (
                  <button key={r} onClick={() => setDefaultReminder(r)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={defaultReminder === r
                      ? { background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.4)', color: '#22d3ee' }
                      : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.45)' }}>
                    {r} before
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-2 block">Second reminder</label>
              <div className="flex flex-wrap gap-2">
                {['None', ...REMINDER_PRESETS].map(r => (
                  <button key={r} onClick={() => setSecondReminder(r)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                    style={secondReminder === r
                      ? { background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.4)', color: '#22d3ee' }
                      : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.45)' }}>
                    {r === 'None' ? 'None' : `${r} before`}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-3" style={{ borderTop: '1px solid #e2ecf0' }}>
              <div>
                <p className="text-gray-600 text-sm">Daily agenda email</p>
                <p className="text-gray-400 text-xs">Get tomorrow's schedule emailed each morning · like Cozi</p>
              </div>
              <Toggle value={agendaEmail} onChange={setAgendaEmail} accent="#22d3ee" />
            </div>
            {agendaEmail && (
              <div>
                <label className="text-gray-400 text-xs mb-1.5 block">Send agenda at</label>
                <select value={agendaTime} onChange={e => setAgendaTime(e.target.value)}
                  className="rounded-xl px-3 py-2.5 text-gray-700 text-sm focus:outline-none appearance-none"
                  style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }}>
                  {['6:00 AM','6:30 AM','7:00 AM','7:30 AM','8:00 AM','8:30 AM','9:00 AM'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            )}
          </div>
        </Section>

        {/* ── NOTIFICATIONS ───────────────────────── */}
        <Section title="Notifications" subtitle="Choose what alerts you receive.">
          <div className="space-y-0">
            {[
              { label: 'New photo shared',         sub: 'When a family member adds a photo',               state: notifyPhoto,    set: setNotifyPhoto    },
              { label: 'Reactions',                 sub: 'When someone reacts to your photo',               state: notifyReact,    set: setNotifyReact    },
              { label: 'Event reminders',           sub: 'Push alerts before events (uses default above)',  state: notifyEvents,   set: setNotifyEvents   },
              { label: 'Chore assignments',         sub: 'When a chore is assigned to you',                state: notifyChores,   set: setNotifyChores   },
              { label: 'Birthday reminders',        sub: '3 days and 1 day before a birthday',             state: notifyBirthday, set: setNotifyBirthday },
              { label: 'Weekly digest',             sub: 'Summary of family activity each Sunday',         state: notifyWeekly,   set: setNotifyWeekly   },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div>
                  <p className="text-gray-600 text-sm">{row.label}</p>
                  <p className="text-gray-400 text-xs">{row.sub}</p>
                </div>
                <Toggle value={row.state} onChange={row.set} />
              </div>
            ))}
          </div>
        </Section>

        {/* ── MOBILE APP ──────────────────────────── */}
        <Section title="📱 Get the Kalenda App" subtitle="Access your family calendar, lists, and chores on the go — iOS & Android." accent="#f472b6">
          <div className="grid sm:grid-cols-2 gap-3 mb-4">
            <a href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-colors" style={{ background: '#f5f8fa', border: '1px solid #e2ecf0' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 shrink-0 opacity-60 text-gray-600"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">Download on the</p>
                <p className="text-gray-800 font-semibold text-sm">App Store</p>
              </div>
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-colors" style={{ background: '#f5f8fa', border: '1px solid #e2ecf0' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 shrink-0 opacity-60 text-gray-600"><path d="M3.18 23.76c.3.17.65.19.98.07l12.49-7.2-2.76-2.77-10.71 9.9zm-1.7-20.3C1.2 3.83 1 4.28 1 4.86v14.29c0 .58.2 1.03.48 1.4l.07.07 8.01-8.01v-.19L1.48 3.41l-.01.05zm19.33 8.27l-2.82-1.63-3.11 3.11 3.11 3.11 2.84-1.64c.81-.47.81-1.23-.02-1.95zM4.16.24L16.65 7.44 13.89 10.2 3.18.3c.33-.12.7-.1.98.06-.01-.01-.01-.07 0-.12z"/></svg>
              <div>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider">Get it on</p>
                <p className="text-gray-800 font-semibold text-sm">Google Play</p>
              </div>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="flex-1 rounded-xl px-3 py-2.5 text-gray-700 text-sm placeholder-gray-300 focus:outline-none"
              style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }} />
            <button onClick={sendAppLink}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all shrink-0"
              style={{ background: smsSent ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg,#f472b6,#fb7185)', border: smsSent ? '1px solid rgba(52,211,153,0.4)' : 'none' }}>
              {smsSent ? '✓ Sent!' : 'Text me a link'}
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-2">We'll send a one-time download link. No spam.</p>
        </Section>

        {/* ── AI SETTINGS ─────────────────────────── */}
        <Section title="AI Enhancement" subtitle="Kalenda Vision runs on every photo before it goes to your frame.">
          <div className="space-y-0">
            {[
              { label: 'Auto-enhance on upload', sub: 'Sharpening, colour correction, exposure', state: aiEnhance, set: setAiEnhance },
              { label: 'Photo restoration',       sub: 'Fix old or blurry photos automatically', state: aiRestore, set: setAiRestore },
              { label: 'AI meal suggestions',     sub: 'Suggest weekly meals using Kalenda AI',  state: aiMealAI,  set: setAiMealAI  },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                <div>
                  <p className="text-gray-600 text-sm">{row.label}</p>
                  <p className="text-gray-400 text-xs">{row.sub}</p>
                </div>
                <Toggle value={row.state} onChange={row.set} />
              </div>
            ))}
          </div>
        </Section>

        {/* ── PLAN ────────────────────────────────── */}
        <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(91,191,191,0.25)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-gray-800 font-semibold text-sm">Your Plan</h2>
              <p className="text-gray-400 text-xs mt-0.5">Free tier</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full text-gray-500 font-medium" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid #e2ecf0' }}>Free</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Frames', used: 1, max: 1 },
              { label: 'Storage', used: '4.1 GB', max: '5 GB' },
              { label: 'Members', used: 6, max: '∞' },
            ].map((s, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid #e2ecf0' }}>
                <p className="text-gray-400 text-[10px] mb-1">{s.label}</p>
                <p className="text-gray-800 text-sm font-semibold">{s.used} <span className="text-gray-400 text-xs font-normal">/ {s.max}</span></p>
              </div>
            ))}
          </div>
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-400 mb-1"><span>4.1 GB used</span><span>5 GB</span></div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
              <div className="h-full rounded-full" style={{ width: '82%', background: 'linear-gradient(90deg,#5bbfbf,#4db6ac)' }} />
            </div>
          </div>
          <div className="mb-5 space-y-2">
            {['Unlimited storage','Up to 10 calendar syncs','Unlimited frames','Priority AI processing','Advanced reminder scheduling','Mobile app (iOS & Android)'].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5 shrink-0"><path d="M2 6l3 3 5-5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <p className="text-gray-500 text-xs">{f}</p>
              </div>
            ))}
          </div>
          <button className="btn-glass w-full justify-center py-3 text-base">Upgrade to Pro — $4.99 / mo</button>
        </div>

        {/* ── DANGER ZONE ─────────────────────────── */}
        <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(239,68,68,0.12)' }}>
          <h2 className="text-red-400/70 text-sm font-semibold mb-3">Danger Zone</h2>
          <div className="flex gap-3">
            <button className="flex-1 py-2 text-xs text-gray-400 rounded-xl hover:bg-gray-50 transition-colors" style={{ border: '1px solid #e2ecf0' }}>
              Export all photos
            </button>
            <button className="flex-1 py-2 text-xs text-red-400/60 rounded-xl hover:bg-red-500/5 hover:text-red-400 transition-colors" style={{ border: '1px solid rgba(239,68,68,0.12)' }}>
              Delete account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
