import { useState, useEffect } from 'react';

// Type → colour map for avatar placeholder when there's no "who" user
const TYPE_COLOR = {
  photos: 'bg-sky-400', reactions: 'bg-rose-400', system: 'bg-violet-400',
  family: 'bg-amber-400', events: 'bg-teal-400', chores: 'bg-emerald-400', birthday: 'bg-pink-400',
};

const fallbackNotifications = [
  { id: 'f1', type: 'photos',    icon: '🌊', who: 'Dad',    whoColor: 'bg-sky-400',    action: 'shared 3 new photos',         sub: 'Beach Day album',         time: '2m ago',    unread: true  },
  { id: 'f2', type: 'reactions', icon: '❤️', who: 'Mom',   whoColor: 'bg-rose-400',   action: 'reacted to your photo',       sub: "Maya's Birthday",         time: '18m ago',   unread: true  },
  { id: 'f3', type: 'family',    icon: '👋', who: 'System', whoColor: 'bg-amber-400',  action: 'Grandma joined your family',  sub: 'Welcome Grandma!',        time: '3h ago',    unread: false },
  { id: 'f4', type: 'system',    icon: '📊', who: 'Kalenda',whoColor: 'bg-violet-400', action: 'Your weekly digest is ready', sub: '42 photos · 6 reactions', time: '1 day ago', unread: false },
];

function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'yesterday' : `${d} days ago`;
}

function fromApi(n) {
  return {
    id:       n.id,
    type:     n.type,
    icon:     n.icon ?? '🔔',
    who:      n.title?.split(' ')[0] ?? 'Kalenda',
    whoColor: TYPE_COLOR[n.type] ?? 'bg-gray-400',
    action:   n.body ?? '',
    sub:      '',
    time:     timeAgo(n.createdAt),
    unread:   !n.read,
    _raw:     n,
  };
}

const filters = ['All', 'Unread', 'Photos', 'Reactions', 'Events', 'Chores', 'Family', 'System'];

export default function Notifications({ setView, onUnreadChange }) {
  const [filter, setFilter]             = useState('All');
  const [notifications, setNotifications] = useState(fallbackNotifications);
  const [loading, setLoading]           = useState(true);

  // Load real notifications
  useEffect(() => {
    import('../api/notifications.js').then(({ listNotifications }) =>
      listNotifications().then(data => {
        if (Array.isArray(data) && data.length) {
          setNotifications(data.map(fromApi));
        }
        setLoading(false);
      }).catch(() => setLoading(false))
    );
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;
  useEffect(() => { onUnreadChange?.(unreadCount); }, [unreadCount]);

  const filtered = notifications.filter(n => {
    if (filter === 'All')    return true;
    if (filter === 'Unread') return n.unread;
    return n.type === filter.toLowerCase();
  });

  async function markAllRead() {
    setNotifications(ns => ns.map(n => ({ ...n, unread: false })));
    try {
      const { markAllRead: apiMarkAll } = await import('../api/notifications.js');
      await apiMarkAll();
    } catch {}
  }

  async function dismiss(id) {
    setNotifications(ns => ns.filter(n => n.id !== id));
    try {
      const { dismissNotification } = await import('../api/notifications.js');
      await dismissNotification(id);
    } catch {}
  }

  async function markOneRead(id) {
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, unread: false } : n));
    try {
      const { markRead } = await import('../api/notifications.js');
      await markRead(id);
    } catch {}
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0" style={{ background: 'transparent' }}>
      <div className="sticky top-0 z-10 px-4 md:px-6 py-3.5 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
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

      <div className="px-4 md:px-6 py-4">
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${filter === f ? 'bg-teal-500/15 text-teal-500 border-teal-500/30' : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'}`}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 rounded-full border-2 border-teal-400 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-3">🎉</span>
            <p className="text-gray-400 text-sm">All caught up!</p>
            <p className="text-gray-300 text-xs mt-1">No notifications to show.</p>
          </div>
        ) : (
          <div className="space-y-1.5 max-w-2xl">
            {filtered.map(n => (
              <div key={n.id}
                onClick={() => n.unread && markOneRead(n.id)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all group cursor-pointer ${n.unread ? 'bg-teal-500/5 border-teal-500/15' : 'border-transparent hover:bg-gray-50'}`}>
                <div className={`w-8 h-8 rounded-full ${n.whoColor} flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5`}>
                  {n.who[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-sm">
                    <span className="text-gray-800 font-medium">{n.who}</span>{' '}
                    {n.action}
                  </p>
                  {n.sub && <p className="text-gray-400 text-xs mt-0.5">{n.sub}</p>}
                  <p className="text-gray-400 text-[10px] mt-1">{n.time}</p>
                </div>
                <span className="text-lg shrink-0">{n.icon}</span>
                <button
                  onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-gray-500 shrink-0 ml-1">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
                </button>
                {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0 mt-1.5" />}
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-gray-100">
          <button onClick={() => setView('settings')} className="text-gray-400 text-xs hover:text-gray-600 transition-colors">
            Manage notification preferences →
          </button>
        </div>
      </div>
    </div>
  );
}
