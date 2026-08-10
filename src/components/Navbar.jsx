import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_TRACKS, CURRENT_TRACK_ID } from '../config/activeLanguageTrack';
import { 
  Flame, Clock, CheckCircle2, LayoutDashboard, Calendar, 
  Compass, Volume2, BookOpen, FileText, Mic, Bookmark, 
  Smartphone, RotateCcw, ChevronDown
} from 'lucide-react';

export const Navbar = ({ onOpenTimer }) => {
  const { 
    mode, setMode, activeView, setActiveView, 
    streakDays, completedTasks, resetProgress 
  } = useApp();

  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / 392) * 100));

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

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 text-stone-900 shadow-sm">
      <div className="german-flag-editorial w-full"></div>
      
      {/* Top Application Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Product Identity & Track Selector */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-xl">🇩🇪</span>
            <span className="font-extrabold text-stone-900 tracking-tight text-sm">
              DEUTSCH SURVIVAL <span className="text-amber-600">A1</span>
            </span>
            <span className="text-stone-400 font-mono text-[11px] hidden sm:inline">| 8-WEEK GERMANY PREP</span>
          </div>

          {/* Language Track Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setTrackDropdownOpen(!trackDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 text-[11px] font-bold transition-all"
            >
              <span>{AVAILABLE_TRACKS.find(t => t.id === CURRENT_TRACK_ID)?.name}</span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {trackDropdownOpen && (
              <div className="absolute left-0 mt-1 w-72 bg-white border border-stone-300 rounded-lg shadow-xl z-50 p-2 text-xs">
                <div className="p-1.5 font-bold text-stone-500 border-b border-stone-200 text-[10px] uppercase">
                  Available Language Tracks
                </div>
                {AVAILABLE_TRACKS.map((track) => (
                  <div 
                    key={track.id}
                    className={`p-2 rounded my-1 transition-all ${track.active ? 'bg-amber-50 border border-amber-300 text-amber-900 font-bold' : 'text-stone-400 opacity-60'}`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span>{track.name}</span>
                      {track.active && <span className="px-1.5 py-0.2 rounded bg-amber-500 text-white font-black text-[9px]">ACTIVE</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center gap-3">
          
          {/* Workload Mode Switcher */}
          <div className="bg-stone-100 p-0.5 rounded border border-stone-300 flex items-center text-[11px] font-bold">
            <button
              onClick={() => setMode('standard')}
              className={`px-2.5 py-0.5 rounded transition-all ${mode === 'standard' ? 'bg-white text-stone-900 shadow-sm border border-stone-300 font-black' : 'text-stone-600 hover:text-stone-900'}`}
            >
              Standard (~3h/d)
            </button>
            <button
              onClick={() => setMode('intensive')}
              className={`px-2.5 py-0.5 rounded transition-all ${mode === 'intensive' ? 'bg-rose-600 text-white font-black' : 'text-stone-600 hover:text-stone-900'}`}
            >
              Intensive (~5h/d)
            </button>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-800 font-bold text-[11px]">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span>{streakDays}d Streak</span>
          </div>

          {/* Study Timer Button */}
          <button 
            onClick={onOpenTimer}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-[11px] font-bold transition-all"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Timer</span>
          </button>

          {/* Reset Button */}
          <button 
            onClick={resetProgress}
            title="Reset Progress State"
            className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation Workspace Tabs */}
      <nav className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none border-t border-stone-200">
        <div className="flex items-center gap-1 py-1.5 min-w-max text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-100/70 text-amber-900 border border-amber-300 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-700' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="w-full bg-stone-200 h-1">
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-emerald-500 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
      </div>
    </header>
  );
};
