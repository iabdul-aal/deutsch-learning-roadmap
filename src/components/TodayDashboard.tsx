import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, CheckCircle2, Circle, Compass, 
  AlertTriangle, ExternalLink, PenTool, BookOpen, Flame, Sparkles, ArrowRight
} from 'lucide-react';
import { PomodoroTimerModal } from './PomodoroTimerModal';

export const TodayDashboard: React.FC = () => {
  const { 
    mode, setActiveView, completedTasks, toggleTask, 
    weakTopics, activeCurriculumData 
  } = useApp();

  const [selectedDayNum, setSelectedDayNum] = useState<number>(1);
  const [pomodoroOpen, setPomodoroOpen] = useState<boolean>(false);

  const weeksList = activeCurriculumData?.weeks || [];
  const allDaysList = weeksList.flatMap((w: any) => w.days || []);

  const currentDayData = allDaysList.find((d: any) => d.dayNumber === selectedDayNum) || allDaysList[0] || {
    dayNumber: 1,
    weekNumber: 1,
    title: "Introduction to German Learning Path",
    objective: "Establish basic daily routine and core phonetic rules.",
    standardTasks: []
  };

  const tasksList = mode === 'intensive' 
    ? [...(currentDayData?.standardTasks || []), ...(currentDayData?.intensiveTasks || [])]
    : (currentDayData?.standardTasks || []);

  const completedTodayCount = tasksList.filter((_: any, idx: number) => completedTasks[`day-${currentDayData.dayNumber}-task-${idx}`]).length;
  const todayProgressPercent = Math.round((completedTodayCount / (tasksList.length || 1)) * 100);

  const nextTaskIndex = tasksList.findIndex((_: any, idx: number) => !completedTasks[`day-${currentDayData.dayNumber}-task-${idx}`]);
  const nextTask = nextTaskIndex !== -1 ? tasksList[nextTaskIndex] : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Friendly Hero Study Hub Header */}
      <div className="paper-card p-5 sm:p-6 space-y-4 bg-gradient-to-r from-amber-50/60 via-white to-stone-50">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2 w-full min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-black text-xs uppercase tracking-wider shadow-2xs">
                Day {currentDayData.dayNumber} of {allDaysList.length || 56}
              </span>
              <span className="text-stone-500 text-xs font-mono font-bold">
                Week {currentDayData.weekNumber || 1}  •  Pace: {mode === 'intensive' ? 'Intensive (~5h/d)' : 'Standard (~3h/d)'}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl font-black text-stone-900 leading-tight">
              Daily Study Hub
            </h1>
            
            <p className="text-xs sm:text-sm text-stone-700 max-w-2xl leading-relaxed">
              Today's Goal: <strong className="text-amber-900 font-extrabold">{currentDayData?.title}</strong> — {currentDayData?.objective}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="w-full md:w-auto shrink-0 flex flex-wrap sm:flex-nowrap items-center gap-2">
            <button
              onClick={() => setPomodoroOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-stone-900 hover:bg-amber-600 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-xs min-h-[42px]"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Pomodoro Timer</span>
            </button>

            <button
              onClick={() => setActiveView('curriculum')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-xs min-h-[42px] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>{nextTask ? "Start Lesson" : "View Full Roadmap"}</span>
            </button>
          </div>
        </div>

        {/* Easy Day Switcher */}
        <div className="pt-3 border-t border-stone-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-600">
            <span>Pick Any Day to Study:</span>
            <span className="font-mono text-amber-900">Day {selectedDayNum} / {allDaysList.length || 56}</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {allDaysList.map((d: any) => {
              const isSelected = d.dayNumber === selectedDayNum;
              return (
                <button
                  key={d.dayNumber}
                  onClick={() => setSelectedDayNum(d.dayNumber)}
                  className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs shrink-0 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                  }`}
                >
                  Day {d.dayNumber}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weak Topics Alert Banner */}
      {weakTopics.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-extrabold text-amber-950 block">Targeted Review Recommendation</span>
              <span className="text-stone-700">Flagged topics needing practice: {weakTopics.join(', ')}.</span>
            </div>
          </div>
          <button
            onClick={() => setActiveView('grammar')}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-600 text-white font-extrabold text-xs shrink-0 hover:bg-amber-700 shadow-2xs"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Today's Step-by-Step Lesson Plan */}
      <div className="paper-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-200 pb-3 gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-black text-stone-900">
              Today's Step-by-Step Schedule (Day {currentDayData.dayNumber})
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Click off items as you complete them to automatically track your daily progress.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-mono font-black border border-amber-300 shrink-0">
            {completedTodayCount} / {tasksList.length} Completed ({todayProgressPercent}%)
          </span>
        </div>

        {/* Actionable Step Cards */}
        <div className="space-y-2.5">
          {tasksList.map((task: any, idx: number) => {
            const taskId = `day-${currentDayData.dayNumber}-task-${idx}`;
            const isDone = Boolean(completedTasks[taskId]);

            return (
              <div
                key={taskId}
                onClick={() => toggleTask(taskId, currentDayData.dayNumber)}
                className={`p-3.5 sm:p-4 rounded-xl border flex items-start gap-3.5 transition-all cursor-pointer ${
                  isDone 
                    ? 'bg-stone-50 border-stone-200 opacity-60' 
                    : 'bg-white hover:bg-amber-50/40 border-stone-200 shadow-2xs'
                }`}
              >
                <button className="mt-0.5 shrink-0 min-h-[24px] min-w-[24px] flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-400" />
                  )}
                </button>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className={`px-2.5 py-0.5 rounded font-black uppercase tracking-wider ${
                      task.resourceType === 'PRIMARY' ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                      task.resourceType === 'SECONDARY' ? 'bg-indigo-100 text-indigo-950 border border-indigo-300' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      Step {idx + 1}: {task.type}
                    </span>
                    {task.duration && <span className="text-stone-500 font-mono font-bold">⏱️ {task.duration}</span>}
                  </div>
                  <h4 className={`text-xs sm:text-sm font-bold leading-snug ${isDone ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                    {task.title}
                  </h4>
                </div>

                {task.link && (
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-500 hover:text-stone-950 text-stone-800 text-xs font-extrabold border border-stone-300 transition-all shrink-0 flex items-center gap-1 min-h-[36px]"
                  >
                    <span>Open</span> <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Launch Learning Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveView('survival')}
          className="paper-interactive p-5 cursor-pointer space-y-2 group rounded-xl"
        >
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-black uppercase tracking-wider">Germany Survival Guide</span>
            <Compass className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-black text-stone-900">Real-World Scenarios</h4>
          <p className="text-xs text-stone-600">Airport, University, Landlords, DB Trains & Emergency phrases.</p>
        </div>

        <div 
          onClick={() => setActiveView('vocabulary')}
          className="paper-interactive p-5 cursor-pointer space-y-2 group rounded-xl"
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-black uppercase tracking-wider">Smart Word Cards</span>
            <BookOpen className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-black text-stone-900">Vocabulary Flashcards</h4>
          <p className="text-xs text-stone-600">Color-coded articles (Der = Blue, Die = Red, Das = Green) + audio.</p>
        </div>

        <div 
          onClick={() => setActiveView('grammar')}
          className="paper-interactive p-5 cursor-pointer space-y-2 group rounded-xl"
        >
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-black uppercase tracking-wider">Grammar Made Simple</span>
            <PenTool className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <h4 className="text-sm font-black text-stone-900">Rules & Practice Quizzes</h4>
          <p className="text-xs text-stone-600">Sentence structure formulas, explanations, and automated weak topic tagging.</p>
        </div>
      </div>

      {/* Pomodoro Timer Modal */}
      {pomodoroOpen && (
        <PomodoroTimerModal onClose={() => setPomodoroOpen(false)} />
      )}
    </div>
  );
};
