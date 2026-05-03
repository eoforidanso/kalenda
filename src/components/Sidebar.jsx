// Bottom nav items for mobile (5 most important)
const mobileNav = [
  { id: 'dashboard', label: 'Home', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8-8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg> },
  { id: 'calendar', label: 'Calendar', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg> },
  { id: 'photos', label: 'Photos', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/></svg> },
  { id: 'family', label: 'Family', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg> },
  { id: 'settings', label: 'More', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg> },
];

export default function Sidebar({ view, setView, notifUnread = 0, onSearchOpen }) {
  const nav = [
    {
      group: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm8-8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zm0 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/></svg> },
        { id: 'memories', label: 'Memories', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/></svg>, badge: 'New' },
      ],
    },
    {
      group: 'Library',
      items: [
        { id: 'photos', label: 'Photos', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"/></svg> },
        { id: 'albums', label: 'Albums', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg> },
        { id: 'calendar', label: 'Calendar', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg> },
      ],
    },
    {
      group: 'AI',
      items: [
        { id: 'aistudio', label: 'AI Studio', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zm4.657 2.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 006.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zm3 6v-1h4v1a2 2 0 11-4 0zm4-2a4 4 0 10-4 0h4z"/></svg>, badge: 'Beta' },
      ],
    },
    {
      group: 'Organizer',
      items: [
        { id: 'tasks', label: 'Chores & Tasks', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/></svg> },
        { id: 'lists', label: 'Lists', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg> },
      ],
    },
    {
      group: 'Sharing',
      items: [
        { id: 'family', label: 'Family', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg> },
        { id: 'frames', label: 'Frames', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8-1a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd"/></svg> },
        { id: 'notifications', label: 'Notifications', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>, badge: notifUnread > 0 ? String(notifUnread) : null },
      ],
    },
    {
      group: 'Account',
      items: [
        { id: 'settings', label: 'Settings', icon: <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg> },
      ],
    },
  ];

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col h-full relative z-10 glass-dark" style={{ borderRight: '1px solid #e2ecf0' }}>
      {/* Subtle top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />

      {/* Logo */}
      <div className="px-4 py-5" style={{ borderBottom: '1px solid #e2ecf0' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #5bbfbf 0%, #3a9e9e 100%)', boxShadow: '0 4px 12px rgba(91,191,191,0.35)' }}>
            <span className="text-white font-black text-xs">K</span>
          </div>
          <span className="font-bold text-gray-800 text-base tracking-tight">Kalenda</span>
          <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'rgba(91,191,191,0.12)', color: '#3a9e9e', border: '1px solid rgba(91,191,191,0.25)' }}>v2</span>
        </div>
        {/* Search button */}
        <button onClick={onSearchOpen}
          className="mt-3 w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-gray-400 hover:text-gray-600 text-xs transition-colors"
          style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid #e2ecf0' }}>
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 111.06-1.06l2.755 2.754a.75.75 0 11-1.06 1.06l-2.755-2.754zM10.5 7a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" clipRule="evenodd"/>
          </svg>
          <span className="flex-1 text-left">Search…</span>
          <kbd className="text-[9px] border border-gray-200 rounded px-1 font-mono text-gray-300">/</kbd>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin space-y-5">
        {nav.map((section) => (
          <div key={section.group}>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">{section.group}</p>
            <div className="space-y-1">
              {section.items.map((item) => {
                const active = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`nav-tab-3d w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left relative overflow-hidden ${
                      active ? 'text-teal-600 nav-tab-3d-active' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    style={active ? {
                      background: 'linear-gradient(135deg, rgba(91,191,191,0.15) 0%, rgba(77,182,172,0.08) 100%)',
                      border: '1px solid rgba(91,191,191,0.40)',
                    } : { border: '1px solid transparent' }}
                  >
                    {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-teal-500" />}
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        item.badge === 'New' ? 'bg-teal-500/15 text-teal-500' :
                        item.badge === 'Beta' ? 'bg-teal-500/20 text-teal-600' :
                        'bg-rose-500/20 text-rose-500'
                      }`}>{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Live sync indicator */}
      <div className="px-3 pt-4 pb-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.12)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-[10px] text-emerald-400/70 font-medium">Frame synced · 2 screens live</span>
        </div>
      </div>

      {/* Storage bar */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid #e2ecf0' }}>
        <div className="flex justify-between text-[10px] text-gray-400 mb-1.5">
          <span>Storage</span><span>4.1 GB / 5 GB</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(0,0,0,0.06)' }}>
          <div className="h-full rounded-full" style={{ width: '82%', background: 'linear-gradient(90deg, #5bbfbf, #4db6ac)' }} />
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #ec4899, #f97316)' }}>H</div>
          <div className="min-w-0 flex-1">
            <p className="text-gray-800 text-xs font-medium truncate">Harriet A.</p>
            <button onClick={() => setView('settings')} className="text-teal-500 text-[10px] hover:text-teal-600 transition-colors">Upgrade to Pro</button>
          </div>
        </div>
      </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-3"
        style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid #e2ecf0', paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}>
        {mobileNav.map(item => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all"
              style={active ? { color: '#3a9e9e' } : { color: '#94a3b8' }}
            >
              <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-teal-50' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
