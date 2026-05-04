import { useState } from 'react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const MEAL_ICONS = { Breakfast: '🍳', Lunch: '🥗', Dinner: '🍽️', Snack: '🍎' };

const MEAL_COLORS = {
  Breakfast: { bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)',  text: '#d97706' },
  Lunch:     { bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)',  text: '#059669' },
  Dinner:    { bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.3)',  text: '#4f46e5' },
  Snack:     { bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.3)', text: '#e11d48' },
};

const SUGGESTIONS = {
  Breakfast: ['Overnight Oats', 'Avocado Toast', 'Smoothie Bowl', 'Scrambled Eggs', 'Pancakes', 'French Toast', 'Granola & Yogurt'],
  Lunch:     ['Jollof Rice', 'Chicken Salad', 'Club Sandwich', 'Soup & Bread', 'Fried Rice', 'Pasta Salad', 'Wraps'],
  Dinner:    ['Grilled Chicken', 'Beef Stew', 'Pasta Bolognese', 'Stir-fry Veg', 'Kelewele & Beans', 'Fish & Chips', 'Banku & Tilapia'],
  Snack:     ['Apple & PB', 'Trail Mix', 'Cheese & Crackers', 'Smoothie', 'Yogurt', 'Popcorn', 'Fruit Salad'],
};

const FAMILY = ['Harriet', 'Dad', 'Mom', 'Emma', 'Jake'];

const initialPlan = {
  Mon: {
    Breakfast: { meal: 'Overnight Oats', cook: 'Mom', notes: '' },
    Lunch:     { meal: 'Chicken Salad', cook: 'Harriet', notes: '' },
    Dinner:    { meal: 'Grilled Chicken', cook: 'Dad', notes: 'with roasted veg' },
    Snack:     null,
  },
  Tue: {
    Breakfast: { meal: 'Avocado Toast', cook: 'Harriet', notes: '' },
    Lunch:     { meal: 'Jollof Rice', cook: 'Mom', notes: 'leftover from Sunday' },
    Dinner:    { meal: 'Pasta Bolognese', cook: 'Mom', notes: '' },
    Snack:     { meal: 'Yogurt', cook: '', notes: '' },
  },
  Wed: {
    Breakfast: { meal: 'Smoothie Bowl', cook: 'Emma', notes: '' },
    Lunch:     null,
    Dinner:    { meal: 'Beef Stew', cook: 'Dad', notes: 'slow cooker overnight' },
    Snack:     null,
  },
  Thu: { Breakfast: null, Lunch: null, Dinner: null, Snack: null },
  Fri: {
    Breakfast: { meal: 'Pancakes', cook: 'Jake', notes: 'with maple syrup' },
    Lunch:     null,
    Dinner:    { meal: 'Fish & Chips', cook: 'Dad', notes: '🎉 Friday treat!' },
    Snack:     { meal: 'Popcorn', cook: '', notes: 'Movie night' },
  },
  Sat: {
    Breakfast: { meal: 'French Toast', cook: 'Mom', notes: '' },
    Lunch:     { meal: 'Wraps', cook: 'Harriet', notes: 'chicken & salad' },
    Dinner:    { meal: 'Banku & Tilapia', cook: 'Grandma', notes: '🙌' },
    Snack:     null,
  },
  Sun: {
    Breakfast: { meal: 'Granola & Yogurt', cook: 'Emma', notes: '' },
    Lunch:     { meal: 'Fried Rice', cook: 'Dad', notes: 'with shrimp' },
    Dinner:    null,
    Snack:     { meal: 'Fruit Salad', cook: '', notes: '' },
  },
};

function getMealCount(plan) {
  return Object.values(plan).flatMap(Object.values).filter(Boolean).length;
}

function genShoppingList(plan) {
  const items = new Set();
  const mealMap = {
    'Overnight Oats': ['rolled oats','almond milk','chia seeds','honey'],
    'Avocado Toast': ['sourdough bread','avocados','lemon','chilli flakes'],
    'Smoothie Bowl': ['frozen berries','banana','almond milk','granola'],
    'Pancakes': ['flour','eggs','milk','butter','maple syrup'],
    'French Toast': ['bread','eggs','milk','cinnamon','butter'],
    'Grilled Chicken': ['chicken breast','olive oil','garlic','herbs'],
    'Pasta Bolognese': ['minced beef','spaghetti','tomato sauce','onions'],
    'Beef Stew': ['beef chunks','potatoes','carrots','onions','stock'],
    'Fish & Chips': ['white fish','potatoes','breadcrumbs','tartar sauce'],
    'Jollof Rice': ['long grain rice','tomatoes','peppers','chicken stock'],
    'Fried Rice': ['rice','eggs','spring onions','soy sauce','shrimp'],
    'Banku & Tilapia': ['corn dough','cassava dough','tilapia fish','shito'],
    'Chicken Salad': ['chicken breast','lettuce','tomatoes','cucumber','dressing'],
  };
  Object.values(plan).forEach(day => {
    Object.values(day).forEach(slot => {
      if (slot && mealMap[slot.meal]) {
        mealMap[slot.meal].forEach(ing => items.add(ing));
      }
    });
  });
  return Array.from(items).sort();
}

function AddMealModal({ day, mealType, existing, onSave, onClose }) {
  const [meal, setMeal] = useState(existing?.meal || '');
  const [cook, setCook] = useState(existing?.cook || '');
  const [notes, setNotes] = useState(existing?.notes || '');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-sm rounded-2xl p-5" style={{ background: '#fff', border: '1px solid #e2ecf0', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-800 font-semibold text-sm">{MEAL_ICONS[mealType]} {mealType}</h2>
            <p className="text-gray-400 text-xs">{day}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Meal name</label>
            <input value={meal} onChange={e=>setMeal(e.target.value)} placeholder="e.g. Jollof Rice" className="w-full px-3 py-2.5 text-sm text-gray-700 rounded-xl outline-none" style={{background:'#f8fafc',border:'1px solid #e2ecf0'}}/>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Suggestions</label>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS[mealType].map(s=>(
                <button key={s} onClick={()=>setMeal(s)} className="px-2 py-1 rounded-lg text-xs transition-colors" style={meal===s?{background:'rgba(91,191,191,0.15)',border:'1px solid rgba(91,191,191,0.4)',color:'#3ab5b5'}:{background:'#f1f5f9',border:'1px solid transparent',color:'#64748b'}}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Cook</label>
              <select value={cook} onChange={e=>setCook(e.target.value)} className="w-full px-3 py-2 text-sm text-gray-700 rounded-xl outline-none" style={{background:'#f8fafc',border:'1px solid #e2ecf0'}}>
                <option value="">Anyone</option>
                {FAMILY.map(f=><option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Notes</label>
              <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Optional" className="w-full px-3 py-2 text-sm text-gray-700 rounded-xl outline-none" style={{background:'#f8fafc',border:'1px solid #e2ecf0'}}/>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-gray-500 text-sm" style={{border:'1px solid #e2ecf0'}}>Cancel</button>
          {existing && <button onClick={()=>onSave(null)} className="py-2.5 px-3 rounded-xl text-red-400 text-sm" style={{border:'1px solid #fca5a540'}}>Clear</button>}
          <button disabled={!meal.trim()} onClick={()=>{ if(meal.trim()) onSave({meal,cook,notes}); }} className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold disabled:opacity-40" style={{background:'linear-gradient(135deg,#5bbfbf,#4db6ac)'}}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MealPlanner() {
  const [plan, setPlan] = useState(initialPlan);
  const [editing, setEditing] = useState(null); // { day, mealType }
  const [showShopping, setShowShopping] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});
  const [activeMeal, setActiveMeal] = useState('All');
  const [syncStatus, setSyncStatus] = useState(null); // null | 'syncing' | 'done' | 'error'

  const mealCount = getMealCount(plan);
  const shoppingList = genShoppingList(plan);

  async function sendToShoppingList() {
    setSyncStatus('syncing');
    try {
      const { getLists, createList, addItem } = await import('../api/lists.js');
      const lists = await getLists();
      let grocery = lists.find(l => l.name?.toLowerCase().includes('grocery') || l.name?.toLowerCase().includes('shopping'));
      if (!grocery) {
        grocery = await createList('Grocery List', '🛒');
      }
      const unchecked = shoppingList.filter(item => !checkedItems[item]);
      // add items not already in list
      const { getItems } = await import('../api/lists.js');
      const existing = await getItems(grocery.id);
      const existingText = new Set(existing.map(i => (i.text ?? i.label ?? '').toLowerCase()));
      for (const item of unchecked) {
        if (!existingText.has(item.toLowerCase())) {
          await addItem(grocery.id, item, 'Meal Planner');
        }
      }
      setSyncStatus('done');
      setTimeout(() => setSyncStatus(null), 3000);
    } catch {
      setSyncStatus('error');
      setTimeout(() => setSyncStatus(null), 3000);
    }
  }

  function saveSlot(day, mealType, value) {
    setPlan(prev => ({
      ...prev,
      [day]: { ...prev[day], [mealType]: value },
    }));
    setEditing(null);
  }

  const displayMeals = activeMeal === 'All' ? MEALS : [activeMeal];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin pb-24 md:pb-0" style={{ background: 'transparent' }}>

      {/* Header */}
      <div className="sticky top-0 z-10 px-4 md:px-6 py-3.5 flex items-center justify-between" style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
        <div>
          <h1 className="text-gray-800 font-semibold">🍽️ Meal Planner</h1>
          <p className="text-gray-500 text-xs">{mealCount} meals planned this week</p>
        </div>
        <button onClick={() => setShowShopping(!showShopping)} className="btn-glass">
          🛒 Shopping List
          {shoppingList.length > 0 && <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-500 text-white">{shoppingList.length}</span>}
        </button>
      </div>

      <div className="px-4 md:px-6 py-5 space-y-5">

        {/* Shopping list panel */}
        {showShopping && (
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-700 font-semibold text-sm">🛒 Auto-generated Shopping List</h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">{shoppingList.length} items</span>
                <button
                  onClick={sendToShoppingList}
                  disabled={syncStatus === 'syncing' || shoppingList.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                  style={{ background: syncStatus === 'done' ? 'rgba(52,211,153,0.15)' : 'rgba(91,191,191,0.15)', color: syncStatus === 'done' ? '#059669' : '#3ab5b5', border: '1px solid rgba(91,191,191,0.3)' }}>
                  {syncStatus === 'syncing' ? '⏳ Syncing…' : syncStatus === 'done' ? '✅ Synced!' : syncStatus === 'error' ? '❌ Error' : '→ Add to Lists'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {shoppingList.map(item => (
                <button key={item} onClick={() => setCheckedItems(c => ({ ...c, [item]: !c[item] }))}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-left transition-all"
                  style={{ background: checkedItems[item] ? 'rgba(52,211,153,0.1)' : 'rgba(0,0,0,0.03)', border: `1px solid ${checkedItems[item] ? 'rgba(52,211,153,0.3)' : 'transparent'}` }}>
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all ${checkedItems[item] ? 'bg-emerald-400' : 'border border-gray-300'}`}>
                    {checkedItems[item] && <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span className={checkedItems[item] ? 'line-through text-gray-300' : 'text-gray-600'}>{item}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Meal type filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {['All', ...MEALS].map(m => (
            <button key={m} onClick={() => setActiveMeal(m)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={activeMeal === m
                ? { background: 'linear-gradient(135deg,#5bbfbf,#4db6ac)', color: 'white', boxShadow: '0 2px 10px rgba(91,191,191,0.35)' }
                : { background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.06)', color: '#64748b' }}>
              {m !== 'All' && MEAL_ICONS[m]} {m}
            </button>
          ))}
        </div>

        {/* Weekly grid */}
        <div className="glass rounded-2xl overflow-hidden">
          {/* Day headers */}
          <div className="grid" style={{ gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: '1px solid #e2ecf0', background: 'rgba(245,248,250,0.8)' }}>
            <div className="px-3 py-2.5" />
            {DAYS.map(d => (
              <div key={d} className="px-2 py-2.5 text-center">
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{d}</p>
              </div>
            ))}
          </div>

          {/* Rows per meal type */}
          {displayMeals.map((mealType, mi) => {
            const c = MEAL_COLORS[mealType];
            return (
              <div key={mealType} className="grid" style={{ gridTemplateColumns: '80px repeat(7, 1fr)', borderBottom: mi < displayMeals.length - 1 ? '1px solid #e8ecf0' : 'none' }}>
                {/* Meal label */}
                <div className="flex flex-col items-center justify-center px-2 py-3" style={{ background: `${c.bg}`, borderRight: '1px solid #e2ecf0' }}>
                  <span className="text-lg mb-0.5">{MEAL_ICONS[mealType]}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: c.text }}>{mealType}</span>
                </div>
                {DAYS.map(day => {
                  const slot = plan[day]?.[mealType];
                  return (
                    <div
                      key={day}
                      className="p-1.5 min-h-[72px] cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{ borderRight: '1px solid #f0f4f6' }}
                      onClick={() => setEditing({ day, mealType })}>
                      {slot ? (
                        <div className="h-full rounded-lg p-1.5 flex flex-col gap-0.5 transition-all hover:shadow-sm" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                          <p className="text-[10px] font-semibold leading-tight" style={{ color: c.text }}>{slot.meal}</p>
                          {slot.cook && <p className="text-[9px] text-gray-400">{slot.cook}</p>}
                          {slot.notes && <p className="text-[9px] text-gray-300 leading-tight">{slot.notes}</p>}
                        </div>
                      ) : (
                        <div className="h-full rounded-lg flex items-center justify-center border border-dashed border-gray-200 hover:border-teal-300 transition-colors">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 text-gray-300"><path d="M8 2a.75.75 0 01.75.75V7.25h4.5a.75.75 0 010 1.5H8.75v4.5a.75.75 0 01-1.5 0V8.75H2.75a.75.75 0 010-1.5h4.5V2.75A.75.75 0 018 2z"/></svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Nutrition summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Meals planned', val: mealCount, icon: '🍽️', color: '#6366f1' },
            { label: 'Home-cooked', val: Math.round(mealCount * 0.8), icon: '👨‍🍳', color: '#34d399' },
            { label: 'Ingredients needed', val: shoppingList.length, icon: '🛒', color: '#f59e0b' },
            { label: 'Covered days', val: DAYS.filter(d => Object.values(plan[d]).some(Boolean)).length, icon: '📅', color: '#3b82f6' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-4 flex items-center gap-3">
              <span className="text-2xl">{s.icon}</span>
              <div>
                <p className="font-bold text-gray-800" style={{ fontSize: '1.25rem', color: s.color }}>{s.val}</p>
                <p className="text-gray-400 text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <AddMealModal
          day={editing.day}
          mealType={editing.mealType}
          existing={plan[editing.day]?.[editing.mealType]}
          onSave={val => saveSlot(editing.day, editing.mealType, val)}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
