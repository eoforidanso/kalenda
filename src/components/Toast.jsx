import { useState, useCallback, createContext, useContext } from 'react';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

const CONFIGS = {
  success: { icon: '✅', bg: '#f0fdf4', border: '#86efac', color: '#166534' },
  error:   { icon: '❌', bg: '#fef2f2', border: '#fca5a5', color: '#991b1b' },
  info:    { icon: '💡', bg: '#eff6ff', border: '#93c5fd', color: '#1e40af' },
  warning: { icon: '⚠️', bg: '#fffbeb', border: '#fcd34d', color: '#92400e' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'success', duration = 3200) => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        className="fixed bottom-28 md:bottom-6 left-4 z-[100] flex flex-col gap-2 pointer-events-none"
        style={{ maxWidth: 320 }}>
        {toasts.map(t => {
          const c = CONFIGS[t.type] || CONFIGS.success;
          return (
            <div key={t.id}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium shadow-xl pointer-events-auto"
              style={{
                background: c.bg,
                border: `1px solid ${c.border}`,
                color: c.color,
                animation: 'toastSlideIn 0.3s cubic-bezier(0.22, 0.68, 0, 1.2) both',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              }}>
              <span className="text-base shrink-0">{c.icon}</span>
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
