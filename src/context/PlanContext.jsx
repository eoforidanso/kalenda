import { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '../api/client';

const PlanContext = createContext({ plan: 'free', isPro: false, refresh: () => {} });

export function PlanProvider({ children }) {
  const [plan, setPlan] = useState('free');

  async function refresh() {
    if (!getToken()) return;
    try {
      const { getPlan } = await import('../api/payments');
      const data = await getPlan();
      setPlan(data.plan ?? 'free');
    } catch {
      // not critical — default to free
    }
  }

  useEffect(() => { refresh(); }, []);

  // Also re-check when user returns to the tab (e.g. after Stripe redirect)
  useEffect(() => {
    function onFocus() { refresh(); }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <PlanContext.Provider value={{ plan, isPro: plan === 'pro', refresh }}>
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
