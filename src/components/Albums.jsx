import { useState } from 'react';

const allAlbums = [
  { id: 1, name: 'Summer 2025', count: 142, cover: 'from-amber-700 to-orange-600', emoji: '☀️', members: ['M','D','E'], updated: '2 days ago' },
  { id: 2, name: 'Christmas 2025', count: 87, cover: 'from-red-800 to-rose-700', emoji: '🎄', members: ['M','D','G'], updated: '4 months ago' },
  { id: 3, name: "Maya's Birthdays", count: 214, cover: 'from-pink-700 to-fuchsia-700', emoji: '🎂', members: ['M','D','G','E'], updated: '1 month ago' },
  { id: 4, name: 'Travel', count: 331, cover: 'from-sky-700 to-indigo-700', emoji: '✈️', members: ['D','J'], updated: '3 weeks ago' },
  { id: 5, name: 'Everyday Moments', count: 892, cover: 'from-teal-700 to-emerald-700', emoji: '💚', members: ['M','D','E','J','G'], updated: 'Today' },
  { id: 6, name: 'Jake at Uni', count: 65, cover: 'from-violet-700 to-purple-700', emoji: '🎓', members: ['J'], updated: '1 week ago' },
];

const avatarColors = { M: 'bg-rose-400', D: 'bg-sky-400', E: 'bg-emerald-400', J: 'bg-amber-400', G: 'bg-violet-400' };

export default function Albums({ setView }) {
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0">
      <div className="sticky top-0 z-10 px-4 md:px-6 py-3.5 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold">Albums</h1>
          <p className="text-gray-500 text-xs">{allAlbums.length} albums · 1,731 photos</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors">
          + New Album
        </button>
      </div>

      {showCreate && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-2xl w-full max-w-sm p-6" style={{ background: '#ffffff', border: '1px solid #e2ecf0', boxShadow: '0 24px 80px rgba(0,0,0,0.12)' }}>
            <h2 className="text-gray-800 font-semibold mb-4">Create Album</h2>
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Album name" className="w-full rounded-xl px-3 py-2.5 text-gray-700 text-sm placeholder-gray-300 focus:outline-none focus:border-amber-500/50 mb-3" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }} />
            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-2">Cover emoji</p>
              <div className="flex gap-2 flex-wrap">
                {['📸','🌅','🎉','🏖️','❄️','🌸','🍂','✈️','🎓','💚','🎄','🎂'].map(e => (
                  <button key={e} className="text-xl p-1.5 rounded-lg hover:bg-gray-100 transition-colors">{e}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors">Create</button>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 md:px-6 py-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allAlbums.map((album) => (
            <button
              key={album.id}
              onClick={() => setSelected(selected?.id === album.id ? null : album)}
              className={`text-left rounded-2xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 ${
                selected?.id === album.id ? 'border-amber-500/40' : 'border-gray-200'
              } bg-white shadow-sm`}
            >
              {/* Cover */}
              <div className={`h-32 bg-gradient-to-br ${album.cover} relative flex items-center justify-center`}>
                <span className="text-5xl">{album.emoji}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute bottom-2 right-2 bg-black/50 rounded-lg px-2 py-0.5 text-white/70 text-[10px] font-medium">
                  {album.count} photos
                </div>
              </div>
              {/* Info */}
              <div className="p-3.5">
                <p className="text-gray-800 font-semibold text-sm mb-1">{album.name}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-1.5">
                    {album.members.map((m, j) => (
                      <div key={j} className={`w-5 h-5 rounded-full ${avatarColors[m]} border border-white flex items-center justify-center text-white text-[8px] font-bold`}>{m}</div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-[10px]">{album.updated}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Side panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-72 bg-white border-l border-gray-100 flex flex-col z-30 shadow-2xl">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-gray-800 font-semibold text-sm">{selected.name}</p>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
            </button>
          </div>
          <div className={`h-40 bg-gradient-to-br ${selected.cover} flex items-center justify-center text-6xl shrink-0`}>{selected.emoji}</div>
          <div className="p-4 space-y-3 overflow-y-auto scrollbar-thin">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-gray-800 font-bold text-lg">{selected.count}</p>
                <p className="text-gray-400 text-[10px]">Photos</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-gray-800 font-bold text-lg">{selected.members.length}</p>
                <p className="text-gray-400 text-[10px]">Members</p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-2">Contributors</p>
              <div className="flex gap-1.5 flex-wrap">
                {selected.members.map((m, i) => (
                  <div key={i} className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${avatarColors[m]}/20 text-xs text-gray-500`}>
                    <div className={`w-4 h-4 rounded-full ${avatarColors[m]} flex items-center justify-center text-white text-[8px] font-bold`}>{m}</div>
                    {m === 'M' ? 'Mom' : m === 'D' ? 'Dad' : m === 'E' ? 'Emma' : m === 'J' ? 'Jake' : 'Grandma'}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 py-2 text-xs bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl transition-colors">
                Send to Frame
              </button>
              <button className="flex-1 py-2 text-xs bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-xl border border-gray-200 transition-colors">
                Share Link
              </button>
            </div>
            <button className="w-full py-2 text-xs text-red-400/60 border border-red-500/10 rounded-xl hover:bg-red-500/5 hover:text-red-400 transition-colors">
              Delete Album
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
