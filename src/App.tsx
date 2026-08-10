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
import { ResourceDatabaseView } from './components/ResourceDatabaseView';
import { MobileAppsView } from './components/MobileAppsView';
import { QuickTimerModal } from './components/QuickTimerModal';
import { CommandPalette } from './components/CommandPalette';
import { Search, Command } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Platform Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex items-center justify-center p-6 text-center font-sans">
          <div className="paper-card p-8 max-w-lg space-y-4 shadow-md">
            <h2 className="text-xl font-black text-rose-700">Platform Recovered from Unexpected State</h2>
            <p className="text-xs text-stone-600">
              An unexpected error occurred. Click below to clear local state and reload cleanly.
            </p>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-xs"
            >
              Reset Application State & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainAppContent: React.FC = () => {
  const { activeView } = useApp();
  const [timerModalOpen, setTimerModalOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleCustomOpen = () => setCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleCustomOpen);
    return () => window.removeEventListener('open-command-palette', handleCustomOpen);
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <TodayDashboard />;
      case 'curriculum':
        return <CurriculumView />;
      case 'survival':
        return <GermanySurvivalView />;
      case 'pronunciation':
        return <PronunciationView />;
      case 'vocabulary':
        return <VocabularyView />;
      case 'grammar':
        return <GrammarView />;
      case 'trackers':
        return <SkillsTrackersView />;
      case 'assessments':
        return <WeeklyAssessmentsView />;
      case 'resources':
        return <ResourceDatabaseView />;
      case 'mobile_apps':
        return <MobileAppsView />;
      default:
        return <TodayDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-sans flex flex-col md:flex-row antialiased selection:bg-amber-400 selection:text-stone-950">
      
      {/* Sidebar Navigation */}
      <Sidebar onOpenTimer={() => setTimerModalOpen(true)} />

      {/* Main Workspace Column */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        
        {/* Top Vercel/Lovable-Style Command Bar Header */}
        <div className="hidden sm:flex items-center justify-between p-3 rounded-lg bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="font-bold text-stone-900">Deutsch Survival A1</span>
            <span>/</span>
            <span className="capitalize text-amber-800 font-extrabold">{activeView.replace('_', ' ')}</span>
          </div>

          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 text-xs transition-all"
          >
            <div className="flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-stone-400" />
              <span>Search or jump to...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white text-stone-500 text-[10px] font-mono border border-stone-300 shadow-2xs flex items-center gap-0.5">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Dynamic View Component */}
        {renderView()}
      </main>

      {/* Quick Timer Modal */}
      {timerModalOpen && (
        <QuickTimerModal onClose={() => setTimerModalOpen(false)} />
      )}

      {/* Vercel/Lovable-Style Cmd+K Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
    </div>
  );
};

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
