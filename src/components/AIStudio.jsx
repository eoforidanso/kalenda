import { useState } from 'react';

const tools = [
  { id: 'enhance', label: 'AI Enhance', icon: '✨', desc: 'Auto-boost exposure, clarity & color', badge: null },
  { id: 'restore', label: 'Restore', icon: '🔄', desc: 'Repair old or damaged photos', badge: null },
  { id: 'colorize', label: 'Colorize', icon: '🎨', desc: 'B&W to vibrant color', badge: 'New' },
  { id: 'upscale', label: 'Upscale 4×', icon: '🔍', desc: 'Increase resolution with AI', badge: null },
  { id: 'background', label: 'BG Remove', icon: '✂️', desc: 'Remove or replace background', badge: null },
  { id: 'caption', label: 'Auto Caption', icon: '💬', desc: 'Generate photo captions with AI', badge: 'Beta' },
];

const samplePhotos = [
  { bg: 'from-rose-800 to-pink-700', emoji: '🌸', label: "Maya's Birthday" },
  { bg: 'from-sky-800 to-blue-700', emoji: '🌊', label: 'Beach Day' },
  { bg: 'from-emerald-800 to-teal-700', emoji: '🌿', label: 'Forest Hike' },
  { bg: 'from-amber-800 to-orange-700', emoji: '🍂', label: 'Fall Walk' },
  { bg: 'from-violet-800 to-purple-700', emoji: '🎉', label: 'Party Night' },
  { bg: 'from-indigo-800 to-blue-700', emoji: '🌌', label: 'Night Sky' },
];

const queue = [
  { photo: '🌸', label: "Maya's Birthday", status: 'completed', tool: 'AI Enhance' },
  { photo: '🌊', label: 'Beach Day', status: 'completed', tool: 'AI Enhance' },
  { photo: '🌿', label: 'Forest Hike', status: 'processing', tool: 'Upscale 4×' },
  { photo: '📷', label: 'Scanned 1998 photo', status: 'pending', tool: 'Restore + Colorize' },
  { photo: '📷', label: 'Scanned 2001 photo', status: 'pending', tool: 'Restore' },
];

const statusColor = { completed: 'text-emerald-500 bg-emerald-500/10', processing: 'text-amber-500 bg-amber-500/10 animate-pulse', pending: 'text-gray-400 bg-gray-100' };

export default function AIStudio({ setView }) {
  const [activeTool, setActiveTool] = useState('enhance');
  const [selectedPhoto, setSelectedPhoto] = useState(samplePhotos[0]);
  const [strength, setStrength] = useState(75);
  const [beforeAfter, setBeforeAfter] = useState(false);

  const tool = tools.find(t => t.id === activeTool);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="sticky top-0 z-10 px-6 py-3.5 flex items-center justify-between shrink-0" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold">AI Studio</h1>
          <p className="text-gray-500 text-xs">Enhance, restore & transform your family photos</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-2 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 font-semibold">Beta</span>
          <button className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors">Batch Enhance</button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        {/* Left: photo selector + preview */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-100">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
            <div className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${selectedPhoto.bg} relative overflow-hidden shadow-2xl`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.12),transparent_60%)]" />
              <div className="absolute inset-0 flex items-center justify-center text-7xl">{selectedPhoto.emoji}</div>
              {beforeAfter && (
                <div className="absolute inset-0 right-1/2 bg-black/50 backdrop-grayscale flex items-center justify-center">
                  <span className="text-white/40 text-xs font-medium rotate-90">BEFORE</span>
                </div>
              )}
              {beforeAfter && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-full bg-white/50 z-10" />
              )}
              <div className="absolute bottom-3 left-3 right-3">
                <div className="bg-black/60 rounded-xl px-3 py-1.5">
                  <p className="text-white text-xs font-medium">{selectedPhoto.label}</p>
                  {beforeAfter && <p className="text-emerald-400 text-[10px]">← Before / After →</p>}
                </div>
              </div>
            </div>
            <button onClick={() => setBeforeAfter(!beforeAfter)} className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${beforeAfter ? 'border-amber-500/40 text-amber-500 bg-amber-500/10' : 'border-gray-200 text-gray-500 hover:text-gray-700 bg-white/80'}`}>
              {beforeAfter ? 'Before/After: ON' : 'Compare'}
            </button>
          </div>

          {/* Photo strip */}
          <div className="px-4 pb-4 shrink-0">
            <p className="text-gray-400 text-[10px] mb-2 uppercase tracking-wider font-semibold">Select Photo</p>
            <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
              {samplePhotos.map((p, i) => (
                <button key={i} onClick={() => setSelectedPhoto(p)} className={`shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${p.bg} relative transition-all ${selectedPhoto.label === p.label ? 'ring-2 ring-amber-500 scale-105' : 'opacity-50 hover:opacity-80'}`}>
                  <span className="absolute inset-0 flex items-center justify-center text-xl">{p.emoji}</span>
                </button>
              ))}
              <button className="shrink-0 w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 hover:border-amber-500/30 text-gray-300 hover:text-amber-400 transition-colors flex items-center justify-center text-2xl">+</button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-72 flex flex-col overflow-y-auto scrollbar-thin">
          {/* Tools */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mb-2">Tools</p>
            <div className="grid grid-cols-2 gap-1.5">
              {tools.map(t => (
                <button key={t.id} onClick={() => setActiveTool(t.id)} className={`p-2.5 rounded-xl border text-left transition-all ${activeTool === t.id ? 'border-amber-500/40 bg-amber-500/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-sm">{t.icon}</span>
                    {t.badge && <span className="text-[8px] px-1 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-bold">{t.badge}</span>}
                  </div>
                  <p className={`text-xs font-medium ${activeTool === t.id ? 'text-amber-500' : 'text-gray-600'}`}>{t.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active tool controls */}
          <div className="p-4 border-b border-gray-100 space-y-4">
            <div>
              <p className="text-gray-800 text-sm font-medium mb-0.5">{tool.icon} {tool.label}</p>
              <p className="text-gray-400 text-[11px]">{tool.desc}</p>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Strength</span><span className="text-amber-500 font-semibold">{strength}%</span>
              </div>
              <input type="range" min="0" max="100" value={strength} onChange={e => setStrength(Number(e.target.value))}
                className="w-full accent-amber-500" />
            </div>
            {activeTool === 'enhance' && (
              <div className="space-y-2">
                {['Auto Exposure', 'Sharpen', 'Noise Reduction', 'Color Boost'].map(opt => (
                  <label key={opt} className="flex items-center justify-between cursor-pointer">
                    <span className="text-gray-500 text-xs">{opt}</span>
                    <div className="w-8 h-4 rounded-full bg-amber-500 relative">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-white" />
                    </div>
                  </label>
                ))}
              </div>
            )}
            <button className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-colors">
              Apply {tool.label}
            </button>
          </div>

          {/* Queue */}
          <div className="p-4">
            <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold mb-3">Queue</p>
            <div className="space-y-2">
              {queue.map((q, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <span className="text-lg">{q.photo}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-500 text-xs truncate">{q.label}</p>
                    <p className="text-gray-400 text-[10px]">{q.tool}</p>
                  </div>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${statusColor[q.status]}`}>
                    {q.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
