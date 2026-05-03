import { useState } from 'react';

const allPhotos = [
  // May 2026
  { id: 1,  bg: 'from-rose-800 via-pink-700 to-orange-700',    emoji: '🌸', label: "Maya's Birthday Party",      who: 'Mom',     date: 'May 10, 2026', ai: true,  tags: ['birthday','family'] },
  { id: 2,  bg: 'from-violet-800 via-purple-700 to-fuchsia-800', emoji: '🎉', label: 'Party Decorations',           who: 'Emma',    date: 'May 10, 2026', ai: false, tags: ['birthday'] },
  { id: 3,  bg: 'from-amber-700 via-orange-600 to-red-700',    emoji: '🎂', label: 'Birthday Cake — 8 Candles',   who: 'Dad',     date: 'May 10, 2026', ai: true,  tags: ['birthday','food'] },
  { id: 4,  bg: 'from-emerald-800 via-teal-700 to-cyan-800',   emoji: '🌿', label: 'Morning Walk at Legon',       who: 'Dad',     date: 'May 8, 2026',  ai: false, tags: ['outdoors'] },
  { id: 5,  bg: 'from-pink-800 via-rose-700 to-fuchsia-800',   emoji: '💐', label: "Mother's Day Flowers",        who: 'Emma',    date: 'May 8, 2026',  ai: true,  tags: ['family','celebration'] },
  { id: 6,  bg: 'from-sky-800 via-blue-700 to-indigo-800',     emoji: '🌤️', label: 'Rooftop Sunday Brunch',       who: 'Mom',     date: 'May 5, 2026',  ai: true,  tags: ['food','family'] },
  { id: 7,  bg: 'from-lime-800 via-green-700 to-emerald-800',  emoji: '🌱', label: "Maya's Garden Project",       who: 'Maya',    date: 'May 3, 2026',  ai: false, tags: ['kids','outdoors'] },
  { id: 8,  bg: 'from-teal-800 via-cyan-700 to-sky-800',       emoji: '📸', label: 'Weekly Photo Dump',           who: 'Jake',    date: 'May 1, 2026',  ai: true,  tags: ['misc'] },
  // April 2026
  { id: 9,  bg: 'from-indigo-800 via-violet-700 to-purple-800', emoji: '🎹', label: "Emma's Piano Recital",       who: 'Mom',     date: 'Apr 27, 2026', ai: true,  tags: ['milestone','kids'] },
  { id: 10, bg: 'from-orange-800 via-amber-700 to-yellow-800', emoji: '☀️', label: 'After-School Ice Cream',      who: 'Dad',     date: 'Apr 24, 2026', ai: false, tags: ['kids','food'] },
  { id: 11, bg: 'from-cyan-800 via-sky-700 to-blue-800',       emoji: '🌊', label: 'Beach Day — Ada Foah',        who: 'Dad',     date: 'Apr 20, 2026', ai: true,  tags: ['travel','outdoors'] },
  { id: 12, bg: 'from-rose-900 via-red-800 to-orange-800',     emoji: '🌅', label: 'Sunrise at Ada Foah',         who: 'Dad',     date: 'Apr 20, 2026', ai: true,  tags: ['travel'] },
  { id: 13, bg: 'from-fuchsia-800 via-pink-700 to-rose-800',   emoji: '💕', label: 'Date Night — Osteria',        who: 'Mom',     date: 'Apr 18, 2026', ai: false, tags: ['family'] },
  { id: 14, bg: 'from-emerald-900 via-green-800 to-teal-800',  emoji: '🏕️', label: 'Weekend Camping Trip',        who: 'Jake',    date: 'Apr 14, 2026', ai: false, tags: ['outdoors','travel'] },
  { id: 15, bg: 'from-amber-900 via-yellow-800 to-lime-800',   emoji: '🔥', label: 'Campfire Night',              who: 'Jake',    date: 'Apr 14, 2026', ai: false, tags: ['outdoors'] },
  { id: 16, bg: 'from-sky-900 via-blue-800 to-violet-800',     emoji: '⛺', label: 'Morning Camp Coffee',         who: 'Dad',     date: 'Apr 15, 2026', ai: true,  tags: ['outdoors'] },
  { id: 17, bg: 'from-violet-900 via-indigo-800 to-blue-800',  emoji: '🌙', label: 'Stargazing at Home',          who: 'Emma',    date: 'Apr 10, 2026', ai: false, tags: ['kids','misc'] },
  { id: 18, bg: 'from-red-800 via-rose-700 to-pink-800',       emoji: '🍓', label: 'Strawberry Picking',          who: 'Maya',    date: 'Apr 6, 2026',  ai: true,  tags: ['outdoors','food'] },
  { id: 19, bg: 'from-green-800 via-lime-700 to-yellow-800',   emoji: '🌻', label: 'Botanical Garden Visit',      who: 'Mom',     date: 'Apr 3, 2026',  ai: true,  tags: ['outdoors'] },
  { id: 20, bg: 'from-blue-800 via-sky-700 to-teal-800',       emoji: '🚴', label: 'Sunday Bike Ride',            who: 'Jake',    date: 'Apr 1, 2026',  ai: false, tags: ['outdoors'] },
  // March 2026
  { id: 21, bg: 'from-pink-900 via-fuchsia-800 to-violet-800', emoji: '🐣', label: 'Easter Egg Hunt',             who: 'Dad',     date: 'Mar 29, 2026', ai: false, tags: ['holiday','kids'] },
  { id: 22, bg: 'from-yellow-800 via-amber-700 to-orange-700', emoji: '🥚', label: 'Decorating Easter Eggs',      who: 'Mom',     date: 'Mar 28, 2026', ai: true,  tags: ['holiday','kids'] },
  { id: 23, bg: 'from-teal-900 via-emerald-800 to-green-800',  emoji: '🌸', label: 'Cherry Blossom Season',       who: 'Emma',    date: 'Mar 22, 2026', ai: true,  tags: ['outdoors'] },
  { id: 24, bg: 'from-indigo-900 via-blue-800 to-sky-800',     emoji: '🎨', label: "Emma's Art Exhibition",      who: 'Mom',     date: 'Mar 18, 2026', ai: false, tags: ['milestone','kids'] },
  { id: 25, bg: 'from-orange-900 via-red-800 to-rose-800',     emoji: '🍕', label: 'Homemade Pizza Night',        who: 'Dad',     date: 'Mar 15, 2026', ai: false, tags: ['food','family'] },
  { id: 26, bg: 'from-purple-800 via-violet-700 to-indigo-800', emoji: '🎬', label: 'Movie Night Setup',           who: 'Jake',    date: 'Mar 10, 2026', ai: false, tags: ['family'] },
  { id: 27, bg: 'from-cyan-900 via-teal-800 to-emerald-800',   emoji: '🐠', label: 'Aquarium Trip',               who: 'Mom',     date: 'Mar 7, 2026',  ai: true,  tags: ['outdoors','kids'] },
  { id: 28, bg: 'from-lime-900 via-green-800 to-teal-800',     emoji: '⚽', label: "Jake's Football Match",      who: 'Dad',     date: 'Mar 3, 2026',  ai: false, tags: ['milestone','kids'] },
  // February 2026
  { id: 29, bg: 'from-rose-800 via-pink-600 to-red-700',       emoji: '❤️', label: "Valentine's Dinner",         who: 'Mom',     date: 'Feb 14, 2026', ai: true,  tags: ['celebration','family'] },
  { id: 30, bg: 'from-red-800 via-rose-600 to-pink-700',       emoji: '🌹', label: 'Rose Bouquet',                who: 'Dad',     date: 'Feb 14, 2026', ai: true,  tags: ['celebration'] },
  { id: 31, bg: 'from-sky-800 via-blue-600 to-cyan-700',       emoji: '☁️', label: 'Cloudy Afternoon Walk',       who: 'Emma',    date: 'Feb 11, 2026', ai: false, tags: ['outdoors'] },
  { id: 32, bg: 'from-violet-800 via-purple-600 to-pink-700',  emoji: '🎠', label: 'Funfair at the Mall',         who: 'Mom',     date: 'Feb 7, 2026',  ai: true,  tags: ['family','kids'] },
  { id: 33, bg: 'from-amber-800 via-yellow-600 to-lime-700',   emoji: '🍦', label: 'Ice Cream & Waffle Sunday',   who: 'Maya',    date: 'Feb 1, 2026',  ai: false, tags: ['food','kids'] },
  // January 2026
  { id: 34, bg: 'from-indigo-800 via-violet-700 to-blue-800',  emoji: '🎆', label: "New Year's Fireworks",        who: 'Dad',     date: 'Jan 1, 2026',  ai: true,  tags: ['celebration','holiday'] },
  { id: 35, bg: 'from-teal-800 via-cyan-600 to-sky-700',       emoji: '🥂', label: "New Year's Eve Toast",        who: 'Mom',     date: 'Dec 31, 2025', ai: false, tags: ['celebration','holiday'] },
  { id: 36, bg: 'from-green-900 via-emerald-700 to-teal-700',  emoji: '🎄', label: 'Christmas Morning',           who: 'Grandma', date: 'Dec 25, 2025', ai: true,  tags: ['holiday','family'] },
  { id: 37, bg: 'from-red-900 via-orange-700 to-yellow-700',   emoji: '🎁', label: 'Gift Unwrapping Chaos',       who: 'Jake',    date: 'Dec 25, 2025', ai: false, tags: ['holiday','kids'] },
  { id: 38, bg: 'from-fuchsia-900 via-violet-700 to-indigo-700', emoji: '⛄', label: 'Winter Wonderland Deco',     who: 'Emma',    date: 'Dec 22, 2025', ai: true,  tags: ['holiday'] },
  { id: 39, bg: 'from-amber-900 via-orange-700 to-rose-700',   emoji: '🦃', label: 'Thanksgiving Feast',          who: 'Grandma', date: 'Nov 27, 2025', ai: false, tags: ['holiday','food'] },
  { id: 40, bg: 'from-orange-900 via-red-700 to-amber-700',    emoji: '🍂', label: 'Autumn Leaves Walk',          who: 'Mom',     date: 'Nov 15, 2025', ai: true,  tags: ['outdoors'] },
  { id: 41, bg: 'from-lime-800 via-yellow-700 to-orange-700',  emoji: '🎃', label: 'Halloween Costumes',          who: 'Dad',     date: 'Oct 31, 2025', ai: false, tags: ['holiday','kids'] },
  { id: 42, bg: 'from-purple-900 via-fuchsia-700 to-pink-700', emoji: '🕷️', label: 'Pumpkin Carving Night',       who: 'Jake',    date: 'Oct 29, 2025', ai: false, tags: ['holiday','kids'] },
  { id: 43, bg: 'from-sky-900 via-cyan-700 to-teal-700',       emoji: '🏊', label: 'Pool Party — Summer',         who: 'Maya',    date: 'Aug 10, 2025', ai: true,  tags: ['outdoors','kids'] },
  { id: 44, bg: 'from-yellow-900 via-lime-700 to-green-700',   emoji: '🌞', label: 'Backyard Summer BBQ',         who: 'Dad',     date: 'Jul 4, 2025',  ai: false, tags: ['food','family'] },
  { id: 45, bg: 'from-rose-900 via-pink-700 to-orange-700',    emoji: '🌺', label: 'Hawaii Postcard Selfie',      who: 'Mom',     date: 'Jun 18, 2025', ai: true,  tags: ['travel'] },
  { id: 46, bg: 'from-emerald-900 via-teal-700 to-sky-700',    emoji: '🏔️', label: 'Mountain Road Trip',          who: 'Jake',    date: 'Jun 5, 2025',  ai: false, tags: ['travel','outdoors'] },
  { id: 47, bg: 'from-violet-900 via-blue-700 to-cyan-700',    emoji: '🎓', label: "Jake's Graduation Ceremony",  who: 'Grandma', date: 'May 22, 2025', ai: true,  tags: ['milestone'] },
  { id: 48, bg: 'from-pink-900 via-rose-700 to-amber-700',     emoji: '🌷', label: "Mom's 40th Birthday",         who: 'Dad',     date: 'Mar 3, 2025',  ai: true,  tags: ['birthday','milestone'] },
];

function UploadModal({ onClose }) {
  const [dragging, setDragging] = useState(false);
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="border rounded-2xl w-full max-w-md p-6" style={{ background: '#ffffff', border: '1px solid #e2ecf0', boxShadow: '0 24px 80px rgba(0,0,0,0.12)' }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-800 font-semibold text-base">Add Photos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
            </svg>
          </button>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); }}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
            dragging ? 'border-amber-500 bg-amber-500/5' : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-4xl mb-3">📸</div>
          <p className="text-gray-500 text-sm mb-1">Drag photos & videos here</p>
          <p className="text-gray-400 text-xs mb-4">or</p>
          <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-colors">
            Browse Files
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="text-amber-400">✨</span>
            AI enhancement applied automatically on upload
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-amber-500" />
            Send to all connected frames immediately
          </label>
        </div>
      </div>
    </div>
  );
}

const TAG_LABELS = { all: 'All', birthday: 'Birthday', milestone: 'Milestone', holiday: 'Holiday', travel: 'Travel', outdoors: 'Outdoors', food: 'Food', family: 'Family', kids: 'Kids', celebration: 'Celebration', misc: 'Misc' };

export default function Photos() {
  const [photos, setPhotos] = useState(allPhotos);
  const [filter, setFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [selected, setSelected] = useState(null);

  const members = ['all', 'Mom', 'Dad', 'Emma', 'Maya', 'Jake', 'Grandma'];
  const filtered = photos
    .filter((p) => filter === 'all' || p.who === filter)
    .filter((p) => tagFilter === 'all' || (p.tags && p.tags.includes(tagFilter)));

  function deletePhoto(id) {
    setPhotos(prev => prev.filter(p => p.id !== id));
    setSelected(null);
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0">
      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}

      {/* Topbar */}
      <div className="sticky top-0 z-10 px-4 md:px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold text-lg">Photos</h1>
          <p className="text-gray-500 text-xs mt-0.5">{filtered.length} of {photos.length} photos · 4.1 GB used</p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M8 2a.75.75 0 01.75.75V7.25h4.5a.75.75 0 010 1.5H8.75v4.5a.75.75 0 01-1.5 0V8.75H2.75a.75.75 0 010-1.5h4.5V2.75A.75.75 0 018 2z"/>
          </svg>
          Add Photos
        </button>
      </div>

      <div className="px-4 md:px-6 py-5">
        {/* Member filter */}
        <div className="flex gap-2 mb-2.5 flex-wrap">
          {members.map((m) => (
            <button
              key={m}
              onClick={() => setFilter(m)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                filter === m
                  ? 'bg-amber-500 text-black'
                  : 'bg-gray-100 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }`}
            >
              {m === 'all' ? 'Everyone' : m}
            </button>
          ))}
        </div>
        {/* Tag filter */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {Object.entries(TAG_LABELS).map(([tag, label]) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tag)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all ${
                tagFilter === tag
                  ? 'border-amber-500/50 text-amber-500 bg-amber-500/10'
                  : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
          {filtered.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(selected?.id === p.id ? null : p)}
              className="group relative aspect-square rounded-xl overflow-hidden focus:outline-none"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.bg}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">
                {p.emoji}
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-start justify-end p-2">
                <p className="text-white text-[10px] font-semibold leading-tight">{p.label}</p>
                <p className="text-white/50 text-[9px]">{p.who} · {p.date}</p>
              </div>
              {/* AI badge */}
              {p.ai && (
                <div className="absolute top-1.5 right-1.5 bg-amber-500/80 rounded-md px-1 py-0.5 text-[8px] font-bold text-black">
                  AI
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Photo detail panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-72 bg-white border-l border-gray-100 flex flex-col z-30 shadow-2xl">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <p className="text-gray-800 font-semibold text-sm">Photo Details</p>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 transition-colors">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/>
              </svg>
            </button>
          </div>
          <div className={`aspect-square w-full bg-gradient-to-br ${selected.bg} flex items-center justify-center text-5xl shrink-0`}>
            {selected.emoji}
          </div>
          <div className="p-4 space-y-3 overflow-y-auto scrollbar-thin">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Title</p>
              <p className="text-gray-800 text-sm font-medium">{selected.label}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Shared by</p>
              <p className="text-gray-800 text-sm">{selected.who}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Date</p>
              <p className="text-gray-800 text-sm">{selected.date}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">AI Enhancement</p>
              {selected.ai ? (
                <span className="inline-flex items-center gap-1.5 text-amber-400 text-sm">
                  <span>✨</span> Enhanced
                </span>
              ) : (
                <button className="text-xs text-gray-400 border border-gray-200 rounded-lg px-3 py-1.5 hover:border-amber-500/50 hover:text-amber-500 transition-colors">
                  Enhance now
                </button>
              )}
            </div>
            <div className="flex gap-2 pt-2">
              <button className="flex-1 py-2 text-xs bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 rounded-xl border border-gray-200 transition-colors">
                Send to Frame
              </button>
              <button onClick={() => deletePhoto(selected.id)} className="flex-1 py-2 text-xs bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-500 rounded-xl border border-gray-200 hover:border-red-300 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
