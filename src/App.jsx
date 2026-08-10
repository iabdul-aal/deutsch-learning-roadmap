import React, { Component } from 'react';
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

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] text-stone-900 flex items-center justify-center p-6">
          <div className="max-w-md w-full p-6 rounded-lg bg-white border border-rose-300 shadow-md space-y-4 text-center">
            <span className="text-3xl">Alert: </span>
            <h2 className="text-lg font-extrabold text-rose-700">Application State Notice</h2>
            <p className="text-xs text-stone-600">{this.state.error?.toString()}</p>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="px-4 py-2 rounded bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
            >
              Reset State & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const WorkspaceContent = () => {
  const { activeView } = useApp();
  const [isTimerOpen, setIsTimerOpen] = React.useState(false);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <TodayDashboard />;
      case 'curriculum': return <CurriculumView />;
      case 'survival': return <GermanySurvivalView />;
      case 'pronunciation': return <PronunciationView />;
      case 'vocabulary': return <VocabularyView />;
      case 'grammar': return <GrammarView />;
      case 'trackers': return <SkillsTrackersView />;
      case 'assessments': return <WeeklyAssessmentsView />;
      case 'resources': return <ResourceDatabaseView />;
      case 'mobile_apps': return <MobileAppsView />;
      default: return <TodayDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-900 font-sans flex flex-col md:flex-row">
      <Sidebar onOpenTimer={() => setIsTimerOpen(true)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
          {renderView()}
        </main>

        <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-500 font-mono">
          Deutsch Survival A1 Platform  |  8-Week Germany Preparation System for Arabic Speakers
        </footer>
      </div>

      {isTimerOpen && <QuickTimerModal onClose={() => setIsTimerOpen(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <WorkspaceContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
