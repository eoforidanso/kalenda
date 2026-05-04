import { useState, useEffect } from 'react';

const ACTIONS = [
  { icon: '📅', label: 'New Event',   color: '#6366f1', view: 'calendar'    },
  { icon: '✅', label: 'New Task',    color: '#34d399', view: 'tasks'       },
  { icon: '💰', label: 'Add Expense', color: '#f59e0b', view: 'budget'      },
  { icon: '🍽️', label: 'Plan Meal',  color: '#fb923c', view: 'mealplanner' },
  { icon: '📸', label: 'Add Photo',   color: '#ec4899', view: 'photos'      },
  { icon: '💬', label: 'Message',     color: '#38bdf8', view: 'messages'    },
];

export default function FAB({ setView }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
      )}

      <div className="fixed bottom-24 md:bottom-6 right-5 md:right-6 z-50 flex flex-col-reverse items-end gap-2.5">
        {/* Action items */}
        {ACTIONS.map((a, i) => (
          <div key={i}
            className="flex items-center gap-2.5 transition-all duration-300"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'translateX(0) scale(1)' : 'translateX(14px) scale(0.82)',
              transitionDelay: open
                ? `${i * 38}ms`
                : `${(ACTIONS.length - 1 - i) * 24}ms`,
              pointerEvents: open ? 'auto' : 'none',
            }}>
            <span
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl whitespace-nowrap select-none"
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1px solid #e2ecf0',
                color: '#374151',
                boxShadow: '0 2px 10px rgba(0,0,0,0.07)',
                backdropFilter: 'blur(12px)',
              }}>
              {a.label}
            </span>
            <button
              onClick={() => { setView(a.view); setOpen(false); }}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all hover:scale-110 active:scale-90 shrink-0"
              style={{
                background: a.color + '18',
                border: `1.5px solid ${a.color}40`,
                boxShadow: `0 4px 16px ${a.color}30`,
                backdropFilter: 'blur(12px)',
              }}>
              {a.icon}
            </button>
          </div>
        ))}

        {/* Main FAB */}
        <button
          onClick={() => setOpen(p => !p)}
          aria-label={open ? 'Close quick add' : 'Quick add'}
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white transition-all duration-300 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #5bbfbf, #4db6ac)',
            boxShadow: open
              ? '0 8px 28px rgba(91,191,191,0.55), 0 2px 8px rgba(0,0,0,0.12)'
              : '0 6px 22px rgba(91,191,191,0.45), 0 2px 8px rgba(0,0,0,0.10)',
            transform: open ? 'rotate(45deg) scale(1.05)' : 'rotate(0deg) scale(1)',
          }}>
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6">
            <path d="M8 2a.75.75 0 01.75.75V7.25h4.5a.75.75 0 010 1.5H8.75v4.5a.75.75 0 01-1.5 0V8.75H2.75a.75.75 0 010-1.5h4.5V2.75A.75.75 0 018 2z"/>
          </svg>
        </button>
      </div>
    </>
  );
}
