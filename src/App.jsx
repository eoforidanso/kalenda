import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Photos from './components/Photos';
import Albums from './components/Albums';
import Calendar from './components/Calendar';
import AIStudio from './components/AIStudio';
import Memories from './components/Memories';
import Family from './components/Family';
import Frames from './components/Frames';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Tasks from './components/Tasks';
import Lists from './components/Lists';
import Landing from './components/Landing';

const views = { dashboard: Dashboard, photos: Photos, albums: Albums, calendar: Calendar, aistudio: AIStudio, memories: Memories, family: Family, frames: Frames, notifications: Notifications, settings: Settings, tasks: Tasks, lists: Lists };

export default function App() {
  const [view, setView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const View = views[view] || Dashboard;

  if (!user) {
    return <Landing onEnter={(name) => setUser(name)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden relative" style={{ background: '#f5f8fa' }}>
      {/* Ambient orbs — visible through glass panels */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-18%] left-[-10%] w-[800px] h-[800px] rounded-full orb-1" style={{ background: 'radial-gradient(circle, rgba(91,191,191,0.14) 0%, transparent 65%)' }} />
        <div className="absolute top-[30%] right-[-15%] w-[650px] h-[650px] rounded-full orb-2" style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.10) 0%, transparent 65%)' }} />
        <div className="absolute bottom-[-12%] left-[25%] w-[580px] h-[580px] rounded-full orb-3" style={{ background: 'radial-gradient(circle, rgba(245,184,184,0.09) 0%, transparent 65%)' }} />
        <div className="absolute top-[60%] left-[-5%] w-[400px] h-[400px] rounded-full orb-4" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)' }} />
      </div>
      <div className="relative z-10 flex h-full w-full">
        <Sidebar view={view} setView={setView} />
        <div className="flex-1 overflow-hidden" style={{ paddingBottom: 0 }}>
          <View setView={setView} />
        </div>
      </div>
    </div>
  );
}
