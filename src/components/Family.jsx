import { useState } from 'react';

const initialMembers = [
  { name: 'Harriet A.', role: 'Owner', avatar: 'bg-gradient-to-br from-rose-400 to-orange-400', joined: 'Jan 2026', photos: 312, status: 'active' },
  { name: 'Dad', role: 'Member', avatar: 'bg-gradient-to-br from-sky-400 to-blue-500', joined: 'Jan 2026', photos: 487, status: 'active' },
  { name: 'Mom', role: 'Member', avatar: 'bg-gradient-to-br from-rose-500 to-pink-500', joined: 'Jan 2026', photos: 621, status: 'active' },
  { name: 'Emma', role: 'Member', avatar: 'bg-gradient-to-br from-emerald-400 to-teal-500', joined: 'Feb 2026', photos: 203, status: 'active' },
  { name: 'Jake', role: 'Member', avatar: 'bg-gradient-to-br from-amber-400 to-orange-500', joined: 'Feb 2026', photos: 155, status: 'active' },
  { name: 'Grandma', role: 'Member', avatar: 'bg-gradient-to-br from-violet-400 to-purple-500', joined: 'Mar 2026', photos: 88, status: 'active' },
];

const initialPending = [
  { name: 'Uncle Bob', email: 'bob@example.com', sent: '2 days ago' },
];

function InviteModal({ onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  function handleSend() {
    if (!email.trim()) return;
    onInvite(email.trim(), role);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm p-6 rounded-2xl" style={{ background: '#ffffff', border: '1px solid #e2ecf0', boxShadow: '0 24px 80px rgba(0,0,0,0.12)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-800 font-semibold text-base">Invite Family Member</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="grandpa@example.com"
              autoFocus
              className="w-full rounded-xl px-3 py-2.5 text-gray-700 text-sm placeholder-gray-300 focus:outline-none focus:border-teal-500/50 transition-colors"
              style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }}
            />
          </div>
          <div>
            <label className="text-gray-400 text-xs mb-1.5 block">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-xl px-3 py-2.5 text-gray-600 text-sm focus:outline-none appearance-none" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }}>
              <option value="member">Member — can view &amp; share photos</option>
              <option value="viewer">Viewer — can only view photos</option>
            </select>
          </div>
          <button
            onClick={handleSend}
            className="btn-glass w-full justify-center mt-1"
          >
            Send Invite
          </button>
        </div>
        <p className="text-gray-400 text-xs text-center mt-3">
          They'll get a link to download Kalenda and join your family album.
        </p>
      </div>
    </div>
  );
}

export default function Family() {
  const [showInvite, setShowInvite] = useState(false);
  const [members, setMembers] = useState(initialMembers);
  const [pending, setPending] = useState(initialPending);

  function handleInvite(email, role) {
    const name = email.split('@')[0];
    setPending(prev => [...prev, { name, email, role, sent: 'Just now' }]);
  }

  function removeMember(name) {
    setMembers(prev => prev.filter(m => m.name !== name));
  }

  function cancelInvite(email) {
    setPending(prev => prev.filter(p => p.email !== email));
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0" style={{ background: 'transparent' }}>
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}

      {/* Topbar */}
      <div className="sticky top-0 z-10 px-4 md:px-6 py-3.5 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold">Family</h1>
          <p className="text-gray-400 text-xs mt-0.5">{members.length} members · {pending.length} pending invite{pending.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="btn-glass"
        >
          + Invite Member
        </button>
      </div>

      <div className="px-4 md:px-6 py-5 space-y-5">
        {/* Members list */}
        <div className="glass rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5" style={{ borderBottom: '1px solid #e8ecf0' }}>
              <h2 className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Members</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                <div className={`w-9 h-9 rounded-full ${m.avatar} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {m.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-800 text-sm font-medium">{m.name}</p>
                    {m.role === 'Owner' && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-400 font-semibold">Owner</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs">Joined {m.joined} · {m.photos} photos</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-gray-400 text-xs">Active</span>
                  </div>
                  {m.role !== 'Owner' && (
                    <button onClick={() => removeMember(m.name)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 text-xs px-2 py-1 rounded-lg hover:bg-red-50">
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending invites */}
        {pending.length > 0 && (
          <div className="glass rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5" style={{ borderBottom: '1px solid #e8ecf0' }}>
                <h2 className="text-gray-500 font-semibold text-xs uppercase tracking-wider">Pending Invites</h2>
            </div>
            {pending.map((p, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-bold">
                  {p.name[0]}
                </div>
                <div className="flex-1">
                <p className="text-gray-600 text-sm">{p.name}</p>
                <p className="text-gray-400 text-xs">{p.email} · Sent {p.sent}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                    Resend
                  </button>
                  <button onClick={() => cancelInvite(p.email)} className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contribution stats */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-gray-800 font-semibold text-sm mb-4">Photo Contributions</h2>
          <div className="space-y-2.5">
            {members.sort((a, b) => b.photos - a.photos).map((m, i) => {
              const pct = Math.round((m.photos / 621) * 100);
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full ${m.avatar} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                    {m.name[0]}
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-gray-500 text-xs w-16 truncate">{m.name}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #5bbfbf, #4db6ac)' }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs w-8 text-right">{m.photos}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
