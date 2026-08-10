import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRICULUM_DATA } from '../data/tracks/german-a1-ar/curriculum';

const AppContext = createContext();

const STORAGE_KEY = 'deutsch_survival_app_state_v1';

const defaultState = {
  mode: 'standard', // 'standard' (~3h) | 'intensive' (~5h)
  activeView: 'dashboard',
  completedTasks: {},
  completedDays: [],
  vocabStatus: {},
  grammarStatus: {},
  weakTopics: [],
  manualListeningMinutes: 0,
  manualSpeakingMinutes: 0,
  manualWritingTasksCompleted: 0,
  streakDays: 5,
  studyTimerSeconds: 1500, // 25 min default
  isTimerRunning: false,
  activeTimerTask: 'Daily German Study Session'
};

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => {
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

  // Automatic Metric Tracking Engine: Computes real-time totals from completed schedule tasks
  const computeAutoMetrics = () => {
    let autoListeningMins = 0;
    let autoSpeakingMins = 0;
    let autoWritingCount = 0;

    if (!CURRICULUM_DATA?.weeks) {
      return { autoListeningMins, autoSpeakingMins, autoWritingCount };
    }

    CURRICULUM_DATA.weeks.forEach((week) => {
      (week.days || []).forEach((day) => {
        const allDayTasks = [...(day.standardTasks || []), ...(day.intensiveTasks || [])];
        allDayTasks.forEach((task, idx) => {
          const taskId = `day-${day.dayNumber}-task-${idx}`;
          if (state.completedTasks[taskId]) {
            // Parse duration integer from string (e.g. "35 min" -> 35)
            const match = (task.duration || '').match(/(\d+)/);
            const durationMins = match ? parseInt(match[1], 10) : 20;

            const tType = (task.type || '').toUpperCase();
            const titleLower = (task.title || '').toLowerCase();

            // Listening classification
            if (tType === 'VIDEO' || tType === 'LISTENING' || titleLower.includes('watch') || titleLower.includes('listen') || titleLower.includes('audio')) {
              autoListeningMins += durationMins;
            }

            // Speaking classification
            if (tType === 'SPEAKING' || titleLower.includes('speak') || titleLower.includes('record') || titleLower.includes('shadow') || titleLower.includes('roleplay')) {
              autoSpeakingMins += durationMins;
            }

            // Writing classification
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

  // Actions
  const setMode = (mode) => setState((prev) => ({ ...prev, mode }));
  const setActiveView = (activeView) => setState((prev) => ({ ...prev, activeView }));

  const toggleTask = (taskId, dayNumber) => {
    setState((prev) => {
      const nextTasks = { ...prev.completedTasks, [taskId]: !prev.completedTasks[taskId] };
      return { ...prev, completedTasks: nextTasks };
    });
  };

  const markDayComplete = (dayNumber) => {
    setState((prev) => {
      const current = prev.completedDays || [];
      const updated = current.includes(dayNumber)
        ? current.filter((d) => d !== dayNumber)
        : [...current, dayNumber];
      return { ...prev, completedDays: updated };
    });
  };

  const updateVocabStatus = (wordId, status) => {
    setState((prev) => ({
      ...prev,
      vocabStatus: { ...prev.vocabStatus, [wordId]: status }
    }));
  };

  const updateGrammarStatus = (moduleId, status) => {
    setState((prev) => ({
      ...prev,
      grammarStatus: { ...prev.grammarStatus, [moduleId]: status }
    }));
  };

  const toggleGrammarStatus = (moduleId) => {
    setState((prev) => ({
      ...prev,
      grammarStatus: { ...prev.grammarStatus, [moduleId]: !prev.grammarStatus[moduleId] }
    }));
  };

  const addWeakTopic = (topicTag) => {
    setState((prev) => {
      if (prev.weakTopics.includes(topicTag)) return prev;
      return { ...prev, weakTopics: [...prev.weakTopics, topicTag] };
    });
  };

  const removeWeakTopic = (topicTag) => {
    setState((prev) => ({
      ...prev,
      weakTopics: prev.weakTopics.filter((t) => t !== topicTag)
    }));
  };

  const addListeningMinutes = (mins) => {
    setState((prev) => ({ ...prev, manualListeningMinutes: (prev.manualListeningMinutes || 0) + mins }));
  };

  const addSpeakingMinutes = (mins) => {
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
        setMode,
        setActiveView,
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

export const useApp = () => useContext(AppContext);
