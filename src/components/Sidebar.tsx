import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AVAILABLE_TRACKS } from '../config/activeLanguageTrack';
import {
  Flame, Clock, LayoutDashboard, Calendar,
  Compass, Volume2, BookOpen, FileText, BarChart3,
  CheckCircle2, Bookmark, Smartphone, RotateCcw,
  ChevronDown, Menu, X, Globe, Sparkles, Trophy
} from 'lucide-react';

interface SidebarProps {
  onOpenTimer: () => void;
}

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Study Hub',   icon: LayoutDashboard },
  { id: 'curriculum',  label: 'Roadmap',     icon: Calendar },
  { id: 'grammar',     label: 'Grammar',     icon: FileText },
  { id: 'vocabulary',  label: 'Vocabulary',  icon: BookOpen },
  { id: 'missions',    label: 'Missions',    icon: Globe },
  { id: 'assessments', label: 'Tests',       icon: Trophy },
  { id: 'resources',   label: 'Resources',   icon: Bookmark },
];

export const Sidebar: React.FC<SidebarProps> = ({ onOpenTimer }) => {
  const {
    mode, setMode, activeView, setActiveView,
    currentTrackId, setTrackId,
    streakDays, completedTasks, totalTaskCount, resetProgress,
    learnerModel, dueCardCount,
  } = useApp();

  const [trackDropdownOpen, setTrackDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / Math.max(totalTaskCount, 1)) * 100));

  const currentTrack = AVAILABLE_TRACKS.find(t => t.id === currentTrackId) || AVAILABLE_TRACKS[0];

  const handleNavClick = (id: string) => {
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  const sidebarContent = (
    <aside className="sidebar-root w-full h-full flex flex-col">

      {/* German Flag Stripe */}
      <div className="german-flag-stripe" />

      {/* ── Branding Header ── */}
      <div className="p-4 border-b border-white/10 space-y-3">
        <button
          onClick={() => handleNavClick('dashboard')}
          className="flex items-center gap-2.5 w-full hover:opacity-90 transition-opacity text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shrink-0">
            <Globe className="w-4 h-4 text-stone-950" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-black text-white tracking-tight leading-none">
              GERMAN ROADMAP
            </div>
            <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mt-0.5">
              {currentTrack.level} · Guided Study
            </div>
          </div>
        </button>

        {/* Level Selector */}
        <div className="relative">
          <button
            onClick={() => setTrackDropdownOpen(d => !d)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/8 hover:bg-white/12 border border-white/12 text-sm font-semibold text-white/90 transition-all"
          >
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate text-xs font-bold text-white">{currentTrack.shortName || currentTrack.name}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-white/40 shrink-0 transition-transform ${trackDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {trackDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 bg-[#1a1a22] border border-white/15 rounded-xl shadow-xl z-50 overflow-hidden">
              {AVAILABLE_TRACKS.map((track) => (
                <button
                  key={track.id}
                  onClick={() => { setTrackId(track.id); setTrackDropdownOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs transition-all ${
                    currentTrackId === track.id
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'text-white/60 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <span>{track.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                    track.level === 'A1' ? 'bg-amber-500/30 text-amber-300' :
                    track.level === 'A2' ? 'bg-indigo-500/30 text-indigo-300' :
                    'bg-emerald-500/30 text-emerald-300'
                  }`}>{track.level}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none">
        <div className="text-[9px] font-black text-white/30 uppercase tracking-widest px-2.5 pt-1 pb-2">
          Menu
        </div>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-amber-500/15 text-amber-400 font-bold border border-amber-500/20'
                  : 'text-white/60 hover:bg-white/8 hover:text-white border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-white/40'}`} />
              <span className="truncate">{label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer: Progress + Controls — sticky so timer is always reachable ── */}
      <div className="p-4 border-t border-white/10 space-y-3 sticky bottom-0 bg-[#0f0f12] z-10">
        {/* Overall progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/50 font-medium">{currentTrack.level} Progress</span>
            <span className="font-mono text-amber-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Stats + Controls row */}
        <div className="flex items-center justify-between">
          {/* Streak */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/20">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-300">{streakDays}d streak</span>
          </div>

          {/* Timer button */}
          <button
            onClick={() => {
              onOpenTimer();
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-amber-500 hover:text-stone-950 text-white/70 text-[11px] font-bold transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            Timer
          </button>

          {/* Reset (protected) */}
          <button
            onClick={resetProgress}
            title="Reset all progress"
            className="p-1.5 rounded-lg text-white/20 hover:text-rose-400 hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-[#0f0f12] border-b border-white/10 px-3 py-2 flex items-center justify-between gap-2 min-h-[48px]">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center shrink-0">
            <Globe className="w-3.5 h-3.5 text-stone-950" />
          </div>
          <span className="font-black text-white text-xs tracking-tight truncate">
            {currentTrack.shortName || currentTrack.name}
          </span>
        </div>

        {/* Progress + Controls on Mobile Header */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Progress pill */}
          <div className="hidden xs:flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg">
            <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-400">{progressPercent}%</span>
          </div>

          {/* Timer — compact, no text on very small screens */}
          <button
            onClick={() => onOpenTimer()}
            className="h-8 px-2.5 rounded-lg bg-amber-500 text-stone-950 font-black transition-all flex items-center gap-1.5 text-[11px] shrink-0"
            aria-label="Open study timer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Timer</span>
          </button>

          {/* Menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(m => !m)}
            className="h-8 w-8 rounded-lg bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors flex items-center justify-center shrink-0"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="w-72 h-full flex flex-col bg-[#0f0f12]">
            {sidebarContent}
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 min-h-screen shrink-0 flex-col bg-[#0f0f12] border-r border-white/10">
        {sidebarContent}
      </div>
    </>
  );
};
