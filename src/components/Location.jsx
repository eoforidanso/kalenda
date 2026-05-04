import { useState, useEffect, useRef } from 'react';

const FAMILY = [
  { name: 'Harriet', initial: 'H', color: '#f472b6', bg: 'from-pink-400 to-rose-500',    lat: 42.188, lng: -88.344, place: 'Home',                        status: 'online',  lastSeen: 'Now'        },
  { name: 'Dad',     initial: 'D', color: '#38bdf8', bg: 'from-sky-400 to-blue-500',     lat: 42.195, lng: -88.330, place: 'Work — Algonquin',            status: 'online',  lastSeen: '2 min ago'  },
  { name: 'Mom',     initial: 'M', color: '#fb7185', bg: 'from-rose-400 to-pink-500',    lat: 42.182, lng: -88.358, place: 'Randall Road Walmart',        status: 'online',  lastSeen: '5 min ago'  },
  { name: 'Emma',    initial: 'E', color: '#34d399', bg: 'from-emerald-400 to-teal-500', lat: 42.200, lng: -88.340, place: 'Lake in the Hills Elem.',     status: 'offline', lastSeen: '1 hr ago'   },
  { name: 'Jake',    initial: 'J', color: '#fbbf24', bg: 'from-amber-400 to-orange-500', lat: 42.175, lng: -88.350, place: 'Huntley High School',         status: 'online',  lastSeen: '12 min ago' },
  { name: 'Grandma', initial: 'G', color: '#a78bfa', bg: 'from-violet-400 to-purple-500',lat: 42.165, lng: -88.320, place: 'Crystal Lake Senior Center',  status: 'offline', lastSeen: '3 hr ago'   },
];

const SAFE_ZONES = [
  { name: 'Home',                      lat: 42.188, lng: -88.344, radius: 0.3, color: '#34d399' },
  { name: 'Lake in the Hills Elem.',   lat: 42.200, lng: -88.340, radius: 0.2, color: '#38bdf8' },
  { name: 'Huntley High School',       lat: 42.175, lng: -88.350, radius: 0.4, color: '#a78bfa' },
];

const CHECK_INS = [
  { who: 'Dad',  place: 'Work — Algonquin',         time: '8:04 AM',  icon: '🏢' },
  { who: 'Mom',  place: 'Randall Road Walmart',     time: '10:22 AM', icon: '🛒' },
  { who: 'Jake', place: 'Huntley High School',      time: '7:51 AM',  icon: '🎓' },
  { who: 'Emma', place: 'Lake in the Hills Elem.',  time: '7:35 AM',  icon: '🏫' },
];

function getMember(name) { return FAMILY.find(f => f.name === name) || FAMILY[0]; }

// Normalise lat/lng into SVG canvas [0..1]
const LAT = { min: 42.155, max: 42.215 };
const LNG = { min: -88.375, max: -88.305 };
function project(lat, lng, W, H) {
  const x = ((lng - LNG.min) / (LNG.max - LNG.min)) * W;
  const y = ((LAT.max - lat) / (LAT.max - LAT.min)) * H;
  return { x, y };
}

// Simple animated SOS pulse
function SOSPulse({ active }) {
  return (
    <span className="relative flex items-center justify-center">
      {active && <span className="absolute animate-ping w-full h-full rounded-full bg-red-500 opacity-40" />}
      <span className={`relative rounded-full ${active ? 'bg-red-500' : 'bg-red-400'}`} style={{ width: 8, height: 8 }} />
    </span>
  );
}

// Interactive map built as an SVG
function MapCanvas({ highlighted, setHighlighted, sharing }) {
  const W = 600, H = 360;
  const roads = [
    [[0.12, 0.30],[0.45, 0.30],[0.72, 0.32],[0.95, 0.29]],
    [[0.25, 0.05],[0.24, 0.45],[0.24, 0.80],[0.25, 0.98]],
    [[0.55, 0.02],[0.54, 0.50],[0.53, 0.95]],
    [[0.02, 0.55],[0.30, 0.55],[0.65, 0.57],[0.98, 0.55]],
    [[0.35, 0.02],[0.34, 0.25],[0.38, 0.55],[0.40, 0.95]],
  ];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ borderRadius: '16px', background: 'linear-gradient(160deg,#e8f4f0 0%,#d4ede8 40%,#c8e8e0 100%)' }}>
      {/* Grid */}
      {Array.from({length:8},(_,i)=><line key={`gh${i}`} x1={0} y1={(i+1)*H/9} x2={W} y2={(i+1)*H/9} stroke="#b5d8d0" strokeWidth="0.5"/>)}
      {Array.from({length:10},(_,i)=><line key={`gv${i}`} x1={(i+1)*W/11} y1={0} x2={(i+1)*W/11} y2={H} stroke="#b5d8d0" strokeWidth="0.5"/>)}
      {/* Roads */}
      {roads.map((pts,ri)=>(
        <polyline key={ri} points={pts.map(([x,y])=>`${x*W},${y*H}`).join(' ')} fill="none" stroke="#c8ddd8" strokeWidth={ri<2?3.5:2} strokeLinecap="round"/>
      ))}
      {roads.map((pts,ri)=>(
        <polyline key={`r${ri}`} points={pts.map(([x,y])=>`${x*W},${y*H}`).join(' ')} fill="none" stroke="white" strokeWidth={ri<2?2:1} strokeLinecap="round" strokeDasharray="8 6" strokeOpacity="0.5"/>
      ))}
      {/* Safe zones */}
      {SAFE_ZONES.map((z,i)=>{
        const {x,y}=project(z.lat,z.lng,W,H);
        const r=z.radius*W*0.08;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={r} fill={z.color} fillOpacity="0.12" stroke={z.color} strokeWidth="1.5" strokeDasharray="4 3"/>
            <text x={x} y={y-r-4} textAnchor="middle" fontSize="9" fill={z.color} fontWeight="600">{z.name}</text>
          </g>
        );
      })}
      {/* Member pins */}
      {FAMILY.filter(m=>sharing[m.name]).map(m=>{
        const {x,y}=project(m.lat,m.lng,W,H);
        const isHl=highlighted===m.name;
        return (
          <g key={m.name} style={{cursor:'pointer'}} onClick={()=>setHighlighted(isHl?null:m.name)}>
            {isHl&&<circle cx={x} cy={y} r={22} fill={m.color} fillOpacity="0.20"/>}
            <circle cx={x} cy={y+14} r={7} fill={m.color} fillOpacity="0.25" style={{transform:'scaleX(1.6)',transformOrigin:`${x}px ${y+14}px`}}/>
            <polygon points={`${x},${y-20} ${x-7},${y-4} ${x+7},${y-4}`} fill={m.color} style={{filter:`drop-shadow(0 2px 3px ${m.color}60)`}}/>
            <circle cx={x} cy={y-22} r={10} fill={m.color} style={{filter:`drop-shadow(0 2px 4px ${m.color}80)`}}/>
            <text x={x} y={y-18} textAnchor="middle" fontSize="10" fill="white" fontWeight="800">{m.initial}</text>
            {m.status==='online'&&<circle cx={x+7} cy={y-31} r={3} fill="#34d399" stroke="white" strokeWidth="1"/>}
          </g>
        );
      })}
    </svg>
  );
}

export default function Location() {
  const [sharing, setSharing] = useState(() => Object.fromEntries(FAMILY.map(m=>[m.name, true])));
  const [highlighted, setHighlighted] = useState(null);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(null);
  const [sosConfirm, setSosConfirm] = useState(false);
  const timerRef = useRef(null);

  function startSos() {
    setSosConfirm(false);
    setSosCountdown(5);
    setSosActive(false);
  }

  useEffect(() => {
    if (sosCountdown === null) return;
    if (sosCountdown === 0) { setSosActive(true); setSosCountdown(null); return; }
    timerRef.current = setTimeout(() => setSosCountdown(c => c - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [sosCountdown]);

  function cancelSos() {
    clearTimeout(timerRef.current);
    setSosCountdown(null);
    setSosActive(false);
    setSosConfirm(false);
  }

  const highlighted_member = highlighted ? getMember(highlighted) : null;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0" style={{ background: 'transparent' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 px-4 md:px-6 py-3.5 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold flex items-center gap-2">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-teal-500"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
            Family Location
          </h1>
          <p className="text-gray-500 text-xs">{FAMILY.filter(m=>sharing[m.name]&&m.status==='online').length} members sharing live</p>
        </div>
        <button
          onClick={() => sosActive ? cancelSos() : setSosConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
          style={sosActive
            ? { background: 'linear-gradient(135deg,#dc2626,#b91c1c)', color: 'white', boxShadow: '0 4px 20px rgba(220,38,38,0.5)', animation: 'pulse 1.2s infinite' }
            : { background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', boxShadow: '0 4px 16px rgba(239,68,68,0.4)' }}>
          <SOSPulse active={sosActive} />
          {sosActive ? 'SOS SENT — Cancel' : sosCountdown !== null ? `Cancel (${sosCountdown}s)` : 'SOS'}
        </button>
      </div>

      <div className="px-4 md:px-6 py-5 space-y-5">

        {/* SOS confirmation */}
        {sosConfirm && (
          <div className="glass rounded-2xl p-5 border-2" style={{ borderColor: '#fca5a5', background: 'rgba(254,242,242,0.95)' }}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-red-600"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
              </div>
              <div className="flex-1">
                <p className="text-red-700 font-bold text-sm">Send SOS Emergency Alert?</p>
                <p className="text-red-600 text-xs mt-1">Your live location will be shared with all family members and an emergency alert will be sent immediately.</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={startSos} className="px-4 py-2 rounded-xl text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)', boxShadow: '0 4px 12px rgba(220,38,38,0.4)' }}>
                    Send SOS Now
                  </button>
                  <button onClick={() => setSosConfirm(false)} className="px-4 py-2 rounded-xl text-gray-600 text-sm font-medium" style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)' }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SOS active banner */}
        {sosActive && (
          <div className="glass rounded-2xl p-4 border-2 border-red-400" style={{ background: 'rgba(254,242,242,0.98)', animation: 'pulse 1s infinite' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0 animate-ping absolute" />
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shrink-0 relative">
                <span className="text-white font-black text-xs">SOS</span>
              </div>
              <div className="flex-1">
                <p className="text-red-700 font-black text-sm">🚨 EMERGENCY ALERT SENT</p>
                <p className="text-red-500 text-xs mt-0.5">All family members have been notified with your live location. Help is on the way.</p>
              </div>
              <button onClick={cancelSos} className="text-xs text-red-400 underline">Cancel</button>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #e2ecf0' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-600 text-xs font-semibold">Live Map · Lake in the Hills, IL</span>
            </div>
            <span className="text-gray-400 text-[10px]">Updated just now</span>
          </div>
          <MapCanvas highlighted={highlighted} setHighlighted={setHighlighted} sharing={sharing} />
          {highlighted_member && (
            <div className="px-4 py-3 flex items-center gap-3" style={{ borderTop: '1px solid #e2ecf0', background: `${highlighted_member.color}08` }}>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${highlighted_member.bg} flex items-center justify-center text-white text-sm font-bold shrink-0`}>{highlighted_member.initial}</div>
              <div className="flex-1">
                <p className="text-gray-800 font-semibold text-sm">{highlighted_member.name}</p>
                <p className="text-gray-500 text-xs">{highlighted_member.place} · {highlighted_member.lastSeen}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${highlighted_member.status === 'online' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                {highlighted_member.status}
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          {/* Member list */}
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-4 py-3" style={{ borderBottom: '1px solid #e2ecf0' }}>
              <h2 className="text-gray-700 font-semibold text-sm">Family Members</h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              {FAMILY.map(m => (
                <div
                  key={m.name}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setHighlighted(highlighted === m.name ? null : m.name)}
                  style={highlighted === m.name ? { background: `${m.color}10` } : {}}>
                  <div className="relative shrink-0">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.bg} flex items-center justify-center text-white text-sm font-bold`}>{m.initial}</div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${m.status === 'online' ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-sm font-medium">{m.name}</p>
                    <p className="text-gray-400 text-xs truncate">{sharing[m.name] ? m.place : 'Location hidden'} · {m.lastSeen}</p>
                  </div>
                  {/* Share toggle */}
                  <button
                    onClick={e => { e.stopPropagation(); setSharing(s => ({ ...s, [m.name]: !s[m.name] })); }}
                    className="relative w-10 h-5.5 rounded-full transition-colors shrink-0"
                    style={{ width: 40, height: 22, background: sharing[m.name] ? m.color : '#d1d5db' }}>
                    <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow-sm"
                      style={{ left: sharing[m.name] ? 20 : 2 }} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Check-ins + Safe Zones */}
          <div className="space-y-4">
            {/* Today's check-ins */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #e2ecf0' }}>
                <h2 className="text-gray-700 font-semibold text-sm">Today's Check-ins</h2>
              </div>
              <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                {CHECK_INS.map((c, i) => {
                  const m = getMember(c.who);
                  return (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${m.bg} flex items-center justify-center text-white text-xs font-bold shrink-0`}>{m.initial}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-700 text-xs font-medium">{c.icon} {c.place}</p>
                        <p className="text-gray-400 text-[10px]">{c.who} · {c.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Safe zones */}
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-4 py-3" style={{ borderBottom: '1px solid #e2ecf0' }}>
                <h2 className="text-gray-700 font-semibold text-sm">Safe Zones</h2>
              </div>
              <div className="px-4 py-3 space-y-2">
                {SAFE_ZONES.map((z, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: z.color + '20', border: `2px dashed ${z.color}` }}>
                      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" style={{ color: z.color }}><path fillRule="evenodd" d="M8 1a5 5 0 100 10A5 5 0 008 1zm0 2a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd"/></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 text-xs font-medium">{z.name}</p>
                      <p className="text-gray-400 text-[10px]">Radius ~{Math.round(z.radius * 100)}m</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Active</span>
                  </div>
                ))}
                <button className="w-full mt-2 py-2 text-xs font-semibold rounded-xl transition-colors" style={{ color: '#3ab5b5', background: 'rgba(91,191,191,0.08)', border: '1px dashed rgba(91,191,191,0.35)' }}>
                  + Add Safe Zone
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
