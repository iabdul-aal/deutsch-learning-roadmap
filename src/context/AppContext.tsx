import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { CURRICULUM_DATA } from '../data/tracks/german-a1-ar/curriculum';
import { CURRICULUM_DATA_A2 } from '../data/tracks/german-a2-ar/curriculum';
import { CURRICULUM_DATA_B1 } from '../data/tracks/german-b1-ar/curriculum';
import { safeStorage, generateId } from '../utils/storage';
import type {
  LearnerModel, SkillMastery, SkillKey, GoalProfile,
  NextAction, ErrorType, ErrorLogEntry, AssessmentResult, SRSCard
} from '../types/learner';
import {
  DEUniversityLT_SKILL_MASTERY, DEUniversityLT_SKILL_CEFR,
} from '../types/learner';
import {
  createLearnerModel, computeCEFREstimate, updateSkillMastery,
  computeNextActions, getSkillGaps,
} from '../engine/learnerModel';
import { createCard, reviewCard, getDeckStats, getDueCards, isDue } from '../engine/srs';
import type { ReviewQuality } from '../engine/srs';

// ── Legacy App State (preserved for backward compatibility) ──────
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
  selectedDayByTrack: Record<string, number>;
  userName: string;
  hasSeenWelcome: boolean;
}

export interface AutoMetrics {
  autoListeningMins: number;
  autoSpeakingMins: number;
  autoWritingCount: number;
}

// ── Extended Context Type ────────────────────────────────────────
export interface AppContextType extends AppState {
  // Legacy computed
  listeningMinutes: number;
  speakingMinutes: number;
  writingTasksCompleted: number;
  autoMetrics: AutoMetrics;
  activeCurriculumData: typeof CURRICULUM_DATA;
  selectedDay: number;
  totalTaskCount: number;

  // ── Learner Model ──
  learnerModel: LearnerModel;
  nextActions: NextAction[];
  srsStats: ReturnType<typeof getDeckStats>;
  dueCardCount: number;

  // ── Legacy setters ──
  setMode: (mode: 'standard' | 'intensive') => void;
  setActiveView: (view: string) => void;
  setTrackId: (trackId: string) => void;
  setSelectedDay: (day: number) => void;
  setUserName: (name: string) => void;
  setHasSeenWelcome: (seen: boolean) => void;
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
  makeTaskId: (trackId: string, dayNumber: number, taskIndex: number) => string;

  // ── Learner Model Actions ──
  updateSkillScore: (skill: SkillKey, score: number) => void;
  logError: (entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>) => void;
  markConceptMastered: (conceptId: string, score: number) => void;
  addSRSWord: (wordId: string) => void;
  reviewSRSCard: (wordId: string, quality: ReviewQuality) => void;
  setGoalProfile: (goal: GoalProfile) => void;
  addStudyMinutes: (skill: SkillKey, minutes: number) => void;
  completeMission: (missionId: string) => void;
  saveAssessmentResult: (result: AssessmentResult) => void;
  recalibrateCEFR: () => void;
}

// ── Default States ───────────────────────────────────────────────
const defaultGoal: GoalProfile = {
  track: 'LIFE_IN_GERMANY',
  targetCEFR: 'B1',
  weeklyHours: 7,
};

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
  streakDays: 0,
  selectedDayByTrack: { 'german-a1-ar': 1, 'german-a2-ar': 1, 'german-b1-ar': 1 },
  userName: '',
  hasSeenWelcome: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// ── Storage Keys ─────────────────────────────────────────────────
const STORAGE_KEY         = 'deutsch_survival_app_state_v4';
const STORAGE_KEY_LEARNER = 'deutsch_learner_model_v1';
const STORAGE_KEY_V3      = 'deutsch_survival_app_state_v3';
const STORAGE_KEY_V2      = 'deutsch_survival_app_state_v2';
const STORAGE_KEY_V1      = 'deutsch_survival_app_state_v1';

function migrateFromOldVersions(): Partial<AppState> {
  for (const oldKey of [STORAGE_KEY_V3, STORAGE_KEY_V2, STORAGE_KEY_V1]) {
    const old = safeStorage.getItem<Record<string, unknown>>(oldKey);
    if (old) {
      safeStorage.removeItem(oldKey);
      const { isTimerRunning, studyTimerSeconds, activeTimerTask, ...rest } = old;
      return rest as Partial<AppState>;
    }
  }
  return {};
}

function sanitizeForStorage(state: AppState): Partial<AppState> {
  return {
    mode: state.mode,
    currentTrackId: state.currentTrackId,
    completedTasks: state.completedTasks,
    completedDays: state.completedDays,
    vocabStatus: state.vocabStatus,
    grammarStatus: state.grammarStatus,
    weakTopics: state.weakTopics,
    manualListeningMinutes: state.manualListeningMinutes,
    manualSpeakingMinutes: state.manualSpeakingMinutes,
    manualWritingTasksCompleted: state.manualWritingTasksCompleted,
    streakDays: state.streakDays,
    selectedDayByTrack: state.selectedDayByTrack,
    userName: state.userName,
    hasSeenWelcome: state.hasSeenWelcome,
  };
}

export function makeTaskId(trackId: string, dayNumber: number, taskIndex: number): string {
  return `${trackId}::day-${dayNumber}-task-${taskIndex}`;
}

// ── Provider ─────────────────────────────────────────────────────
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Legacy state
  const [state, setState] = useState<AppState>(() => {
    const saved = safeStorage.getItem<AppState>(STORAGE_KEY);
    if (saved) return { ...defaultState, ...saved };
    const migrated = migrateFromOldVersions();
    return { ...defaultState, ...migrated };
  });

  // Learner model (separate storage for clean separation)
  const [learnerModel, setLearnerModel] = useState<LearnerModel>(() => {
    const saved = safeStorage.getItem<LearnerModel>(STORAGE_KEY_LEARNER);
    return saved ?? createLearnerModel(state.userName || 'Learner', defaultGoal);
  });

  // Reset confirmation state (replaces window.confirm)
  const [pendingReset, setPendingReset] = useState(false);

  // Persist legacy state - debounced to avoid excessive I/O
  useEffect(() => {
    const timeout = setTimeout(() => {
      safeStorage.setItem(STORAGE_KEY, sanitizeForStorage(state));
    }, 500);
    return () => clearTimeout(timeout);
  }, [state]);

  // Persist learner model - debounced
  useEffect(() => {
    const timeout = setTimeout(() => {
      safeStorage.setItem(STORAGE_KEY_LEARNER, learnerModel);
    }, 500);
    return () => clearTimeout(timeout);
  }, [learnerModel]);

  // Sync username between state and learnerModel
  useEffect(() => {
    if (state.userName && state.userName !== learnerModel.name) {
      setLearnerModel(prev => ({ ...prev, name: state.userName }));
    }
  }, [state.userName]);

  // ── Curriculum Helpers ──
  const getActiveCurriculumData = () => {
    if (state.currentTrackId === 'german-a2-ar') return CURRICULUM_DATA_A2 as unknown as typeof CURRICULUM_DATA;
    if (state.currentTrackId === 'german-b1-ar') return CURRICULUM_DATA_B1 as unknown as typeof CURRICULUM_DATA;
    return CURRICULUM_DATA;
  };
  const activeCurriculumData = getActiveCurriculumData();

  const computeTotalTaskCount = (): number => {
    let count = 0;
    activeCurriculumData?.weeks?.forEach((week: any) => {
      (week.days || []).forEach((day: any) => {
        const tasks = state.mode === 'intensive'
          ? [...(day.standardTasks || []), ...(day.intensiveTasks || [])]
          : (day.standardTasks || []);
        count += tasks.length;
      });
    });
    return count || 1;
  };
  const totalTaskCount = computeTotalTaskCount();

  const computeAutoMetrics = (): AutoMetrics => {
    let autoListeningMins = 0, autoSpeakingMins = 0, autoWritingCount = 0;
    if (!activeCurriculumData?.weeks) return { autoListeningMins, autoSpeakingMins, autoWritingCount };
    activeCurriculumData.weeks.forEach((week: any) => {
      (week.days || []).forEach((day: any) => {
        const allDayTasks = [...(day.standardTasks || []), ...(day.intensiveTasks || [])];
        allDayTasks.forEach((task: any, idx: number) => {
          const taskId = makeTaskId(state.currentTrackId, day.dayNumber, idx);
          if (state.completedTasks[taskId]) {
            const match = (task.duration || '').match(/(\d+)/);
            const durationMins = match ? parseInt(match[1], 10) : 20;
            const tType = (task.type || '').toUpperCase();
            const titleLower = (task.title || '').toLowerCase();
            if (tType === 'VIDEO' || tType === 'WATCH' || tType === 'LISTENING' || tType === 'LISTEN' || titleLower.includes('watch') || titleLower.includes('listen') || titleLower.includes('audio'))
              autoListeningMins += durationMins;
            if (tType === 'SPEAKING' || tType === 'SPEAK' || titleLower.includes('speak') || titleLower.includes('record') || titleLower.includes('shadow') || titleLower.includes('roleplay'))
              autoSpeakingMins += durationMins;
            if (tType === 'WRITING' || tType === 'WRITE' || titleLower.includes('write') || titleLower.includes('email') || titleLower.includes('journal'))
              autoWritingCount += 1;
          }
        });
      });
    });
    return { autoListeningMins, autoSpeakingMins, autoWritingCount };
  };
  const autoMetrics = computeAutoMetrics();
  const selectedDay = state.selectedDayByTrack?.[state.currentTrackId] ?? 1;
  const srsStats = getDeckStats(learnerModel.srsCards);
  const dueCards = getDueCards(learnerModel.srsCards);
  const nextActions = computeNextActions(learnerModel);

  // ── Legacy Actions ──────────────────────────────────────────────
  const setMode = (mode: 'standard' | 'intensive') => setState(prev => ({ ...prev, mode }));
  const setActiveView = (activeView: string) => setState(prev => ({ ...prev, activeView }));
  const setTrackId = (currentTrackId: string) => setState(prev => ({ ...prev, currentTrackId, activeView: 'dashboard' }));
  const setSelectedDay = (day: number) => setState(prev => ({
    ...prev, selectedDayByTrack: { ...(prev.selectedDayByTrack || {}), [prev.currentTrackId]: day }
  }));
  const setUserName = (userName: string) => setState(prev => ({ ...prev, userName }));
  const setHasSeenWelcome = (hasSeenWelcome: boolean) => setState(prev => ({ ...prev, hasSeenWelcome }));

  const toggleTask = (taskId: string, _dayNumber: number) =>
    setState(prev => ({ ...prev, completedTasks: { ...prev.completedTasks, [taskId]: !prev.completedTasks[taskId] } }));

  const markDayComplete = (dayNumber: number) => setState(prev => {
    const current = prev.completedDays || [];
    const updated = current.includes(dayNumber) ? current.filter(d => d !== dayNumber) : [...current, dayNumber];
    return { ...prev, completedDays: updated };
  });

  const updateVocabStatus = (wordId: string, status: string) =>
    setState(prev => ({ ...prev, vocabStatus: { ...prev.vocabStatus, [wordId]: status } }));

  const updateGrammarStatus = (moduleId: string, status: boolean) =>
    setState(prev => ({ ...prev, grammarStatus: { ...prev.grammarStatus, [moduleId]: status } }));

  const toggleGrammarStatus = (moduleId: string) =>
    setState(prev => ({ ...prev, grammarStatus: { ...prev.grammarStatus, [moduleId]: !prev.grammarStatus[moduleId] } }));

  const addWeakTopic = (topicTag: string) =>
    setState(prev => prev.weakTopics.includes(topicTag) ? prev : { ...prev, weakTopics: [...prev.weakTopics, topicTag] });

  const removeWeakTopic = (topicTag: string) =>
    setState(prev => ({ ...prev, weakTopics: prev.weakTopics.filter(t => t !== topicTag) }));

  const addListeningMinutes = (mins: number) =>
    setState(prev => ({ ...prev, manualListeningMinutes: (prev.manualListeningMinutes || 0) + mins }));

  const addSpeakingMinutes = (mins: number) =>
    setState(prev => ({ ...prev, manualSpeakingMinutes: (prev.manualSpeakingMinutes || 0) + mins }));

  const incrementWritingTasks = () =>
    setState(prev => ({ ...prev, manualWritingTasksCompleted: (prev.manualWritingTasksCompleted || 0) + 1 }));

  const resetProgress = () => {
    // Use state-based confirmation instead of window.confirm (which blocks the main thread
    // and is overridden/blocked in some browsers and WebViews)
    setPendingReset(true);
  };

  const confirmReset = () => {
    setState({ ...defaultState, userName: state.userName, hasSeenWelcome: state.hasSeenWelcome });
    setLearnerModel(createLearnerModel(state.userName || 'Learner', defaultGoal));
    setPendingReset(false);
  };

  const cancelReset = () => setPendingReset(false);

  // ── Learner Model Actions ────────────────────────────────────────
  const updateSkillScore = useCallback((skill: SkillKey, score: number) => {
    setLearnerModel(prev => {
      const newMastery: SkillMastery = {
        ...prev.skillMastery,
        [skill]: updateSkillMastery(prev.skillMastery[skill], score),
      };
      const cefrEstimate = computeCEFREstimate(newMastery);
      return {
        ...prev,
        skillMastery: newMastery,
        cefrEstimate,
        lastActiveAt: new Date().toISOString(),
      };
    });
  }, []);

  const logError = useCallback((entry: Omit<ErrorLogEntry, 'id' | 'timestamp'>) => {
    setLearnerModel(prev => {
      const newEntry: ErrorLogEntry = {
        ...entry,
        id: generateId(),
        timestamp: new Date().toISOString(),
      };
      const freq = { ...prev.errorFrequency };
      freq[entry.errorType] = (freq[entry.errorType] ?? 0) + 1;
      const weakConcepts = entry.conceptId && !prev.weakConcepts.includes(entry.conceptId)
        ? [...prev.weakConcepts, entry.conceptId]
        : prev.weakConcepts;
      return {
        ...prev,
        errorLog: [newEntry, ...prev.errorLog].slice(0, 500), // keep last 500
        errorFrequency: freq,
        weakConcepts,
      };
    });
  }, []);

  const markConceptMastered = useCallback((conceptId: string, score: number) => {
    setLearnerModel(prev => ({
      ...prev,
      conceptMastery: { ...prev.conceptMastery, [conceptId]: score },
      weakConcepts: score >= 70
        ? prev.weakConcepts.filter(id => id !== conceptId)
        : [...new Set([...prev.weakConcepts, conceptId])],
    }));
  }, []);

  const addSRSWord = useCallback((wordId: string) => {
    setLearnerModel(prev => {
      if (prev.srsCards[wordId]) return prev; // already exists
      return {
        ...prev,
        srsCards: { ...prev.srsCards, [wordId]: createCard(wordId) },
      };
    });
  }, []);

  const reviewSRSCard = useCallback((wordId: string, quality: ReviewQuality) => {
    setLearnerModel(prev => {
      const card = prev.srsCards[wordId];
      if (!card) return prev;
      const updated = reviewCard(card, quality);
      const wasNew = card.state === 'NEW';
      return {
        ...prev,
        srsCards: { ...prev.srsCards, [wordId]: updated },
        totalWordsLearned: wasNew ? prev.totalWordsLearned + 1 : prev.totalWordsLearned,
        activeVocabularySize: Object.values({ ...prev.srsCards, [wordId]: updated })
          .filter(c => c.state === 'MATURE' || c.state === 'REVIEW').length,
      };
    });
  }, []);

  const setGoalProfile = useCallback((goalProfile: GoalProfile) => {
    setLearnerModel(prev => ({ ...prev, goalProfile }));
  }, []);

  const addStudyMinutes = useCallback((skill: SkillKey, minutes: number) => {
    setLearnerModel(prev => ({
      ...prev,
      totalStudyMinutes: prev.totalStudyMinutes + minutes,
      studyMinutesBySkill: {
        ...prev.studyMinutesBySkill,
        [skill]: (prev.studyMinutesBySkill[skill] ?? 0) + minutes,
      },
      lastStudyDate: new Date().toISOString().split('T')[0],
      lastActiveAt: new Date().toISOString(),
    }));
  }, []);

  const completeMission = useCallback((missionId: string) => {
    setLearnerModel(prev => ({
      ...prev,
      completedMissions: [...new Set([...prev.completedMissions, missionId])],
      activeMissionId: prev.activeMissionId === missionId ? undefined : prev.activeMissionId,
    }));
  }, []);

  const saveAssessmentResult = useCallback((result: AssessmentResult) => {
    setLearnerModel(prev => ({
      ...prev,
      assessmentHistory: [result, ...prev.assessmentHistory].slice(0, 100),
    }));
  }, []);

  const recalibrateCEFR = useCallback(() => {
    setLearnerModel(prev => ({
      ...prev,
      cefrEstimate: computeCEFREstimate(prev.skillMastery),
    }));
  }, []);

  return (
    <AppContext.Provider value={{
      // Legacy state
      ...state,
      listeningMinutes: (state.manualListeningMinutes || 0) + autoMetrics.autoListeningMins,
      speakingMinutes: (state.manualSpeakingMinutes || 0) + autoMetrics.autoSpeakingMins,
      writingTasksCompleted: (state.manualWritingTasksCompleted || 0) + autoMetrics.autoWritingCount,
      autoMetrics,
      activeCurriculumData,
      selectedDay,
      totalTaskCount,
      // Learner model
      learnerModel,
      nextActions,
      srsStats,
      dueCardCount: dueCards.filter(c => c.state !== 'NEW').length,
      // Legacy setters
      setMode,
      setActiveView,
      setTrackId,
      setSelectedDay,
      setUserName,
      setHasSeenWelcome,
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
      resetProgress,
      makeTaskId,
      // Learner model actions
      updateSkillScore,
      logError,
      markConceptMastered,
      addSRSWord,
      reviewSRSCard,
      setGoalProfile,
      addStudyMinutes,
      completeMission,
      saveAssessmentResult,
      recalibrateCEFR,
    }}>
      {children}

      {/* In-app reset confirmation - replaces window.confirm() */}
      {pendingReset && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          onClick={cancelReset}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 m-4 max-w-sm w-full space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 id="reset-dialog-title" className="text-lg font-black text-stone-900">
              Reset All Progress?
            </h2>
            <p className="text-sm text-stone-600">
              This will clear all completed tasks, SRS cards, mastery scores, and streaks.
              <strong className="text-rose-700"> This cannot be undone.</strong>
            </p>
            <p className="text-sm text-stone-500" dir="rtl">
              هل أنت متأكد؟ سيتم حذف جميع تقدمك في التعلم.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={cancelReset}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
