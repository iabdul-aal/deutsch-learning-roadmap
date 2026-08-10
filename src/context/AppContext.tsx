import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CURRICULUM_DATA } from '../data/tracks/german-a1-ar/curriculum';
import { CURRICULUM_DATA_A2 } from '../data/tracks/german-a2-ar/curriculum';
import { CURRICULUM_DATA_B1 } from '../data/tracks/german-b1-ar/curriculum';

export interface AppState {
  mode: 'standard' | 'intensive';
  activeView: string;
  currentTrackId: string;
  completedTasks: Record<string, boolean>;
  completedDays: number[];
  vocabStatus: Record<string, string>;
  grammarStatus: Record<string, boolean>;
  weakTopics: string[];
  manualListeningMinutes: number;
  manualSpeakingMinutes: number;
  manualWritingTasksCompleted: number;
  streakDays: number;
  studyTimerSeconds: number;
  isTimerRunning: boolean;
  activeTimerTask: string;
}

export interface AutoMetrics {
  autoListeningMins: number;
  autoSpeakingMins: number;
  autoWritingCount: number;
}

export interface AppContextType extends AppState {
  listeningMinutes: number;
  speakingMinutes: number;
  writingTasksCompleted: number;
  autoMetrics: AutoMetrics;
  activeCurriculumData: any;
  setMode: (mode: 'standard' | 'intensive') => void;
  setActiveView: (view: string) => void;
  setTrackId: (trackId: string) => void;
  toggleTask: (taskId: string, dayNumber: number) => void;
  markDayComplete: (dayNumber: number) => void;
  updateVocabStatus: (wordId: string, status: string) => void;
  updateGrammarStatus: (moduleId: string, status: boolean) => void;
  toggleGrammarStatus: (moduleId: string) => void;
  addWeakTopic: (topicTag: string) => void;
  removeWeakTopic: (topicTag: string) => void;
  addListeningMinutes: (mins: number) => void;
  addSpeakingMinutes: (mins: number) => void;
  incrementWritingTasks: () => void;
  resetProgress: () => void;
}

const defaultState: AppState = {
  mode: 'standard',
  activeView: 'dashboard',
  currentTrackId: 'german-a1-ar',
  completedTasks: {},
  completedDays: [],
  vocabStatus: {},
  grammarStatus: {},
  weakTopics: [],
  manualListeningMinutes: 0,
  manualSpeakingMinutes: 0,
  manualWritingTasksCompleted: 0,
  streakDays: 5,
  studyTimerSeconds: 1500,
  isTimerRunning: false,
  activeTimerTask: 'Daily German Study Session'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'deutsch_survival_app_state_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
    } catch (e) {
      console.error("Failed to load local storage state:", e);
      return defaultState;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state to local storage:", e);
    }
  }, [state]);

  const getActiveCurriculumData = () => {
    if (state.currentTrackId === 'german-a2-ar') return CURRICULUM_DATA_A2;
    if (state.currentTrackId === 'german-b1-ar') return CURRICULUM_DATA_B1;
    return CURRICULUM_DATA;
  };

  const activeCurriculumData = getActiveCurriculumData();

  const computeAutoMetrics = (): AutoMetrics => {
    let autoListeningMins = 0;
    let autoSpeakingMins = 0;
    let autoWritingCount = 0;

    if (!activeCurriculumData?.weeks) {
      return { autoListeningMins, autoSpeakingMins, autoWritingCount };
    }

    activeCurriculumData.weeks.forEach((week: any) => {
      (week.days || []).forEach((day: any) => {
        const allDayTasks = [...(day.standardTasks || []), ...(day.intensiveTasks || [])];
        allDayTasks.forEach((task: any, idx: number) => {
          const taskId = `day-${day.dayNumber}-task-${idx}`;
          if (state.completedTasks[taskId]) {
            const match = (task.duration || '').match(/(\d+)/);
            const durationMins = match ? parseInt(match[1], 10) : 20;

            const tType = (task.type || '').toUpperCase();
            const titleLower = (task.title || '').toLowerCase();

            if (tType === 'VIDEO' || tType === 'LISTENING' || titleLower.includes('watch') || titleLower.includes('listen') || titleLower.includes('audio')) {
              autoListeningMins += durationMins;
            }

            if (tType === 'SPEAKING' || titleLower.includes('speak') || titleLower.includes('record') || titleLower.includes('shadow') || titleLower.includes('roleplay')) {
              autoSpeakingMins += durationMins;
            }

            if (tType === 'WRITING' || titleLower.includes('write') || titleLower.includes('email') || titleLower.includes('journal') || titleLower.includes('form')) {
              autoWritingCount += 1;
            }
          }
        });
      });
    });

    return { autoListeningMins, autoSpeakingMins, autoWritingCount };
  };

  const autoMetrics = computeAutoMetrics();
  const totalListeningMinutes = (state.manualListeningMinutes || 0) + autoMetrics.autoListeningMins;
  const totalSpeakingMinutes = (state.manualSpeakingMinutes || 0) + autoMetrics.autoSpeakingMins;
  const totalWritingTasksCompleted = (state.manualWritingTasksCompleted || 0) + autoMetrics.autoWritingCount;

  const setMode = (mode: 'standard' | 'intensive') => setState((prev) => ({ ...prev, mode }));
  const setActiveView = (activeView: string) => setState((prev) => ({ ...prev, activeView }));
  const setTrackId = (currentTrackId: string) => setState((prev) => ({ ...prev, currentTrackId }));

  const toggleTask = (taskId: string, dayNumber: number) => {
    setState((prev) => {
      const nextTasks = { ...prev.completedTasks, [taskId]: !prev.completedTasks[taskId] };
      return { ...prev, completedTasks: nextTasks };
    });
  };

  const markDayComplete = (dayNumber: number) => {
    setState((prev) => {
      const current = prev.completedDays || [];
      const updated = current.includes(dayNumber)
        ? current.filter((d) => d !== dayNumber)
        : [...current, dayNumber];
      return { ...prev, completedDays: updated };
    });
  };

  const updateVocabStatus = (wordId: string, status: string) => {
    setState((prev) => ({
      ...prev,
      vocabStatus: { ...prev.vocabStatus, [wordId]: status }
    }));
  };

  const updateGrammarStatus = (moduleId: string, status: boolean) => {
    setState((prev) => ({
      ...prev,
      grammarStatus: { ...prev.grammarStatus, [moduleId]: status }
    }));
  };

  const toggleGrammarStatus = (moduleId: string) => {
    setState((prev) => ({
      ...prev,
      grammarStatus: { ...prev.grammarStatus, [moduleId]: !prev.grammarStatus[moduleId] }
    }));
  };

  const addWeakTopic = (topicTag: string) => {
    setState((prev) => {
      if (prev.weakTopics.includes(topicTag)) return prev;
      return { ...prev, weakTopics: [...prev.weakTopics, topicTag] };
    });
  };

  const removeWeakTopic = (topicTag: string) => {
    setState((prev) => ({
      ...prev,
      weakTopics: prev.weakTopics.filter((t) => t !== topicTag)
    }));
  };

  const addListeningMinutes = (mins: number) => {
    setState((prev) => ({ ...prev, manualListeningMinutes: (prev.manualListeningMinutes || 0) + mins }));
  };

  const addSpeakingMinutes = (mins: number) => {
    setState((prev) => ({ ...prev, manualSpeakingMinutes: (prev.manualSpeakingMinutes || 0) + mins }));
  };

  const incrementWritingTasks = () => {
    setState((prev) => ({ ...prev, manualWritingTasksCompleted: (prev.manualWritingTasksCompleted || 0) + 1 }));
  };

  const resetProgress = () => {
    if (window.confirm("Are you sure you want to reset all progress?")) {
      setState(defaultState);
    }
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        listeningMinutes: totalListeningMinutes,
        speakingMinutes: totalSpeakingMinutes,
        writingTasksCompleted: totalWritingTasksCompleted,
        autoMetrics,
        activeCurriculumData,
        setMode,
        setActiveView,
        setTrackId,
        toggleTask,
        markDayComplete,
        updateVocabStatus,
        updateGrammarStatus,
        toggleGrammarStatus,
        addWeakTopic,
        removeWeakTopic,
        addListeningMinutes,
        addSpeakingMinutes,
        incrementWritingTasks,
        resetProgress
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
