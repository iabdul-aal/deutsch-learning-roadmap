import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TodayDashboard } from './components/TodayDashboard';
import { CurriculumView } from './components/CurriculumView';
import { GermanySurvivalView } from './components/GermanySurvivalView';
import { PronunciationView } from './components/PronunciationView';
import { VocabularyView } from './components/VocabularyView';
import { GrammarView } from './components/GrammarView';
import { SkillsTrackersView } from './components/SkillsTrackersView';
import { WeeklyAssessmentsView } from './components/WeeklyAssessmentsView';
import { ResourcesView } from './components/ResourcesView';
import { MissionsView } from './components/MissionsView';
import { MobileAppsView } from './components/MobileAppsView';
import { QuickTimerModal } from './components/QuickTimerModal';
import { CommandPalette } from './components/CommandPalette';
import { OnboardingFlow } from './components/OnboardingFlow';
import { AVAILABLE_TRACKS } from './config/activeLanguageTrack';
import { Search, Command, Clock } from 'lucide-react';

// ── Error Boundaries ──────────────────────────────────────────────

interface BoundaryProps { children: React.ReactNode }
interface BoundaryState { hasError: boolean; error: Error | null }

class ErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error): BoundaryState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Platform Error Caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-6 text-center font-sans">
          <div className="paper-card p-8 max-w-lg space-y-4 shadow-md">
            <h2 className="text-xl font-black text-rose-700">Platform Recovered from Unexpected State</h2>
            <p className="text-xs text-stone-600">
              An unexpected error occurred. Click below to clear local state and reload cleanly.
            </p>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all"
            >
              Reset and Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

class ViewErrorBoundary extends React.Component<BoundaryProps, { hasError: boolean }> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ViewErrorBoundary]', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="paper-card p-6 text-center space-y-3 my-4">
          <h3 className="text-sm font-black text-rose-700">This view encountered an error</h3>
          <p className="text-xs text-stone-500">The rest of the app is unaffected.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="btn-amber text-xs"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ── App Shell (only rendered after onboarding) ────────────────────

/**
 * AppShell is a SEPARATE component from the onboarding gate.
 * This ensures all hooks are called unconditionally - no early
 * returns before useEffect/useState calls.
 */
const AppShell: React.FC = () => {
  const { activeView, learnerModel, currentTrackId, completedTasks, totalTaskCount } = useApp();
  const [timerModalOpen, setTimerModalOpen]       = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((completedCount / Math.max(totalTaskCount, 1)) * 100));
  const currentTrack = AVAILABLE_TRACKS.find(t => t.id === currentTrackId) || AVAILABLE_TRACKS[0];

  useEffect(() => {
    const open = () => setCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', open);
    return () => window.removeEventListener('open-command-palette', open);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':    return <TodayDashboard />;
      case 'curriculum':   return <CurriculumView />;
      case 'survival':     return <GermanySurvivalView />;
      case 'pronunciation':return <PronunciationView />;
      case 'vocabulary':   return <VocabularyView />;
      case 'grammar':      return <GrammarView />;
      case 'trackers':     return <SkillsTrackersView />;
      case 'assessments':  return <WeeklyAssessmentsView />;
      case 'resources':    return <ResourcesView />;
      case 'missions':     return <MissionsView />;
      case 'mobile_apps':  return <MobileAppsView />;
      default:             return <TodayDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-sans flex flex-col md:flex-row antialiased selection:bg-amber-400 selection:text-stone-950">
      <Sidebar onOpenTimer={() => setTimerModalOpen(true)} />

      <main
        id="main-content"
        className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl"
        aria-label="Main content"
      >
        {/* Command bar header with Persistent Progress Bar and Timer */}
        <div className="hidden sm:flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 shadow-xs gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium shrink-0">
            <span className="font-bold text-stone-900">Deutsch OS</span>
            <span>/</span>
            <span className="text-amber-600 font-black uppercase text-[11px] tracking-wide">
              {currentTrack.shortName || currentTrack.name}
            </span>
            <span>/</span>
            <span className="capitalize text-stone-700 font-bold">
              {activeView.replace(/_/g, ' ')}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Global Persistent Progress Bar */}
            <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">{currentTrack.level}</span>
              <div className="w-24 sm:w-32 h-2 rounded-full bg-stone-200 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-amber-700">{progressPercent}%</span>
            </div>

            {/* Global Persistent Timer Button */}
            <button
              onClick={() => setTimerModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs shrink-0"
              title="Open Study Session Timer"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Timer</span>
            </button>

            {/* Command Palette Search */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 text-xs transition-all shrink-0"
            >
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <kbd className="px-1.5 py-0.5 rounded bg-white text-stone-500 text-[10px] font-mono border border-stone-300 flex items-center gap-0.5">
                <Command className="w-3 h-3" /> K
              </kbd>
            </button>
          </div>
        </div>

        {/* Dynamic view */}
        <ViewErrorBoundary key={activeView}>
          {renderView()}
        </ViewErrorBoundary>
      </main>

      {timerModalOpen && (
        <QuickTimerModal onClose={() => setTimerModalOpen(false)} />
      )}

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};

// ── Routing gate - no hooks before any return ─────────────────────

/**
 * MainAppContent owns the onboarding gate.
 * It reads hasSeenWelcome FIRST, then conditionally renders
 * either OnboardingFlow or AppShell.
 *
 * CRITICAL: All hooks (useState, useEffect) are in the child
 * components, not here - so there are no Rules-of-Hooks violations.
 */
const MainAppContent: React.FC = () => {
  const { hasSeenWelcome } = useApp();

  if (!hasSeenWelcome) {
    return <OnboardingFlow />;
  }

  return <AppShell />;
};

// ── Root ──────────────────────────────────────────────────────────

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
