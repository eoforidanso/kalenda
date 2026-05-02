import { useState } from 'react';

const yearGroups = [
  {
    year: 2024,
    memories: [
      { month: 'Dec', emoji: '🎄', label: 'Christmas morning unwrapping', photos: 34, gradient: 'from-red-800 to-rose-700' },
      { month: 'Aug', emoji: '🏖️', label: 'Cape Coast beach vacation', photos: 87, gradient: 'from-amber-700 to-orange-600' },
      { month: 'May', emoji: '🎂', label: "Jake's 20th birthday", photos: 19, gradient: 'from-violet-700 to-purple-700' },
    ],
  },
  {
    year: 2023,
    memories: [
      { month: 'Nov', emoji: '🍂', label: 'Family Thanksgiving photos', photos: 42, gradient: 'from-orange-800 to-amber-700' },
      { month: 'Jun', emoji: '🌸', label: 'Cherry blossom park walk', photos: 28, gradient: 'from-pink-700 to-rose-700' },
      { month: 'Jan', emoji: '❄️', label: 'New Year snowfall', photos: 11, gradient: 'from-sky-800 to-blue-700' },
    ],
  },
  {
    year: 2022,
    memories: [
      { month: 'Apr', emoji: '🐣', label: 'Easter egg hunt in garden', photos: 22, gradient: 'from-emerald-700 to-teal-700' },
      { month: 'Jul', emoji: '🎆', label: 'Independence Day fireworks', photos: 16, gradient: 'from-indigo-800 to-violet-700' },
    ],
  },
];

const todayMemories = [
  { year: 2024, emoji: '🌸', label: "Mom's birthday garden lunch", photos: 14 },
  { year: 2023, emoji: '🎉', label: 'Surprise party for Grandma', photos: 28 },
  { year: 2022, emoji: '🐣', label: 'Easter morning', photos: 8 },
];

const milestones = [
  { icon: '📸', label: 'First Photo Uploaded', date: 'Mar 12, 2021', sub: 'by Dad' },
  { icon: '❤️', label: 'Most Reacted Photo', date: 'Dec 25, 2023', sub: '47 reactions' },
  { icon: '🔥', label: 'Most Active Month', date: 'August 2024', sub: '142 photos' },
  { icon: '👨‍👩‍👧‍👦', label: 'Family Joined Kalenda', date: 'Mar 1, 2021', sub: '6 members over time' },
];

export default function Memories({ setView }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="sticky top-0 z-10 px-4 md:px-6 py-3.5 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold">Memories</h1>
          <p className="text-gray-500 text-xs">Relive your family's story</p>
        </div>
      </div>

      <div className="px-4 md:px-6 py-5 space-y-6">
        {/* On This Day hero */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📅</span>
            <div>
              <h2 className="text-gray-800 font-semibold">On This Day</h2>
              <p className="text-amber-500 text-xs">May 1st in past years</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {todayMemories.map((m, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                <span className="text-3xl block mb-2">{m.emoji}</span>
                <p className="text-gray-800 text-xs font-medium mb-1">{m.label}</p>
                <p className="text-gray-400 text-[10px]">{m.year} · {m.photos} photos</p>
                <button onClick={() => setView('photos')} className="mt-2 text-amber-400 text-[10px] hover:text-amber-300 transition-colors">View photos →</button>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="glass rounded-2xl p-5">
          <h2 className="text-gray-800 font-semibold text-sm mb-4">Family Milestones</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {milestones.map((m, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-3 text-center bg-gray-50">
                <span className="text-3xl block mb-2">{m.icon}</span>
                <p className="text-gray-600 text-xs font-medium mb-1">{m.label}</p>
                <p className="text-amber-500 text-[11px] font-semibold">{m.date}</p>
                <p className="text-gray-400 text-[10px]">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Year timeline */}
        <div>
          <h2 className="text-gray-800 font-semibold text-sm mb-4">Memory Timeline</h2>
          <div className="space-y-6">
            {yearGroups.map((group) => (
              <div key={group.year}>
                <button onClick={() => setExpanded(expanded === group.year ? null : group.year)} className="flex items-center gap-3 mb-3 w-full text-left group">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <span className="text-amber-400 font-bold text-xs">{group.year}</span>
                  </div>
                  <div className="h-px flex-1 bg-gray-100" />
                  <svg viewBox="0 0 16 16" fill="currentColor" className={`w-3.5 h-3.5 text-gray-400 transition-transform ${expanded === group.year ? 'rotate-180' : ''}`}><path fillRule="evenodd" d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
                </button>
                {(expanded === null || expanded === group.year) && (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {group.memories.map((m, i) => (
                      <div key={i} className={`rounded-2xl overflow-hidden bg-gradient-to-br ${m.gradient} relative group cursor-pointer hover:-translate-y-0.5 transition-transform`} style={{ height: 120 }}>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)]" />
                        <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-70">{m.emoji}</div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                          <div>
                            <p className="text-white font-semibold text-xs leading-tight">{m.label}</p>
                            <p className="text-white/50 text-[10px]">{m.month} {group.year} · {m.photos} photos</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
