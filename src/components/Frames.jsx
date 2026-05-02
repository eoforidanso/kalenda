import { useState } from 'react';

const frameData = {
  name: 'Living Room',
  model: 'Kalenda 15"',
  resolution: '1920 × 1080',
  status: 'online',
  wifi: 'HomeNetwork_5G',
  ip: '192.168.1.42',
  brightness: 70,
  volume: 40,
  interval: 12,
  currentPhoto: { bg: 'from-rose-800 via-pink-700 to-orange-700', emoji: '🌸', label: "Maya's Birthday", who: 'Mom' },
  firmware: '2.4.1',
  lastSeen: 'Just now',
};

export default function Frames() {
  const [brightness, setBrightness] = useState(frameData.brightness);
  const [interval, setInterval] = useState(frameData.interval);
  const [autoBrightness, setAutoBrightness] = useState(true);
  const [showPhotos, setShowPhotos] = useState(true);
  const [showClock, setShowClock] = useState(true);
  const [showWeather, setShowWeather] = useState(true);
  const [showCalendar, setShowCalendar] = useState(true);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0">
      {/* Topbar */}
      <div className="sticky top-0 z-10 px-4 md:px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold text-lg">Frames</h1>
          <p className="text-gray-500 text-xs mt-0.5">1 frame connected</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors border border-gray-200">
          + Add Frame
        </button>
      </div>

      <div className="px-4 md:px-6 py-5 grid lg:grid-cols-2 gap-5">
        {/* Left: Frame preview + status */}
        <div className="space-y-4">
          {/* Preview card */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-gray-800 font-semibold">{frameData.name}</h2>
                <p className="text-gray-400 text-xs">{frameData.model}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-medium">Online</span>
              </div>
            </div>

            {/* Frame mockup */}
            <div className="rounded-2xl bg-gradient-to-b from-neutral-700 to-neutral-900 p-1 border border-white/10 shadow-2xl mb-4">
              <div className={`rounded-xl aspect-video bg-gradient-to-br ${frameData.currentPhoto.bg} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
                <div className="absolute top-3 left-4">
                  <p className="text-white/80 text-xl font-light font-mono">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-white/40 text-[10px]">
                    {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-5xl">
                  {frameData.currentPhoto.emoji}
                </div>
                <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-black/50 flex items-center justify-between">
                  <span className="text-white/70 text-[10px]">{frameData.currentPhoto.label}</span>
                  <span className="text-white/40 text-[10px]">by {frameData.currentPhoto.who}</span>
                </div>
              </div>
            </div>

            {/* Now playing controls */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Now showing</p>
                <p className="text-gray-800 text-sm font-medium">{frameData.currentPhoto.label}</p>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M9.035 8L6.11 5.258a.5.5 0 01.88-.316l3.5 4a.5.5 0 010 .316l-3.5 4a.5.5 0 01-.88-.316L9.035 8z" transform="scale(-1,1) translate(-16,0)"/>
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M6 3.5a.5.5 0 01.5.5v8a.5.5 0 01-1 0V4a.5.5 0 01.5-.5zm4 0a.5.5 0 01.5.5v8a.5.5 0 01-1 0V4a.5.5 0 01.5-.5z"/>
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center transition-colors">
                  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M9.035 8L6.11 5.258a.5.5 0 01.88-.316l3.5 4a.5.5 0 010 .316l-3.5 4a.5.5 0 01-.88-.316L9.035 8z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Network info */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Network & Device</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Wi-Fi', value: frameData.wifi },
                { label: 'IP Address', value: frameData.ip },
                { label: 'Resolution', value: frameData.resolution },
                { label: 'Firmware', value: `v${frameData.firmware}` },
                { label: 'Last Seen', value: frameData.lastSeen },
                { label: 'Model', value: frameData.model },
              ].map((row, i) => (
                <div key={i}>
                  <p className="text-gray-400 text-xs">{row.label}</p>
                  <p className="text-gray-700 text-sm font-medium">{row.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="space-y-4">
          {/* Display settings */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">Display Settings</h3>

            <div className="space-y-4">
              {/* Brightness */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-600 text-sm">Brightness</label>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoBrightness}
                        onChange={(e) => setAutoBrightness(e.target.checked)}
                        className="accent-amber-500 w-3 h-3"
                      />
                      Auto
                    </label>
                    <span className="text-amber-400 text-sm font-mono w-8 text-right">{brightness}%</span>
                  </div>
                </div>
                <input
                  type="range" min={10} max={100} value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  disabled={autoBrightness}
                  className="w-full accent-amber-500 disabled:opacity-30"
                />
              </div>

              {/* Slideshow interval */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-gray-600 text-sm">Slideshow Interval</label>
                  <span className="text-amber-400 text-sm font-mono">{interval}s</span>
                </div>
                <input
                  type="range" min={5} max={60} step={5} value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-gray-300 text-[10px] mt-1">
                  <span>5s</span><span>30s</span><span>60s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay settings */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-4">Overlays on Frame</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Show Photos & Videos', sub: 'Display uploaded family photos', state: showPhotos, set: setShowPhotos },
                { label: 'Clock & Date', sub: 'Live clock displayed on screen', state: showClock, set: setShowClock },
                { label: 'Weather', sub: 'Local forecast on the frame', state: showWeather, set: setShowWeather },
                { label: 'Family Calendar', sub: 'Upcoming events & birthdays', state: showCalendar, set: setShowCalendar },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-gray-600 text-sm">{row.label}</p>
                    <p className="text-gray-400 text-xs">{row.sub}</p>
                  </div>
                  <button
                    onClick={() => row.set(!row.state)}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 shrink-0 ${
                      row.state ? 'bg-amber-500' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        row.state ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Danger */}
          <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(239,68,68,0.12)' }}>
            <h3 className="text-red-400/70 text-xs font-semibold uppercase tracking-wider mb-3">Frame Actions</h3>
            <div className="flex gap-2">
              <button className="flex-1 py-2 text-xs text-gray-400 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Restart Frame
              </button>
              <button className="flex-1 py-2 text-xs text-red-400/60 border border-red-500/10 rounded-xl hover:bg-red-500/5 hover:text-red-400 transition-colors">
                Remove Frame
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
