import { useState, useRef, useEffect } from 'react';

const FAMILY = [
  { id: 'harriet', name: 'Harriet', initial: 'H', color: '#f472b6', bg: 'from-pink-400 to-rose-500',    status: 'online' },
  { id: 'dad',     name: 'Dad',     initial: 'D', color: '#38bdf8', bg: 'from-sky-400 to-blue-500',     status: 'online' },
  { id: 'mom',     name: 'Mom',     initial: 'M', color: '#fb7185', bg: 'from-rose-400 to-pink-500',    status: 'online' },
  { id: 'emma',    name: 'Emma',    initial: 'E', color: '#34d399', bg: 'from-emerald-400 to-teal-500', status: 'offline' },
  { id: 'jake',    name: 'Jake',    initial: 'J', color: '#fbbf24', bg: 'from-amber-400 to-orange-500', status: 'online' },
  { id: 'grandma', name: 'Grandma', initial: 'G', color: '#a78bfa', bg: 'from-violet-400 to-purple-500',status: 'offline' },
];

const ME = FAMILY[0]; // Harriet = current user

const THREADS = [
  {
    id: 'family',
    name: '🏠 Family Chat',
    type: 'group',
    members: FAMILY,
    unread: 2,
    messages: [
      { id: 1,  from: 'dad',     text: "Good morning everyone! 🌅",                                      time: '7:05 AM',  reactions: [] },
      { id: 2,  from: 'mom',     text: "Morning! Reminder — Emma has piano at 3pm today.",                time: '7:12 AM',  reactions: ['❤️'] },
      { id: 3,  from: 'jake',    text: "Someone ate my leftovers 😤",                                     time: '7:30 AM',  reactions: ['😂','😂'] },
      { id: 4,  from: 'harriet', text: "It wasn't me this time I promise 😇",                             time: '7:31 AM',  reactions: ['😂'] },
      { id: 5,  from: 'emma',    text: "Jake it was Dad.",                                                 time: '7:33 AM',  reactions: ['💀','💀','💀'] },
      { id: 6,  from: 'dad',     text: "I plead the fifth 🙈",                                            time: '7:35 AM',  reactions: ['😂','❤️'] },
      { id: 7,  from: 'mom',     text: "Can someone pick up milk on the way home?",                       time: '10:20 AM', reactions: [] },
      { id: 8,  from: 'dad',     text: "I'll grab it after work 👍",                                      time: '10:45 AM', reactions: ['❤️'] },
      { id: 9,  from: 'jake',    text: "Hey family, I made Dean's List! 🎓🎉",                            time: '2:18 PM',  reactions: ['🎉','❤️','❤️','⭐','⭐'] },
      { id: 10, from: 'harriet', text: "JAKE!! We're so proud of you!! 🥹❤️",                             time: '2:19 PM',  reactions: [] },
      { id: 11, from: 'mom',     text: "My baby!! Celebration dinner tonight — you pick the restaurant!", time: '2:20 PM',  reactions: ['❤️','❤️'] },
    ],
  },
  {
    id: 'dad',
    name: 'Dad',
    type: 'dm',
    members: [FAMILY[1]],
    unread: 0,
    messages: [
      { id: 1, from: 'dad',     text: "Hey H, can you check the electricity bill in my study? Top drawer.", time: '9:00 AM', reactions: [] },
      { id: 2, from: 'harriet', text: "Found it! $140 — I'll pay it online.",                           time: '9:04 AM', reactions: ['❤️'] },
      { id: 3, from: 'dad',     text: "Thanks love 🙏",                                                    time: '9:05 AM', reactions: [] },
    ],
  },
  {
    id: 'mom',
    name: 'Mom',
    type: 'dm',
    members: [FAMILY[2]],
    unread: 1,
    messages: [
      { id: 1, from: 'mom',     text: "Harriet, do you want to come to the market with me on Saturday?", time: 'Yesterday', reactions: [] },
      { id: 2, from: 'harriet', text: "Yes! What time?",                                                  time: 'Yesterday', reactions: [] },
      { id: 3, from: 'mom',     text: "Let's say 9am, before it gets hot ☀️",                            time: '9:15 AM',   reactions: [] },
    ],
  },
  {
    id: 'emma',
    name: 'Emma',
    type: 'dm',
    members: [FAMILY[3]],
    unread: 0,
    messages: [
      { id: 1, from: 'emma',    text: "Harriet can you help me with my history essay tonight?", time: 'May 1', reactions: [] },
      { id: 2, from: 'harriet', text: "Of course! After dinner 📚",                            time: 'May 1', reactions: ['❤️'] },
    ],
  },
];

const EMOJI_REACTIONS = ['❤️','😂','👍','🎉','💀','⭐','😢','🔥'];

function getMember(id) { return FAMILY.find(f => f.id === id) || FAMILY[0]; }
function getInitials(name) { return name.charAt(0).toUpperCase(); }

function MessageBubble({ msg, showAvatar, isMe, onReact }) {
  const [showReactPicker, setShowReactPicker] = useState(false);
  const sender = getMember(msg.from);
  return (
    <div className={`flex items-end gap-2 group ${isMe ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className="w-7 h-7 shrink-0 mb-0.5">
        {showAvatar && !isMe
          ? <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${sender.bg} flex items-center justify-center text-white text-xs font-bold`}>{sender.initial}</div>
          : <div className="w-7 h-7" />}
      </div>

      <div className={`relative max-w-[72%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
        {/* Bubble */}
        <div
          className={`relative px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed cursor-pointer`}
          style={isMe
            ? { background: 'linear-gradient(135deg,#5bbfbf,#4db6ac)', color: 'white', borderBottomRightRadius: 6, boxShadow: '0 2px 8px rgba(91,191,191,0.35)' }
            : { background: 'white', color: '#1e293b', borderBottomLeftRadius: 6, border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          onClick={() => setShowReactPicker(p => !p)}>
          {msg.text}
        </div>

        {/* Reactions */}
        {msg.reactions.length > 0 && (
          <div className={`flex gap-0.5 mt-1 ${isMe ? 'flex-row-reverse' : ''}`}>
            {[...new Set(msg.reactions)].map(r => (
              <span key={r} className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.06)', fontSize: 11 }}>
                {r} <span className="text-gray-500">{msg.reactions.filter(x => x === r).length}</span>
              </span>
            ))}
          </div>
        )}

        {/* Emoji picker */}
        {showReactPicker && (
          <div className={`absolute bottom-full mb-1 flex gap-1 px-2 py-1.5 rounded-2xl z-10 shadow-lg ${isMe ? 'right-0' : 'left-0'}`}
            style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            {EMOJI_REACTIONS.map(e => (
              <button key={e} className="text-lg hover:scale-125 transition-transform" onClick={() => { onReact(msg.id, e); setShowReactPicker(false); }}>{e}</button>
            ))}
          </div>
        )}

        {/* Time */}
        <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">{msg.time}</p>
      </div>
    </div>
  );
}

export default function Messages() {
  const [threads, setThreads] = useState(THREADS);
  const [activeId, setActiveId] = useState('family');
  const [input, setInput] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const activeThread = threads.find(t => t.id === activeId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, activeThread?.messages.length]);

  function sendMessage() {
    if (!input.trim()) return;
    setThreads(prev => prev.map(t => t.id === activeId
      ? { ...t, messages: [...t.messages, { id: Date.now(), from: ME.id, text: input.trim(), time: 'Now', reactions: [] }], unread: 0 }
      : t
    ));
    setInput('');
    inputRef.current?.focus();
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function addReaction(msgId, emoji) {
    setThreads(prev => prev.map(t => t.id === activeId
      ? { ...t, messages: t.messages.map(m => m.id === msgId ? { ...m, reactions: [...m.reactions, emoji] } : m) }
      : t
    ));
  }

  function openThread(id) {
    setActiveId(id);
    setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0 } : t));
  }

  return (
    <div className="flex flex-1 overflow-hidden" style={{ background: 'transparent' }}>

      {/* Thread list */}
      <div className="w-20 sm:w-52 md:w-64 shrink-0 flex flex-col h-full" style={{ background: '#ffffff', borderRight: '1px solid #e2ecf0' }}>
        {/* Header */}
        <div className="px-4 py-4 shrink-0" style={{ borderBottom: '1px solid #e2ecf0' }}>
          <div className="flex items-center gap-2">
            <h2 className="text-gray-800 font-semibold text-sm flex-1">Messages</h2>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.25)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold text-emerald-600">E2E</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-0.5">End-to-end encrypted</p>
        </div>

        <div className="flex-1 overflow-y-auto py-1 pb-20 md:pb-0">
          {threads.map(t => {
            const isActive = t.id === activeId;
            const lastMsg  = t.messages[t.messages.length - 1];
            const preview  = lastMsg?.text.slice(0, 32) + (lastMsg?.text.length > 32 ? '…' : '');
            const icon     = t.type === 'group' ? '🏠' : getMember(t.id).initial;
            const iconBg   = t.type === 'group' ? 'from-teal-400 to-emerald-500' : getMember(t.id).bg;
            const statusColor = t.type === 'dm' ? (getMember(t.id).status === 'online' ? 'bg-emerald-400' : 'bg-gray-300') : 'bg-emerald-400';
            return (
              <button key={t.id} onClick={() => openThread(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all text-left ${isActive ? '' : 'hover:bg-gray-50'}`}
                style={isActive ? { background: 'rgba(91,191,191,0.1)', borderRight: '3px solid #5bbfbf' } : {}}>
                <div className="relative shrink-0">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${iconBg} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.type === 'group' ? '🏠' : icon}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${isActive ? 'font-semibold text-gray-800' : 'text-gray-700'}`}>{t.name}</p>
                    {t.unread > 0 && <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500 text-white shrink-0">{t.unread}</span>}
                  </div>
                  <p className="text-gray-400 text-xs truncate">{preview}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Thread header */}
        <div className="shrink-0 px-4 py-3.5 flex items-center gap-3" style={{ background: 'rgba(245,248,250,0.95)', borderBottom: '1px solid #e2ecf0', backdropFilter: 'blur(20px)' }}>
          {activeThread && (
            <>
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeThread.type === 'group' ? 'from-teal-400 to-emerald-500' : getMember(activeThread.id).bg} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                {activeThread.type === 'group' ? '🏠' : getMember(activeThread.id).initial}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 font-semibold text-sm">{activeThread.name}</p>
                {activeThread.type === 'group'
                  ? <p className="text-gray-400 text-xs">{activeThread.members.filter(m=>m.status==='online').length} online · {activeThread.members.length} members</p>
                  : <p className="text-xs" style={{ color: getMember(activeThread.id).status === 'online' ? '#34d399' : '#94a3b8' }}>{getMember(activeThread.id).status}</p>}
              </div>
              {/* Encryption badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)' }}>
                <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="12" height="8" rx="2"/>
                  <path d="M5 7V5a3 3 0 016 0v2"/>
                </svg>
                <span className="text-[10px] font-bold text-emerald-600">Encrypted</span>
              </div>
            </>
          )}
        </div>

        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          {activeThread?.messages.map((msg, i) => {
            const isMe = msg.from === ME.id;
            const prevMsg = activeThread.messages[i - 1];
            const showAvatar = !prevMsg || prevMsg.from !== msg.from;
            const showDate = !prevMsg || prevMsg.time.includes('PM') !== msg.time.includes('PM');
            return (
              <div key={msg.id}>
                {showDate && i > 0 && (
                  <div className="flex items-center gap-3 my-3">
                    <div className="flex-1 h-px bg-gray-100" />
                    <span className="text-[10px] text-gray-300 font-medium">{msg.time}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                )}
                <MessageBubble msg={msg} showAvatar={showAvatar} isMe={isMe} onReact={addReaction} />
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className="shrink-0 pt-3 pb-20 md:pb-3 px-4" style={{ background: 'rgba(245,248,250,0.95)', borderTop: '1px solid #e2ecf0', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Message family…"
                rows={1}
                enterKeyHint="send"
                className="w-full px-4 py-3 text-sm text-gray-700 outline-none resize-none scrollbar-thin"
                style={{
                  background: 'white',
                  border: '1.5px solid #e2ecf0',
                  borderRadius: 16,
                  maxHeight: 120,
                  overflowY: 'auto',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
              />
            </div>
            {/* Emoji */}
            <div className="relative shrink-0">
              <button
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-colors hover:bg-gray-100"
                onClick={() => setShowEmoji(p => !p)}>
                😊
              </button>
              {showEmoji && (
                <div className="absolute bottom-full right-0 mb-2 grid grid-cols-4 gap-1 p-2 rounded-2xl shadow-xl z-20"
                  style={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
                  {['😊','😂','❤️','🎉','👍','🔥','😢','🤔','😎','🥹','💀','✅'].map(e => (
                    <button key={e} className="text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => { setInput(i => i + e); setShowEmoji(false); inputRef.current?.focus(); }}>
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Send */}
            <button
              onClick={sendMessage}
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-95"
              style={{ background: input.trim() ? 'linear-gradient(135deg,#5bbfbf,#4db6ac)' : '#e2ecf0', boxShadow: input.trim() ? '0 4px 12px rgba(91,191,191,0.4)' : 'none', opacity: input.trim() ? 1 : 0.35, cursor: input.trim() ? 'pointer' : 'default' }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            </button>
          </div>
          <p className="text-center text-[10px] text-gray-300 mt-1.5">🔒 Messages are end-to-end encrypted · only your family can read them</p>
        </div>
      </div>
    </div>
  );
}
