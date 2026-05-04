import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './Toast';

export const allPhotos = [
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

function UploadModal({ onClose, onUploaded }) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  function handleFiles(fileList) {
    const imgs = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    setFiles(imgs);
  }

  async function upload() {
    if (!files.length) return;
    setUploading(true);
    try {
      const { uploadPhoto } = await import('../api/photos.js');
      for (const file of files) {
        await uploadPhoto(file, null).catch(() => {});
      }
      setDone(true);
      onUploaded?.(files.length);
      setTimeout(onClose, 1200);
    } catch {
      setUploading(false);
    }
  }

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

        {/* Hidden file input */}
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={e => handleFiles(e.target.files)} />

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
            dragging ? 'border-amber-500 bg-amber-500/5' : files.length ? 'border-teal-400 bg-teal-500/5' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => inputRef.current?.click()}
        >
          {files.length ? (
            <>
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-teal-600 font-semibold text-sm">{files.length} photo{files.length !== 1 ? 's' : ''} selected</p>
              <p className="text-gray-400 text-xs mt-1">{files.map(f => f.name).join(', ').slice(0, 60)}{files.map(f => f.name).join(', ').length > 60 ? '…' : ''}</p>
            </>
          ) : (
            <>
              <div className="text-4xl mb-3">📸</div>
              <p className="text-gray-500 text-sm mb-1">Drag photos & videos here</p>
              <p className="text-gray-400 text-xs mb-4">or</p>
              <span className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold rounded-xl transition-colors inline-block">
                Browse Files
              </span>
            </>
          )}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="text-amber-400">✨</span>
            AI enhancement applied automatically on upload
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-gray-500 text-sm" style={{ border: '1px solid #e2ecf0' }}>Cancel</button>
          <button onClick={upload} disabled={!files.length || uploading}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40"
            style={{ background: done ? '#16a34a' : 'linear-gradient(135deg,#f59e0b,#d97706)' }}>
            {done ? '✅ Uploaded!' : uploading ? 'Uploading…' : `Upload ${files.length || ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}

const MEMBER_AVATARS = { Mom: '👩', Dad: '👨', Emma: '👧', Maya: '🧒', Jake: '👦', Grandma: '👵' };
const TAG_LABELS = {
  all: 'All', birthday: '🎂 Birthday', milestone: '🏆 Milestone', holiday: '🎄 Holiday',
  travel: '✈️ Travel', outdoors: '🌿 Outdoors', food: '🍽️ Food', family: '👨‍👩‍👧‍👦 Family',
  kids: '🧒 Kids', celebration: '🎉 Celebration', misc: '📌 Misc',
};

function getMonthKey(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr.slice(0, 7);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function formatMonthLabel(key) {
  const [y, m] = key.split('-');
  return new Date(+y, +m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
function groupByMonth(photos) {
  const map = {};
  photos.forEach(p => {
    const k = getMonthKey(p.date);
    if (!map[k]) map[k] = [];
    map[k].push(p);
  });
  return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
}

function PhotoCard({ photo, onClick, isSelected, selectMode, onToggleSelect, size }) {
  const isHero = size === 'hero';
  return (
    <button
      onClick={() => selectMode ? onToggleSelect(photo.id) : onClick(photo)}
      className={`group relative w-full h-full rounded-xl overflow-hidden focus:outline-none transition-all duration-200 ${isSelected ? 'ring-2 ring-amber-400 ring-offset-1' : 'hover:shadow-xl'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${photo.bg}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
      <div className={`absolute inset-0 flex items-center justify-center ${isHero ? 'text-6xl' : 'text-3xl'}`}>{photo.emoji}</div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className={`text-white font-semibold leading-tight truncate ${isHero ? 'text-sm' : 'text-[10px]'}`}>{photo.label}</p>
          <p className={`text-white/60 mt-0.5 ${isHero ? 'text-xs' : 'text-[9px]'}`}>{MEMBER_AVATARS[photo.who]} {photo.who} · {photo.date}</p>
        </div>
      </div>
      {photo.ai && (
        <div className="absolute top-2 right-2 bg-amber-500/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 text-[8px] font-bold text-black leading-none">✨ AI</div>
      )}
      {selectMode && (
        <div className={`absolute top-2 left-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-amber-400 bg-amber-400' : 'border-white/70 bg-black/20'}`}>
          {isSelected && <svg viewBox="0 0 16 16" fill="white" className="w-3 h-3"><path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 11l6.72-6.78a.75.75 0 011.06 0z"/></svg>}
        </div>
      )}
    </button>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ photo, filtered, onClose, onPrev, onNext, onDelete, selectedIdx }) {
  const touchStartX = useRef(null);
  return (
    <div
      className="fixed inset-0 z-50 flex"
      style={{ background: 'rgba(5,5,10,0.96)', backdropFilter: 'blur(20px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
      onTouchEnd={e => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? onNext() : onPrev(); }
        touchStartX.current = null;
      }}
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all">
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
      </button>
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-xs font-medium tabular-nums">{selectedIdx + 1} / {filtered.length}</div>
      <button onClick={onPrev} disabled={selectedIdx === 0}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all">
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.78 4.22a.75.75 0 010 1.06L7.06 8l2.72 2.72a.75.75 0 11-1.06 1.06L5.47 8.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0z" clipRule="evenodd"/></svg>
      </button>
      <button onClick={onNext} disabled={selectedIdx === filtered.length - 1}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all">
        <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M6.22 4.22a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
      </button>
      <div className="flex flex-col md:flex-row items-center justify-center w-full h-full px-16 md:px-20 gap-0 md:gap-8">
        <div className="flex-shrink-0 flex items-center justify-center">
          <div className={`relative rounded-2xl bg-gradient-to-br ${photo.bg} flex items-center justify-center overflow-hidden shadow-2xl`}
            style={{ width: 'min(72vw, 420px)', height: 'min(72vw, 420px)' }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
            <div style={{ fontSize: 'min(14vw, 120px)' }}>{photo.emoji}</div>
            {photo.ai && (
              <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-bold text-black">✨ AI Enhanced</div>
            )}
          </div>
        </div>
        <div className="flex flex-col md:w-64 mt-4 md:mt-0 shrink-0 max-w-xs w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl">{MEMBER_AVATARS[photo.who]}</div>
            <div>
              <p className="text-white font-medium text-sm">{photo.who}</p>
              <p className="text-white/40 text-xs">{photo.date}</p>
            </div>
          </div>
          <h3 className="text-white font-semibold text-lg leading-tight mb-3">{photo.label}</h3>
          {photo.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {photo.tags.map(t => (
                <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-white/10 text-white/60 capitalize">{t}</span>
              ))}
            </div>
          )}
          {photo.ai && (
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 mb-5">
              <p className="text-amber-400 text-xs font-semibold mb-0.5">✨ AI Enhanced</p>
              <p className="text-white/40 text-[11px]">Smart color grading, noise reduction & sharpness optimization applied.</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <button className="w-full py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-all text-left px-3 flex items-center gap-2">
              <span>🖼️</span> Send to Frame
            </button>
            <button className="w-full py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-white/70 hover:text-white transition-all text-left px-3 flex items-center gap-2">
              <span>📤</span> Share Photo
            </button>
            <button onClick={() => onDelete(photo.id)}
              className="w-full py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-300 transition-all text-left px-3 flex items-center gap-2">
              <span>🗑️</span> Delete Photo
            </button>
          </div>
          <div className="flex items-center justify-center gap-1 mt-6">
            {filtered.slice(Math.max(0, selectedIdx - 5), Math.min(filtered.length, selectedIdx + 6)).map((p, i) => {
              const absIdx = Math.max(0, selectedIdx - 5) + i;
              return <div key={p.id} className={`rounded-full transition-all ${absIdx === selectedIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/20'}`} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Photos({ photos: propPhotos, setPhotos: propSetPhotos }) {
  const [_photos, _setPhotos] = useState(allPhotos);
  const photos = propPhotos ?? _photos;
  const setPhotos = propSetPhotos ?? _setPhotos;
  const [memberFilter, setMemberFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [view, setView] = useState('timeline');
  const toast = useToast();

  useEffect(() => {
    import('../api/photos').then(({ listPhotos }) => {
      listPhotos().then(data => { if (data?.length > 0) setPhotos(data); }).catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = photos
    .filter(p => memberFilter === 'all' || p.who === memberFilter)
    .filter(p => tagFilter === 'all' || p.tags?.includes(tagFilter))
    .filter(p => !search || p.label.toLowerCase().includes(search.toLowerCase()) || p.who.toLowerCase().includes(search.toLowerCase()));

  const aiCount = photos.filter(p => p.ai).length;
  const members = ['all', 'Mom', 'Dad', 'Emma', 'Maya', 'Jake', 'Grandma'];
  const grouped = groupByMonth(filtered);
  const aiPhotos = photos.filter(p => p.ai).slice(0, 12);

  async function deletePhoto(id) {
    const prev = photos;
    setPhotos(p => p.filter(ph => ph.id !== id));
    setSelected(null);
    toast('Photo deleted', 'info');
    try {
      const { deletePhoto: apiDel } = await import('../api/photos');
      await apiDel(id);
    } catch { setPhotos(prev); toast('Could not delete photo', 'error'); }
  }

  function toggleSelect(id) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function bulkDelete() {
    const ids = [...selectedIds];
    setPhotos(p => p.filter(ph => !ids.includes(ph.id)));
    setSelectedIds(new Set());
    setSelectMode(false);
    toast(`${ids.length} photo${ids.length !== 1 ? 's' : ''} deleted`, 'info');
    ids.forEach(id => import('../api/photos').then(({ deletePhoto: d }) => d(id)).catch(() => {}));
  }

  const selectedIdx = selected ? filtered.findIndex(p => p.id === selected.id) : -1;
  const showPrev = useCallback(() => { if (selectedIdx > 0) setSelected(filtered[selectedIdx - 1]); }, [selectedIdx, filtered]);
  const showNext = useCallback(() => { if (selectedIdx < filtered.length - 1) setSelected(filtered[selectedIdx + 1]); }, [selectedIdx, filtered]);

  useEffect(() => {
    if (!selected) return;
    function onKey(e) {
      if (e.key === 'Escape') setSelected(null);
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, showPrev, showNext]);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0 bg-gray-50">
      {showUpload && (
        <UploadModal onClose={() => setShowUpload(false)} onUploaded={n => toast(`${n} photo${n !== 1 ? 's' : ''} uploaded`, 'success')} />
      )}
      {selected && (
        <Lightbox photo={selected} filtered={filtered} selectedIdx={selectedIdx}
          onClose={() => setSelected(null)} onPrev={showPrev} onNext={showNext} onDelete={deletePhoto} />
      )}

      {/* ── Header ── */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-xl border-b border-gray-100 px-4 md:px-6 pt-4 pb-3">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h1 className="text-gray-900 font-bold text-xl tracking-tight">Family Photos</h1>
            <p className="text-gray-400 text-xs mt-0.5">Shared memories, one place</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button onClick={() => setView('timeline')}
                className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${view === 'timeline' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                Timeline
              </button>
              <button onClick={() => setView('grid')}
                className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                Grid
              </button>
            </div>
            <button onClick={() => { setSelectMode(s => !s); setSelectedIds(new Set()); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectMode ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {selectMode ? 'Cancel' : 'Select'}
            </button>
            <button onClick={() => setShowUpload(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition-colors shadow-sm shadow-amber-200">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M8 2a.75.75 0 01.75.75V7.25h4.5a.75.75 0 010 1.5H8.75v4.5a.75.75 0 01-1.5 0V8.75H2.75a.75.75 0 010-1.5h4.5V2.75A.75.75 0 018 2z"/></svg>
              Add Photos
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mb-3 overflow-x-auto scrollbar-none pb-0.5">
          {[
            { label: 'Total Photos', value: photos.length, icon: '🖼️' },
            { label: 'Showing', value: filtered.length, icon: '🔍' },
            { label: 'AI Enhanced', value: aiCount, icon: '✨' },
            { label: 'Contributors', value: new Set(photos.map(p => p.who)).size, icon: '👥' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 shrink-0">
              <span className="text-base leading-none">{s.icon}</span>
              <div>
                <p className="text-gray-800 font-bold text-sm leading-none">{s.value}</p>
                <p className="text-gray-400 text-[10px] mt-0.5 whitespace-nowrap">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10.68 11.74a6 6 0 01-7.922-8.982 6 6 0 018.982 7.922l3.04 3.04a.749.749 0 11-1.06 1.06l-3.04-3.04zm-5.44.26A4.5 4.5 0 1010.5 7.5a4.5 4.5 0 00-4.5 4.5z"/>
          </svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title or person…"
            className="w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 transition-all" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
            </button>
          )}
        </div>

        {/* Member filter */}
        <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-none pb-0.5">
          {members.map(m => (
            <button key={m} onClick={() => setMemberFilter(m)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${memberFilter === m ? 'bg-gray-900 text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'}`}>
              {m !== 'all' && <span className="text-sm leading-none">{MEMBER_AVATARS[m]}</span>}
              {m === 'all' ? '👥 Everyone' : m}
            </button>
          ))}
        </div>

        {/* Tag filter */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          {Object.entries(TAG_LABELS).map(([tag, label]) => (
            <button key={tag} onClick={() => setTagFilter(tag)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border transition-all shrink-0 ${tagFilter === tag ? 'bg-amber-500 text-black border-amber-500 shadow-sm' : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectMode && selectedIds.size > 0 && (
        <div className="mx-4 md:mx-6 mt-3 rounded-2xl bg-gray-900 text-white px-4 py-3 flex items-center justify-between shadow-xl">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <div className="flex gap-2">
            <button onClick={() => setSelectedIds(new Set())} className="px-3 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-white/20 transition-colors">Clear</button>
            <button onClick={bulkDelete} className="px-3 py-1.5 rounded-lg text-xs bg-red-500/80 hover:bg-red-500 transition-colors font-medium">Delete All</button>
          </div>
        </div>
      )}

      <div className="px-4 md:px-6 py-5">
        {/* AI Highlights Strip */}
        {!search && memberFilter === 'all' && tagFilter === 'all' && aiPhotos.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-400 text-base leading-none">✨</span>
              <h2 className="text-gray-800 font-semibold text-sm">AI Highlights</h2>
              <span className="text-xs text-gray-400">{aiCount} photos enhanced</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
              {aiPhotos.map(p => (
                <button key={p.id} onClick={() => setSelected(p)}
                  className="shrink-0 relative rounded-xl overflow-hidden hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none"
                  style={{ width: 90, height: 90 }}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.bg}`} />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">{p.emoji}</div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-1.5 left-1.5 right-1.5">
                    <p className="text-white text-[9px] font-medium leading-tight truncate">{p.label}</p>
                  </div>
                  <div className="absolute top-1.5 right-1.5 bg-amber-400/90 rounded px-1 text-[7px] font-bold text-black leading-none py-0.5">AI</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-gray-700 font-semibold text-base mb-1">No photos found</h3>
            <p className="text-gray-400 text-sm mb-5">
              {search ? `No results for "${search}"` : 'Try changing your filters, or add some memories.'}
            </p>
            {!search && (
              <button onClick={() => setShowUpload(true)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors">
                Upload Photos
              </button>
            )}
          </div>
        )}

        {/* Timeline view */}
        {view === 'timeline' && grouped.map(([monthKey, monthPhotos]) => (
          <div key={monthKey} className="mb-9">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-gray-800 font-bold text-base">{formatMonthLabel(monthKey)}</h2>
              <span className="text-gray-400 text-xs">{monthPhotos.length} photo{monthPhotos.length !== 1 ? 's' : ''}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2" style={{ gridAutoRows: '1fr' }}>
              {monthPhotos.map((p, i) => (
                <div key={p.id} className={i === 0 ? 'col-span-2 row-span-2' : ''} style={{ aspectRatio: '1/1' }}>
                  <PhotoCard photo={p} onClick={setSelected} isSelected={selectedIds.has(p.id)}
                    selectMode={selectMode} onToggleSelect={toggleSelect} size={i === 0 ? 'hero' : 'normal'} />
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Grid view */}
        {view === 'grid' && (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
            {filtered.map(p => (
              <div key={p.id} style={{ aspectRatio: '1/1' }}>
                <PhotoCard photo={p} onClick={setSelected} isSelected={selectedIds.has(p.id)}
                  selectMode={selectMode} onToggleSelect={toggleSelect} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
