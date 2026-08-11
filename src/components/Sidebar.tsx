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
  { id: 'dashboard',   label: 'Study Hub',          icon: LayoutDashboard, desc: 'Daily roadmap' },
  { id: 'curriculum',  label: '8-Week Roadmap',      icon: Calendar,        desc: 'Full plan' },
  { id: 'missions',    label: 'Missions',             icon: Globe,           desc: 'Real-world tasks' },
  { id: 'vocabulary',  label: 'Vocabulary Cards',    icon: BookOpen,        desc: 'Flashcards' },
  { id: 'grammar',     label: 'Grammar Lab',         icon: FileText,        desc: 'Rules & drills' },
  { id: 'pronunciation', label: 'Pronunciation',     icon: Volume2,         desc: 'Phonetics' },
  { id: 'survival',   label: 'Germany Survival',     icon: Compass,         desc: 'Real-world' },
  { id: 'assessments', label: 'Weekly Tests',        icon: Trophy,          desc: 'Assess & track' },
  { id: 'trackers',   label: 'Skills Tracker',       icon: BarChart3,       desc: 'Progress log' },
  { id: 'resources',  label: 'Resources',            icon: Bookmark,        desc: 'Study materials' },
  { id: 'mobile_apps', label: 'Companion Apps',      icon: Smartphone,      desc: 'Mobile tools' },
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
              <span className="truncate text-xs">{currentTrack.name}</span>
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

        {/* Pace Mode Toggle */}
        <div className="flex items-center bg-white/8 p-0.5 rounded-lg border border-white/10">
          <button
            onClick={() => setMode('standard')}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all text-center ${
              mode === 'standard'
                ? 'bg-white/15 text-white shadow-xs'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => setMode('intensive')}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-bold transition-all text-center ${
              mode === 'intensive'
                ? 'bg-rose-600/80 text-white shadow-xs'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            Intensive
          </button>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-none">
        <div className="text-[9px] font-black text-white/25 uppercase tracking-widest px-2 pt-1 pb-2">
          Navigation
        </div>
        {NAV_ITEMS.map(({ id, label, icon: Icon, desc }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-white/30'}`} />
              <div className="min-w-0 text-left">
                <div className="text-[12px] font-semibold leading-none truncate">{label}</div>
              </div>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer: Progress + Controls ── */}
      <div className="p-4 border-t border-white/10 space-y-3">
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
      <header className="md:hidden sticky top-0 z-50 bg-[#0f0f12] border-b border-white/10 p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500 flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-stone-950" />
          </div>
          <span className="font-black text-white text-sm tracking-tight">
            GERMAN <span className="text-amber-400">{currentTrack.level}</span>
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(m => !m)}
          className="p-2 rounded-lg bg-white/10 text-white/70 hover:text-white border border-white/10 transition-colors"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-72 h-full flex flex-col bg-[#0f0f12]">
            {sidebarContent}
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 min-h-screen shrink-0 flex-col bg-[#0f0f12] border-r border-white/10">
        {sidebarContent}
      </div>
    </>
  );
};
