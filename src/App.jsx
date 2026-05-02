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
      {/* Subtle ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-8%] w-[700px] h-[700px] rounded-full float-slow" style={{ background: 'radial-gradient(circle, rgba(91,191,191,0.08) 0%, transparent 70%)' }} />
        <div className="absolute top-[35%] right-[-12%] w-[550px] h-[550px] rounded-full float-medium" style={{ background: 'radial-gradient(circle, rgba(168,218,218,0.10) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full float-slow" style={{ background: 'radial-gradient(circle, rgba(245,184,184,0.07) 0%, transparent 70%)' }} />
      </div>
      <div className="relative z-10 flex h-full w-full">
        <Sidebar view={view} setView={setView} />
        <div className="flex-1 overflow-hidden pb-16 md:pb-0">
          <View setView={setView} />
        </div>
      </div>
    </div>
  );
}
