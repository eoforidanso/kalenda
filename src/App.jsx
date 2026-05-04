import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Photos, { allPhotos } from './components/Photos';
import Albums from './components/Albums';
import Calendar, { INITIAL_EVENT_DB } from './components/Calendar';
import AIStudio from './components/AIStudio';
import Memories from './components/Memories';
import Family from './components/Family';
import Frames from './components/Frames';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Tasks from './components/Tasks';
import Lists from './components/Lists';
import Location from './components/Location';
import MealPlanner from './components/MealPlanner';
import Budget from './components/Budget';
import Messages from './components/Messages';
import Landing from './components/Landing';
import GlobalSearch from './components/GlobalSearch';
import { ToastProvider } from './components/Toast';
import { PlanProvider } from './context/PlanContext';
import FAB from './components/FAB';
import { getToken, clearTokens } from './api/client';

const views = { dashboard: Dashboard, photos: Photos, albums: Albums, calendar: Calendar, aistudio: AIStudio, memories: Memories, family: Family, frames: Frames, notifications: Notifications, settings: Settings, tasks: Tasks, lists: Lists, location: Location, mealplanner: MealPlanner, budget: Budget, messages: Messages };

function loadUser() {
  try { return JSON.parse(localStorage.getItem('kalenda_user')); } catch { return null; }
}

export default function App() {
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState(() => getToken() ? loadUser() : null);
  const [notifUnread, setNotifUnread] = useState(4);
  const [showSearch, setShowSearch] = useState(false);
  const [photos, setPhotos] = useState(allPhotos);
  const [eventDB, setEventDB] = useState(INITIAL_EVENT_DB);
  const View = views[view] || Dashboard;

  // Force logout when the API client dispatches 'kalenda:logout' (token expired)
  useEffect(() => {
    function onLogout() { clearTokens(); setUser(null); }
    window.addEventListener('kalenda:logout', onLogout);
    return () => window.removeEventListener('kalenda:logout', onLogout);
  }, []);

  useEffect(() => {
    const viewKeys = ['dashboard','calendar','photos','family','tasks','lists','messages','budget','mealplanner'];
    function onKey(e) {
      const inInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
      if ((e.key === '/' && !inInput) || (e.key === 'k' && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key >= '1' && e.key <= '9' && (e.metaKey || e.ctrlKey)) {
        const target = viewKeys[parseInt(e.key, 10) - 1];
        if (target) { e.preventDefault(); setView(target); }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setView]);

  function handleLogin(userData) {
    localStorage.setItem('kalenda_user', JSON.stringify(userData));
    setUser(userData);
  }

  if (!user) {
    return <Landing onEnter={handleLogin} />;
  }

  return (
    <PlanProvider>
    <ToastProvider>
    <div className="flex h-screen overflow-hidden relative" style={{ background: '#f5f8fa' }}>
      {/* Ambient orbs — visible through glass panels */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-18%] left-[-10%] w-[800px] h-[800px] rounded-full orb-1" style={{ background: 'radial-gradient(circle, rgba(91,191,191,0.14) 0%, transparent 65%)' }} />
        <div className="absolute top-[30%] right-[-15%] w-[650px] h-[650px] rounded-full orb-2" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-12%] left-[25%] w-[580px] h-[580px] rounded-full orb-3" style={{ background: 'radial-gradient(circle, rgba(245,184,184,0.09) 0%, transparent 65%)' }} />
        <div className="absolute top-[60%] left-[-5%] w-[400px] h-[400px] rounded-full orb-4" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)' }} />
      </div>
      <div className="relative z-10 flex h-full w-full">
        <Sidebar view={view} setView={setView} notifUnread={notifUnread} onSearchOpen={() => setShowSearch(true)} />
        <div key={view} className="flex-1 flex flex-col h-full overflow-hidden view-fade">
          {view === 'notifications'
            ? <Notifications setView={setView} onUnreadChange={setNotifUnread} />
            : <View setView={setView} photos={photos} setPhotos={setPhotos} eventDB={eventDB} setEventDB={setEventDB} />}
        </div>
      </div>
      {showSearch && <GlobalSearch
        setView={setView}
        onClose={() => setShowSearch(false)}
        livePhotos={photos}
        liveEvents={Object.entries(eventDB).flatMap(([dateKey, evs]) => evs.map(e => ({ ...e, dateKey })))}
      />}
      <FAB setView={setView} />
    </div>
    </ToastProvider>
    </PlanProvider>
  );
}
