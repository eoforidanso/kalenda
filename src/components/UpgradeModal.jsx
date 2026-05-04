import { useState } from 'react';
import { usePlan } from '../context/PlanContext';

const PRO_FEATURES = [
  { icon: '🤖', label: 'AI Studio — smart meal plans, photo captions, summaries' },
  { icon: '📸', label: 'Unlimited photo storage (free: 50 photos)' },
  { icon: '👨‍👩‍👧‍👦', label: 'Multiple families on one account' },
  { icon: '🖼️', label: 'Premium frame themes & seasonal layouts' },
  { icon: '🔔', label: 'Priority push notifications & daily digest email' },
  { icon: '📊', label: 'Advanced budget analytics & export' },
];

export function UpgradeModal({ onClose, reason }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleUpgrade() {
    setLoading(true);
    setError('');
    try {
      const { createCheckout } = await import('../api/payments');
      const { url } = await createCheckout();
      window.location.href = url;
    } catch (e) {
      setError('Could not start checkout. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden" style={{ background: '#fff', boxShadow: '0 32px 100px rgba(0,0,0,0.2)' }}>
        {/* Hero */}
        <div className="px-8 pt-8 pb-6 text-center" style={{ background: 'linear-gradient(135deg, #5bbfbf 0%, #4db6ac 50%, #7c3aed 100%)' }}>
          <div className="text-5xl mb-3">✨</div>
          <h2 className="text-white font-bold text-xl leading-tight">Kalenda Pro</h2>
          <p className="text-white/80 text-sm mt-1">Unlock everything for your whole family</p>
          {reason && (
            <p className="mt-3 text-white/90 text-xs bg-white/15 rounded-xl px-3 py-2">{reason}</p>
          )}
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-center gap-1 py-4 border-b border-gray-100">
          <span className="text-3xl font-bold text-gray-800">$6.99</span>
          <div className="ml-1">
            <p className="text-gray-400 text-xs leading-tight">/month</p>
            <p className="text-teal-500 text-xs font-semibold leading-tight">or $49/yr — save 42%</p>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 py-4 space-y-2.5">
          {PRO_FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg shrink-0">{f.icon}</span>
              <p className="text-gray-600 text-sm">{f.label}</p>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-teal-500 shrink-0 ml-auto">
                <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
              </svg>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 text-xs text-center px-6 -mt-1">{error}</p>}

        {/* CTA */}
        <div className="px-6 pb-6 pt-2 flex flex-col gap-2">
          <button onClick={handleUpgrade} disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm disabled:opacity-60 transition-all"
            style={{ background: 'linear-gradient(135deg, #5bbfbf, #4db6ac)', boxShadow: '0 8px 24px rgba(91,191,191,0.4)' }}>
            {loading ? 'Redirecting to Stripe…' : 'Upgrade to Pro →'}
          </button>
          <button onClick={onClose}
            className="w-full py-2.5 rounded-2xl text-gray-400 text-sm hover:text-gray-600 transition-colors">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

/** Wraps gated content — shows a paywall overlay if not Pro */
export function ProGate({ children, reason, inline = false }) {
  const { isPro } = usePlan();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (isPro) return children;

  if (inline) {
    return (
      <>
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} reason={reason} />}
        <div className="relative">
          <div className="pointer-events-none opacity-30 select-none">{children}</div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl"
            style={{ background: 'rgba(245,248,250,0.85)', backdropFilter: 'blur(6px)' }}>
            <span className="text-3xl">✨</span>
            <p className="text-gray-700 font-semibold text-sm text-center px-4">{reason || 'Pro feature'}</p>
            <button onClick={() => setShowUpgrade(true)}
              className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
              style={{ background: 'linear-gradient(135deg, #5bbfbf, #4db6ac)' }}>
              Upgrade to Pro
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} reason={reason} />}
      <div
        onClick={() => setShowUpgrade(true)}
        className="cursor-pointer select-none flex flex-col items-center justify-center gap-4 p-12 rounded-3xl text-center"
        style={{ background: 'linear-gradient(135deg, rgba(91,191,191,0.06), rgba(124,58,237,0.06))', border: '1.5px dashed rgba(91,191,191,0.3)' }}>
        <span className="text-5xl">✨</span>
        <div>
          <p className="text-gray-700 font-semibold text-base">{reason || 'Kalenda Pro feature'}</p>
          <p className="text-gray-400 text-sm mt-1">Upgrade to unlock this and much more.</p>
        </div>
        <span className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
          style={{ background: 'linear-gradient(135deg, #5bbfbf, #4db6ac)', boxShadow: '0 4px 16px rgba(91,191,191,0.35)' }}>
          Upgrade to Pro — $6.99/mo
        </span>
      </div>
    </>
  );
}
