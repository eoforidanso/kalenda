import { useState } from 'react';

const allNotifications = [
  { id: 1, type: 'photos', icon: '🌊', who: 'Dad', whoColor: 'bg-sky-400', action: 'shared 3 new photos', sub: 'Beach Day album', time: '2m ago', unread: true },
  { id: 2, type: 'reactions', icon: '❤️', who: 'Mom', whoColor: 'bg-rose-400', action: 'reacted to your photo', sub: 'Maya\'s Birthday', time: '18m ago', unread: true },
  { id: 3, type: 'system', icon: '✨', who: 'AI Studio', whoColor: 'bg-violet-400', action: 'enhanced 12 photos for you', sub: 'Auto-enhancement complete', time: '45m ago', unread: true },
  { id: 4, type: 'photos', icon: '🎂', who: 'Emma', whoColor: 'bg-emerald-400', action: 'shared 8 photos', sub: 'Birthday Album', time: '1h ago', unread: true },
  { id: 5, type: 'system', icon: '📡', who: 'System', whoColor: 'bg-white/30', action: 'Living Room frame went offline', sub: 'Last seen 1h 12m ago', time: '1h ago', unread: false },
  { id: 6, type: 'family', icon: '👋', who: 'System', whoColor: 'bg-amber-400', action: 'Grandma joined your family', sub: 'Welcome Grandma!', time: '3h ago', unread: false },
  { id: 7, type: 'reactions', icon: '😄', who: 'Jake', whoColor: 'bg-amber-400', action: 'reacted to 5 photos', sub: 'Various albums', time: '5h ago', unread: false },
  { id: 8, type: 'system', icon: '📊', who: 'Kalenda', whoColor: 'bg-violet-400', action: 'Your weekly digest is ready', sub: '42 photos · 6 reactions', time: '1 day ago', unread: false },
  { id: 9, type: 'photos', icon: '🌸', who: 'Mom', whoColor: 'bg-rose-400', action: 'added 14 photos to Spring 2025', sub: 'Spring 2025 album', time: '2 days ago', unread: false },
  { id: 10, type: 'system', icon: '💾', who: 'System', whoColor: 'bg-white/30', action: 'Storage at 82% — consider upgrading', sub: '4.1 GB of 5 GB used', time: '3 days ago', unread: false },
];

const filters = ['All', 'Unread', 'Photos', 'Reactions', 'System', 'Family'];

export default function Notifications({ setView }) {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState(allNotifications);

  const unreadCount = notifications.filter(n => n.unread).length;

  const filtered = notifications.filter(n => {
    if (filter === 'All') return true;
    if (filter === 'Unread') return n.unread;
    return n.type === filter.toLowerCase();
  });

  const markAllRead = () => setNotifications(ns => ns.map(n => ({ ...n, unread: false })));
  const dismiss = (id) => setNotifications(ns => ns.filter(n => n.id !== id));

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin" style={{ background: 'transparent' }}>
      <div className="sticky top-0 z-10 px-6 py-3.5 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div className="flex items-center gap-2">
          <h1 className="text-gray-800 font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">{unreadCount}</span>
          )}
        </div>
        <button onClick={markAllRead} className="text-teal-500 text-xs hover:text-teal-600 transition-colors">
          Mark all read
        </button>
      </div>

      <div className="px-6 py-4">
        {/* Filters */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${filter === f ? 'bg-teal-500/15 text-teal-500 border-teal-500/30' : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-3">🎉</span>
            <p className="text-gray-400 text-sm">All caught up!</p>
            <p className="text-gray-300 text-xs mt-1">No notifications to show.</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-w-2xl">
            {filtered.map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all group ${n.unread ? 'bg-teal-500/5 border-teal-500/15' : 'border-transparent hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-full ${n.whoColor} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>
                  {n.who[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-sm">
                    <span className="text-gray-800 font-medium">{n.who}</span>{' '}
                    {n.action}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{n.sub}</p>
                  <p className="text-gray-400 text-[10px] mt-1">{n.time}</p>
                </div>
                <span className="text-lg shrink-0">{n.icon}</span>
                <button onClick={() => dismiss(n.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500 shrink-0 ml-1">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
                </button>
                {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        )}

        {/* Prefs */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          <button onClick={() => setView('settings')} className="text-gray-400 text-xs hover:text-gray-600 transition-colors">
            Manage notification preferences →
          </button>
        </div>
      </div>
    </div>
  );
}
