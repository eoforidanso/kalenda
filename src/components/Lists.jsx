import { useState, useEffect } from 'react';
import { useToast } from './Toast';

const FAMILY = [
  { name: 'Harriet', initial: 'H', color: '#f472b6', bg: 'from-pink-400 to-rose-500' },
  { name: 'Dad',     initial: 'D', color: '#38bdf8', bg: 'from-sky-400 to-blue-500' },
  { name: 'Mom',     initial: 'M', color: '#fb7185', bg: 'from-rose-400 to-pink-500' },
  { name: 'Emma',    initial: 'E', color: '#34d399', bg: 'from-emerald-400 to-teal-500' },
  { name: 'Jake',    initial: 'J', color: '#fbbf24', bg: 'from-amber-400 to-orange-500' },
];

const initialLists = [
  {
    id: 1, name: 'Grocery', icon: '🛒', color: '#34d399', items: [
      { id: 1, label: 'Milk',             done: false, addedBy: 'Mom' },
      { id: 2, label: 'Bread',            done: true,  addedBy: 'Mom' },
      { id: 3, label: 'Eggs (12)',         done: false, addedBy: 'Harriet' },
      { id: 4, label: 'Chicken breast',   done: false, addedBy: 'Mom' },
      { id: 5, label: 'Broccoli',         done: true,  addedBy: 'Harriet' },
      { id: 6, label: 'Orange juice',     done: false, addedBy: 'Jake' },
      { id: 7, label: 'Greek yogurt',     done: false, addedBy: 'Emma' },
      { id: 8, label: 'Pasta sauce',      done: false, addedBy: 'Mom' },
    ],
  },
  {
    id: 2, name: 'To-Do', icon: '📋', color: '#7c3aed', items: [
      { id: 1, label: 'Book dentist appointment',  done: false, addedBy: 'Harriet' },
      { id: 2, label: 'Pay electricity bill',       done: true,  addedBy: 'Dad' },
      { id: 3, label: 'Oil change for car',         done: false, addedBy: 'Dad' },
      { id: 4, label: 'Emma school trip permission',done: false, addedBy: 'Mom' },
      { id: 5, label: 'Return library books',       done: false, addedBy: 'Jake' },
    ],
  },
  {
    id: 3, name: 'School Supplies', icon: '🎒', color: '#38bdf8', items: [
      { id: 1, label: '#2 Pencils (box)',  done: true,  addedBy: 'Emma' },
      { id: 2, label: 'Composition notebook', done: false, addedBy: 'Emma' },
      { id: 3, label: 'Scientific calculator', done: false, addedBy: 'Jake' },
      { id: 4, label: 'Colored markers',   done: false, addedBy: 'Mom' },
    ],
  },
  {
    id: 4, name: 'Vacation Packing', icon: '✈️', color: '#f472b6', items: [
      { id: 1, label: 'Passports',         done: true,  addedBy: 'Dad' },
      { id: 2, label: 'Sunscreen SPF 50',  done: false, addedBy: 'Mom' },
      { id: 3, label: 'Swimsuits',         done: false, addedBy: 'Harriet' },
      { id: 4, label: 'Phone chargers',    done: false, addedBy: 'Dad' },
      { id: 5, label: 'First aid kit',     done: true,  addedBy: 'Mom' },
    ],
  },
];

function getMember(name) { return FAMILY.find(f => f.name === name) || FAMILY[0]; }

export default function Lists() {
  const [lists, setLists] = useState(initialLists);
  const [activeList, setActiveList] = useState(initialLists[0]?.id ?? null);
  const [newItem, setNewItem] = useState('');
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const toast = useToast();

  // Load lists from API on mount; fall back to static initialLists on error
  useEffect(() => {
    import('../api/lists').then(({ getLists }) => {
      getLists().then(data => {
        if (data.length > 0) { setLists(data); setActiveList(data[0].id); }
      }).catch(() => {});
    });
  }, []);

  const current = lists.find(l => l.id === activeList);

  async function toggleItem(listId, itemId) {
    const list = lists.find(l => l.id === listId);
    const item = list?.items.find(it => it.id === itemId);
    if (!item) return;
    const newDone = !item.done;
    setLists(prev => prev.map(l => l.id === listId
      ? { ...l, items: l.items.map(it => it.id === itemId ? { ...it, done: newDone } : it) }
      : l
    ));
    try {
      const { toggleItem: apiToggle } = await import('../api/lists');
      await apiToggle(listId, itemId, newDone);
    } catch {
      setLists(prev => prev.map(l => l.id === listId
        ? { ...l, items: l.items.map(it => it.id === itemId ? { ...it, done: item.done } : it) }
        : l
      ));
    }
  }

  async function addItem() {
    if (!newItem.trim()) return;
    const tempId = Date.now();
    const text = newItem.trim();
    setLists(prev => prev.map(l => l.id === activeList
      ? { ...l, items: [...l.items, { id: tempId, label: text, done: false, addedBy: '' }] }
      : l
    ));
    setNewItem('');
    try {
      const { addItem: apiAdd } = await import('../api/lists');
      const saved = await apiAdd(activeList, text);
      setLists(prev => prev.map(l => l.id === activeList
        ? { ...l, items: l.items.map(it => it.id === tempId ? saved : it) }
        : l
      ));
    } catch {
      setLists(prev => prev.map(l => l.id === activeList
        ? { ...l, items: l.items.filter(it => it.id !== tempId) }
        : l
      ));
    }
  }

  async function addList() {
    if (!newListName.trim()) return;
    const name = newListName.trim();
    setNewListName('');
    setShowNewList(false);
    try {
      const { createList } = await import('../api/lists');
      const saved = await createList(name, '📝');
      setLists(prev => [...prev, { ...saved, items: [] }]);
      setActiveList(saved.id);
    } catch {
      // Optimistic fallback
      const id = Date.now();
      setLists(prev => [...prev, { id, name, icon: '📝', color: '#a78bfa', items: [] }]);
      setActiveList(id);
    }
  }

  async function clearDone() {
    setLists(prev => prev.map(l => l.id === activeList ? { ...l, items: l.items.filter(it => !it.done) } : l));
    try {
      const { clearCompleted } = await import('../api/lists');
      await clearCompleted(activeList);
    } catch { /* not critical */ }
  }

  async function deleteListItem(listId, itemId, label) {
    setLists(prev => prev.map(l => l.id === listId
      ? { ...l, items: l.items.filter(it => it.id !== itemId) }
      : l
    ));
    try {
      const { removeItem } = await import('../api/lists');
      await removeItem(listId, itemId);
      toast(`"${label}" removed`, 'info');
    } catch {
      toast('Could not remove item', 'error');
    }
  }

  async function deleteCurrentList() {
    if (lists.length <= 1) return;
    const id = activeList;
    const remaining = lists.filter(l => l.id !== id);
    setLists(remaining);
    setActiveList(remaining[0]?.id ?? null);
    try {
      const { deleteList } = await import('../api/lists');
      await deleteList(id);
      toast('List deleted', 'info');
    } catch {
      toast('Could not delete list', 'error');
    }
  }

  return (
    <div className="flex-1 flex overflow-hidden" style={{ background: 'transparent' }}>

      {/* Sidebar — list switcher */}
      <div className="w-20 sm:w-40 md:w-56 shrink-0 flex flex-col h-full scrollbar-thin overflow-y-auto pb-20 md:pb-0" style={{ background: '#ffffff', borderRight: '1px solid #e2ecf0' }}>
        <div className="px-4 py-4" style={{ borderBottom: '1px solid #e2ecf0' }}>
          <h2 className="text-gray-800 font-semibold text-sm">My Lists</h2>
          <p className="text-gray-400 text-xs mt-0.5">{lists.length} lists · shared family</p>
        </div>
        <div className="flex-1 px-2 py-2 space-y-0.5">
          {lists.map(l => {
            const done = l.items.filter(it => it.done).length;
            const total = l.items.length;
            const active = activeList === l.id;
            return (
              <div key={l.id} className="relative group/list">
                <button onClick={() => setActiveList(l.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all nav-tab-3d ${active ? 'nav-tab-3d-active' : 'hover:bg-gray-50'}`}
                  style={active ? { background: l.color + '18', border: `1px solid ${l.color}30` } : { border: '1px solid transparent' }}>
                  <span className="text-lg">{l.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${active ? 'text-gray-800' : 'text-gray-500'}`}>{l.name}</p>
                    <p className="text-gray-400 text-[10px]">{done}/{total} done</p>
                  </div>
                </button>
                {lists.length > 1 && (
                  <button
                    onClick={e => { e.stopPropagation(); setActiveList(l.id); deleteCurrentList(); }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover/list:opacity-100 transition-opacity text-gray-300 hover:text-red-400 p-1">
                    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="px-2 py-2" style={{ borderTop: '1px solid #e2ecf0' }}>
          {showNewList ? (
            <div className="px-2 py-2">
              <input value={newListName} onChange={e => setNewListName(e.target.value)}
                placeholder="List name..." autoFocus onKeyDown={e => e.key === 'Enter' && addList()}
                className="w-full rounded-xl px-3 py-2 text-gray-700 text-xs placeholder-gray-300 focus:outline-none mb-2" style={{ background: '#f8fafc', border: '1px solid #e2ecf0' }} />
              <div className="flex gap-1.5">
                <button onClick={addList} className="flex-1 py-1.5 text-xs font-semibold text-white rounded-lg" style={{ background: 'linear-gradient(135deg,#5bbfbf,#4db6ac)' }}>Create</button>
                <button onClick={() => setShowNewList(false)} className="flex-1 py-1.5 text-xs text-gray-500 hover:text-gray-700 rounded-lg transition-colors" style={{ border: '1px solid #e2ecf0' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowNewList(true)}
              className="w-full py-2 text-xs text-gray-400 hover:text-teal-500 rounded-xl transition-colors" style={{ border: '1px dashed rgba(0,0,0,0.10)' }}>
              + New list
            </button>
          )}
        </div>
      </div>

      {/* Main list area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="sticky top-0 z-10 px-5 py-3.5 flex items-center justify-between"
          style={{ background: 'rgba(245,248,250,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid #e2ecf0' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{current?.icon}</span>
            <div>
              <h1 className="text-gray-800 font-semibold">{current?.name}</h1>
              <p className="text-gray-500 text-xs">
                {current?.items.filter(i => !i.done).length} remaining · shared with family
              </p>
            </div>
          </div>
          {current?.items.some(i => i.done) && (
            <button onClick={clearDone} className="text-gray-400 text-xs hover:text-gray-600 transition-colors px-3 py-1.5 rounded-xl" style={{ border: '1px solid #e2ecf0' }}>
              Clear completed
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-5 pb-28 md:pb-5">
          <div className="max-w-2xl">

            {/* Add item */}
            <div className="glass rounded-2xl p-4 mb-5 flex items-center gap-3">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-gray-300 shrink-0"><path d="M8 2a.75.75 0 01.75.75V7.25h4.5a.75.75 0 010 1.5H8.75v4.5a.75.75 0 01-1.5 0V8.75H2.75a.75.75 0 010-1.5h4.5V2.75A.75.75 0 018 2z"/></svg>
              <input
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder={`Add to ${current?.name}...`}
                className="flex-1 bg-transparent text-gray-700 text-sm placeholder-gray-300 focus:outline-none"
              />
              {newItem && (
                <button onClick={addItem} className="shrink-0 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-all" style={{ background: 'linear-gradient(135deg,#5bbfbf,#4db6ac)' }}>Add</button>
              )}
            </div>

            {/* Items */}
            <div className="glass rounded-2xl overflow-hidden">
              {current?.items.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-4xl mb-3">{current?.icon}</p>
                  <p className="text-gray-400 text-sm">Your list is empty. Add something above.</p>
                </div>
              ) : (
                <div>
                  {/* Unchecked first */}
                  {current.items.filter(it => !it.done).map((it, idx, arr) => {
                    const m = getMember(it.addedBy);
                    return (
                      <div key={it.id}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer group"
                        style={{ borderBottom: idx < arr.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                        onClick={() => toggleItem(activeList, it.id)}>
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                          style={{ borderColor: current.color + '60', background: 'transparent' }} />
                        <p className="flex-1 text-gray-700 text-sm">{it.label}</p>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${m.bg} flex items-center justify-center text-white text-[8px] font-bold`}>{m.initial}</div>
                          <span className="text-gray-400 text-[10px]">{it.addedBy}</span>
                          <button onClick={e => { e.stopPropagation(); deleteListItem(activeList, it.id, it.label); }}
                            className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Checked items — Cozi shopping mode: checked go to bottom */}
                  {current.items.filter(it => it.done).length > 0 && (
                    <>
                      <div className="px-5 py-2" style={{ background: 'rgba(0,0,0,0.02)', borderTop: '1px solid #e8ecf0' }}>
                        <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">Completed ({current.items.filter(it => it.done).length})</p>
                      </div>
                      {current.items.filter(it => it.done).map((it, idx, arr) => {
                        const m = getMember(it.addedBy);
                        return (
                          <div key={it.id}
                            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors cursor-pointer group"
                            style={{ borderBottom: idx < arr.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                            onClick={() => toggleItem(activeList, it.id)}>
                            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                              style={{ borderColor: current.color, background: current.color + '25' }}>
                              <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke={current.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </div>
                            <p className="flex-1 text-gray-300 text-sm line-through">{it.label}</p>
                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${m.bg} flex items-center justify-center text-white text-[8px] font-bold`}>{m.initial}</div>
                              <button onClick={e => { e.stopPropagation(); deleteListItem(activeList, it.id, it.label); }}
                                className="text-gray-300 hover:text-red-400 transition-colors ml-1">
                                <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z"/></svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shared by note */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex -space-x-1.5">
                {FAMILY.slice(0, 4).map(m => (
                  <div key={m.name} className={`w-5 h-5 rounded-full bg-gradient-to-br ${m.bg} border border-gray-200 flex items-center justify-center text-white text-[8px] font-bold`}>{m.initial}</div>
                ))}
              </div>
              <p className="text-gray-400 text-xs">Shared with family · updates instantly</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
