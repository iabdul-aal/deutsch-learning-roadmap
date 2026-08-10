import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_TRACKS } from '../config/activeLanguageTrack';
import { 
  Flame, Clock, CheckCircle2, LayoutDashboard, Calendar, 
  Compass, Volume2, BookOpen, FileText, Mic, Bookmark, 
  Smartphone, RotateCcw, ChevronDown, Menu, X, Globe, Layers
} from 'lucide-react';

interface SidebarProps {
  onOpenTimer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenTimer }) => {
  const { 
    mode, setMode, activeView, setActiveView, 
    currentTrackId, setTrackId,
    streakDays, completedTasks, resetProgress 
  } = useApp();

  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / 392) * 100));

  const currentTrack = AVAILABLE_TRACKS.find(t => t.id === currentTrackId) || AVAILABLE_TRACKS[0];

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'curriculum', label: '56-Day Roadmap', icon: Calendar },
    { id: 'survival', label: 'Germany Survival', icon: Compass },
    { id: 'pronunciation', label: 'Phonetics Lab', icon: Volume2 },
    { id: 'vocabulary', label: 'Vocabulary SRS', icon: BookOpen },
    { id: 'grammar', label: '18 Grammar Modules', icon: FileText },
    { id: 'trackers', label: 'Skill Trackers', icon: Mic },
    { id: 'assessments', label: 'Weekly Tests', icon: CheckCircle2 },
    { id: 'resources', label: 'Resource Database', icon: Bookmark },
    { id: 'mobile_apps', label: 'Companion Apps', icon: Smartphone }
  ];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white border-b border-stone-200 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-amber-700" />
          <span className="font-extrabold text-stone-900 text-sm tracking-tight">DEUTSCH SURVIVAL {currentTrack.level}</span>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded bg-stone-100 text-stone-700 border border-stone-300 min-h-[38px] min-w-[38px] flex items-center justify-center"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Vertical Sidebar Container */}
      <aside 
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block fixed md:sticky top-0 z-40 w-full md:w-64 h-screen bg-white border-r border-stone-200 shrink-0 flex flex-col justify-between shadow-xs overflow-y-auto`}
      >
        {/* Top Branding & Flag */}
        <div>
          <div className="german-flag-editorial w-full"></div>
          
          <div className="p-4 border-b border-stone-200 space-y-3">
            <div 
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Globe className="w-6 h-6 text-amber-700 shrink-0" />
              <div>
                <span className="font-black text-stone-900 tracking-tight text-sm block">
                  DEUTSCH SURVIVAL <span className="text-amber-600">{currentTrack.level}</span>
                </span>
                <span className="text-[10px] text-stone-400 font-mono font-bold block uppercase tracking-wider">
                  GERMANY ROADMAP PLATFORM
                </span>
              </div>
            </div>

            {/* Level & Track Selector Dropdown (A1, A2, B1) */}
            <div className="relative pt-1">
              <button 
                onClick={() => setTrackDropdownOpen(!trackDropdownOpen)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-extrabold transition-all"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Layers className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span className="truncate">{currentTrack.name}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              </button>

              {trackDropdownOpen && (
                <div className="absolute left-0 mt-1 w-full bg-white border border-stone-300 rounded-lg shadow-xl z-50 p-2 text-xs">
                  <div className="p-1 font-bold text-stone-500 border-b border-stone-200 text-[10px] uppercase">
                    Select Target Level Roadmap
                  </div>
                  {AVAILABLE_TRACKS.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => {
                        setTrackId(track.id);
                        setTrackDropdownOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded my-1 transition-all ${
                        currentTrackId === track.id
                          ? 'bg-amber-50 border border-amber-300 text-amber-950 font-black' 
                          : 'hover:bg-stone-100 text-stone-700 font-bold'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span>{track.name}</span>
                        <span className={`px-1.5 py-0.2 rounded font-black text-[9px] ${
                          track.level === 'A1' ? 'bg-amber-500 text-stone-950' :
                          track.level === 'A2' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
                        }`}>
                          {track.level}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mode Switcher */}
            <div className="bg-stone-100 p-1 rounded border border-stone-300 flex items-center text-xs font-bold w-full">
              <button
                onClick={() => setMode('standard')}
                className={`flex-1 py-1 rounded transition-all text-center ${mode === 'standard' ? 'bg-white text-stone-900 shadow-xs border border-stone-300 font-black' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Standard (~3h)
              </button>
              <button
                onClick={() => setMode('intensive')}
                className={`flex-1 py-1 rounded transition-all text-center ${mode === 'intensive' ? 'bg-rose-600 text-white font-black' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Intensive (~5h)
              </button>
            </div>
          </div>

          {/* Navigation Links List */}
          <nav className="p-3 space-y-1">
            <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2 pb-1">
              Workspace Views ({currentTrack.level})
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-100/80 text-amber-950 border-l-4 border-amber-600 shadow-xs font-black'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Footer */}
        <div className="p-4 border-t border-stone-200 space-y-3 bg-stone-50/50">
          
          {/* Progress Tracker */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span>{currentTrack.level} Progress</span>
              <span className="font-mono text-amber-900">{progressPercent}%</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 h-full transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[11px]">
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>{streakDays}d Streak</span>
            </div>

            <button 
              onClick={onOpenTimer}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-[11px] font-bold transition-all"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Timer</span>
            </button>

            <button 
              onClick={resetProgress}
              title="Reset Progress State"
              className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-stone-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
