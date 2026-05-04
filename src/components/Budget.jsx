import { useState } from 'react';

const CATEGORIES = [
  { name: 'Food & Groceries', icon: '🛒', color: '#34d399', budget: 800,  spent: 613 },
  { name: 'Transport',        icon: '🚗', color: '#38bdf8', budget: 400,  spent: 287 },
  { name: 'Kids & School',    icon: '🎒', color: '#a78bfa', budget: 350,  spent: 320 },
  { name: 'Entertainment',    icon: '🎬', color: '#fb923c', budget: 200,  spent: 178 },
  { name: 'Healthcare',       icon: '💊', color: '#f472b6', budget: 300,  spent: 95  },
  { name: 'Utilities',        icon: '💡', color: '#fbbf24', budget: 250,  spent: 240 },
  { name: 'Savings',          icon: '🏦', color: '#6366f1', budget: 500,  spent: 500 },
  { name: 'Miscellaneous',    icon: '📦', color: '#94a3b8', budget: 150,  spent: 72  },
];

const initialTxns = [
  { id: 1,  cat: 'Food & Groceries', label: 'Shoprite Weekly Shop',     amount: 148.50, who: 'Mom',     date: 'May 3',  type: 'expense' },
  { id: 2,  cat: 'Transport',        label: 'Uber — Accra CBD',          amount: 35.00,  who: 'Dad',     date: 'May 3',  type: 'expense' },
  { id: 3,  cat: 'Kids & School',    label: 'Emma — Art Supplies',       amount: 62.00,  who: 'Harriet', date: 'May 2',  type: 'expense' },
  { id: 4,  cat: 'Entertainment',    label: 'Netflix + Spotify',         amount: 45.00,  who: 'Harriet', date: 'May 1',  type: 'expense' },
  { id: 5,  cat: 'Food & Groceries', label: 'Tuesday Market Run',        amount: 87.00,  who: 'Mom',     date: 'Apr 29', type: 'expense' },
  { id: 6,  cat: 'Healthcare',       label: 'GP Visit — Emma',           amount: 95.00,  who: 'Mom',     date: 'Apr 28', type: 'expense' },
  { id: 7,  cat: 'Transport',        label: 'Fuel — Toyota',             amount: 120.00, who: 'Dad',     date: 'Apr 27', type: 'expense' },
  { id: 8,  cat: 'Utilities',        label: 'ECG Electricity Bill',      amount: 140.00, who: 'Dad',     date: 'Apr 26', type: 'expense' },
  { id: 9,  cat: 'Kids & School',    label: "Jake's Textbooks",          amount: 258.00, who: 'Dad',     date: 'Apr 25', type: 'expense' },
  { id: 10, cat: 'Food & Groceries', label: 'Farmers Market',            amount: 55.00,  who: 'Harriet', date: 'Apr 24', type: 'expense' },
  { id: 11, cat: 'Savings',          label: 'Monthly Savings Transfer',  amount: 500.00, who: 'Dad',     date: 'Apr 30', type: 'saving'  },
  { id: 12, cat: 'Miscellaneous',    label: 'Household items',           amount: 72.00,  who: 'Mom',     date: 'Apr 23', type: 'expense' },
];

const INCOME_MONTHLY = 3500;
const MEMBER_COLORS = { Harriet: '#f472b6', Dad: '#38bdf8', Mom: '#fb7185', Emma: '#34d399', Jake: '#fbbf24' };

function AddExpenseModal({ onSave, onClose }) {
  const [label, setLabel]  = useState('');
  const [amount, setAmount]= useState('');
  const [cat, setCat]      = useState(CATEGORIES[0].name);
  const [who, setWho]      = useState('Harriet');
  const [type, setType]    = useState('expense');
  const [error, setError]  = useState('');

  function handleSave() {
    if (!label.trim()) { setError('Enter a description'); return; }
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) { setError('Enter a valid amount'); return; }
    onSave({ label: label.trim(), amount: parseFloat(amount), cat, who, type, date: 'May 4', id: Date.now() });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e2ecf0', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800 font-semibold text-sm">Add Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#f1f5f9' }}>
            {['expense','saving','income'].map(t=>(
              <button key={t} onClick={()=>setType(t)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                style={type===t?{background:'#fff',boxShadow:'0 1px 4px rgba(0,0,0,0.08)',color:t==='expense'?'#dc2626':t==='saving'?'#6366f1':'#16a34a'}:{color:'#94a3b8'}}>
                {t}
              </button>
            ))}
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Description</label>
            <input value={label} onChange={e=>setLabel(e.target.value)} placeholder="e.g. Weekly groceries" className="w-full px-3 py-2.5 text-sm text-gray-700 rounded-xl outline-none" style={{background:'#f8fafc',border:'1px solid #e2ecf0'}}/>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Amount (GHS)</label>
              <input type="number" min="0" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" className="w-full px-3 py-2.5 text-sm text-gray-700 rounded-xl outline-none" style={{background:'#f8fafc',border:'1px solid #e2ecf0'}}/>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Who</label>
              <select value={who} onChange={e=>setWho(e.target.value)} className="w-full px-3 py-2 text-sm text-gray-700 rounded-xl outline-none" style={{background:'#f8fafc',border:'1px solid #e2ecf0'}}>
                {Object.keys(MEMBER_COLORS).map(m=><option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Category</label>
            <div className="grid grid-cols-4 gap-1.5">
              {CATEGORIES.map(c=>(
                <button key={c.name} onClick={()=>setCat(c.name)} className="flex flex-col items-center gap-1 p-2 rounded-xl text-[9px] font-semibold transition-all" style={cat===c.name?{background:c.color+'20',border:`1px solid ${c.color}40`,color:c.color}:{background:'#f8fafc',border:'1px solid transparent',color:'#94a3b8'}}>
                  <span className="text-base">{c.icon}</span>
                  <span className="leading-tight text-center" style={{fontSize:'8px'}}>{c.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-gray-500 text-sm" style={{border:'1px solid #e2ecf0'}}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold" style={{background:'linear-gradient(135deg,#5bbfbf,#4db6ac)'}}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default function Budget() {
  const [txns, setTxns] = useState(initialTxns);
  const [showAdd, setShowAdd] = useState(false);
  const [catFilter, setCatFilter] = useState('All');

  const totalBudget = CATEGORIES.reduce((s, c) => s + c.budget, 0);
  const totalSpent  = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalSaved  = txns.filter(t => t.type === 'saving').reduce((s, t) => s + t.amount, 0);
  const remaining   = INCOME_MONTHLY - totalSpent;
  const spentPct    = Math.min((totalSpent / totalBudget) * 100, 100);

  const filteredTxns = catFilter === 'All' ? txns : txns.filter(t => t.cat === catFilter);

  function addTxn(txn) {
    setTxns(prev => [txn, ...prev]);
    setShowAdd(false);
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0" style={{ background: 'transparent' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 px-4 md:px-6 py-3.5 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold">💰 Family Budget</h1>
          <p className="text-gray-500 text-xs">May 2026 · GHS {totalSpent.toFixed(2)} spent of {totalBudget.toLocaleString()}</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-glass">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M8 2a.75.75 0 01.75.75V7.25h4.5a.75.75 0 010 1.5H8.75v4.5a.75.75 0 01-1.5 0V8.75H2.75a.75.75 0 010-1.5h4.5V2.75A.75.75 0 018 2z"/></svg>
          Add
        </button>
      </div>

      <div className="px-4 md:px-6 py-5 space-y-5">

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Monthly Income',  val: `GHS ${INCOME_MONTHLY.toLocaleString()}`, icon: '💵', color: '#16a34a', sub: 'Combined' },
            { label: 'Total Spent',     val: `GHS ${totalSpent.toFixed(0)}`,           icon: '📤', color: '#dc2626', sub: `${spentPct.toFixed(0)}% of budget` },
            { label: 'Remaining',       val: `GHS ${remaining.toFixed(0)}`,            icon: '💳', color: remaining >= 0 ? '#059669' : '#dc2626', sub: remaining >= 0 ? 'On track' : 'Over budget' },
            { label: 'Savings',         val: `GHS ${totalSaved.toFixed(0)}`,           icon: '🏦', color: '#6366f1', sub: `${((totalSaved/INCOME_MONTHLY)*100).toFixed(0)}% of income` },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{s.icon}</span>
                <span className="text-[10px] text-gray-400">{s.sub}</span>
              </div>
              <p className="font-black text-gray-800" style={{ fontSize: '1.1rem', color: s.color }}>{s.val}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Monthly Budget Usage</span>
            <span className="text-sm font-bold" style={{ color: spentPct > 90 ? '#dc2626' : spentPct > 70 ? '#d97706' : '#16a34a' }}>{spentPct.toFixed(0)}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{
              width: `${spentPct}%`,
              background: spentPct > 90 ? 'linear-gradient(90deg,#f97316,#dc2626)' : spentPct > 70 ? 'linear-gradient(90deg,#fbbf24,#f97316)' : 'linear-gradient(90deg,#34d399,#5bbfbf)',
            }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
            <span>GHS 0</span>
            <span>GHS {totalBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-3" style={{ borderBottom: '1px solid #e2ecf0' }}>
            <h2 className="text-gray-700 font-semibold text-sm">Category Breakdown</h2>
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {CATEGORIES.map((cat, i) => {
              const spent = txns.filter(t => t.cat === cat.name && t.type === 'expense').reduce((s, t) => s + t.amount, 0);
              const pct   = Math.min((spent / cat.budget) * 100, 100);
              const over  = spent > cat.budget;
              return (
                <button key={i} onClick={() => setCatFilter(catFilter === cat.name ? 'All' : cat.name)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
                  style={catFilter === cat.name ? { background: `${cat.color}08` } : {}}>
                  <span className="text-xl shrink-0">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700 font-medium">{cat.name}</span>
                      <span className="text-xs font-bold" style={{ color: over ? '#dc2626' : '#64748b' }}>
                        GHS {spent.toFixed(0)} <span className="text-gray-300 font-normal">/ {cat.budget}</span>
                        {over && <span className="ml-1 text-red-500">⚠️</span>}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: over ? '#ef4444' : cat.color }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Transactions */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #e2ecf0' }}>
            <h2 className="text-gray-700 font-semibold text-sm">
              {catFilter === 'All' ? 'Recent Transactions' : catFilter}
            </h2>
            {catFilter !== 'All' && (
              <button onClick={() => setCatFilter('All')} className="text-xs text-teal-500 font-semibold">Clear filter</button>
            )}
          </div>
          <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
            {filteredTxns.slice(0, 15).map(t => {
              const cat = CATEGORIES.find(c => c.name === t.cat) || CATEGORIES[7];
              const isIncome = t.type === 'income';
              const isSaving = t.type === 'saving';
              return (
                <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ background: cat.color + '18' }}>
                    {cat.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700 truncate">{t.label}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-gray-400">{t.date}</span>
                      <span className="text-[10px] text-gray-300">·</span>
                      <span className="text-[10px]" style={{ color: MEMBER_COLORS[t.who] || '#94a3b8' }}>{t.who}</span>
                    </div>
                  </div>
                  <span className="text-sm font-bold shrink-0" style={{ color: isIncome ? '#16a34a' : isSaving ? '#6366f1' : '#ef4444' }}>
                    {isIncome ? '+' : isSaving ? '→' : '-'}GHS {t.amount.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showAdd && <AddExpenseModal onSave={addTxn} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
