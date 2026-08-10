import React from 'react';
import { useApp } from '../context/AppContext';
import { CURRICULUM_DATA } from '../data/tracks/german-a1-ar/curriculum';
import { 
  Play, CheckCircle2, Circle, Compass, 
  AlertTriangle, ExternalLink, PenTool, BookOpen 
} from 'lucide-react';

export const TodayDashboard: React.FC = () => {
  const { 
    mode, setActiveView, completedTasks, toggleTask, 
    weakTopics 
  } = useApp();

  const currentDayNumber = 17; // Week 3 Day 17
  const currentWeekNumber = 3;

  let todayData: any = null;
  if (CURRICULUM_DATA && CURRICULUM_DATA.weeks) {
    CURRICULUM_DATA.weeks.forEach((w) => {
      if (w.days) {
        w.days.forEach((d) => {
          if (d.dayNumber === currentDayNumber) todayData = d;
        });
      }
    });
  }

  if (!todayData && CURRICULUM_DATA?.weeks?.[0]?.days?.[0]) {
    todayData = CURRICULUM_DATA.weeks[0].days[0];
  }

  const tasksList = mode === 'intensive' 
    ? [...(todayData?.standardTasks || []), ...(todayData?.intensiveTasks || [])]
    : (todayData?.standardTasks || []);

  const completedTodayCount = tasksList.filter((_, idx) => completedTasks[`day-${currentDayNumber}-task-${idx}`]).length;
  const todayProgressPercent = Math.round((completedTodayCount / (tasksList.length || 1)) * 100);

  const nextTaskIndex = tasksList.findIndex((_, idx) => !completedTasks[`day-${currentDayNumber}-task-${idx}`]);
  const nextTask = nextTaskIndex !== -1 ? tasksList[nextTaskIndex] : null;

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Command Center Status Banner - Optimized for Xiaomi Note 10S (393px) */}
      <div className="paper-card p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2 w-full min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-[11px] font-black uppercase whitespace-nowrap">
              Day {currentDayNumber} of 56 | Week {currentWeekNumber}
            </span>
            <span className="text-stone-500 text-[11px] font-mono">Mode: {mode === 'intensive' ? 'Intensive (~5h/d)' : 'Standard (~3h/d)'}</span>
          </div>

          <h1 className="text-lg sm:text-2xl font-extrabold text-stone-900 leading-tight">
            Daily Study Command Center
          </h1>
          
          <p className="text-xs text-stone-600 max-w-2xl leading-normal">
            Target Focus: <strong className="text-amber-800">{todayData?.title}</strong> - {todayData?.objective}
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto shrink-0">
          <button
            onClick={() => setActiveView('curriculum')}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-sm active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-stone-950" />
            <span>{nextTask ? "Continue Learning" : "Review Tasks"}</span>
          </button>
        </div>
      </div>

      {/* Weak Topics Alert Banner */}
      {weakTopics.length > 0 && (
        <div className="p-4 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <span className="font-extrabold text-amber-950 block">Targeted Review Queue</span>
              <span className="text-stone-700">Flagged weak topics requiring review: {weakTopics.join(', ')}.</span>
            </div>
          </div>
          <button
            onClick={() => setActiveView('grammar')}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded bg-amber-600 text-white font-extrabold text-xs shrink-0 hover:bg-amber-700"
          >
            Review Weak Topics Now
          </button>
        </div>
      )}

      {/* Task Execution Table */}
      <div className="paper-card p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-200 pb-3 gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 uppercase tracking-wider">
              Today's Actionable Schedule (Day {currentDayNumber})
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Check off tasks as you complete them to record progress in your local study state.
            </p>
          </div>
          <span className="px-3 py-1 rounded bg-stone-100 text-amber-900 text-xs font-mono font-bold border border-stone-300 shrink-0">
            {completedTodayCount} / {tasksList.length} Tasks ({todayProgressPercent}%)
          </span>
        </div>

        {/* Actionable Tasks List */}
        <div className="space-y-2">
          {tasksList.map((task: any, idx: number) => {
            const taskId = `day-${currentDayNumber}-task-${idx}`;
            const isDone = Boolean(completedTasks[taskId]);

            return (
              <div
                key={taskId}
                onClick={() => toggleTask(taskId, currentDayNumber)}
                className={`p-3 sm:p-3.5 rounded border flex items-start gap-3 transition-all cursor-pointer ${
                  isDone 
                    ? 'bg-stone-50 border-stone-200 opacity-60' 
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                <button className="mt-0.5 shrink-0 min-h-[24px] min-w-[24px] flex items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-400" />
                  )}
                </button>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-[10px]">
                    <span className={`px-2 py-0.5 rounded font-black uppercase ${
                      task.resourceType === 'PRIMARY' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      task.resourceType === 'SECONDARY' ? 'bg-indigo-100 text-indigo-900 border border-indigo-300' :
                      'bg-stone-100 text-stone-700'
                    }`}>
                      {task.type} {task.resourceType ? `| ${task.resourceType}` : ''}
                    </span>
                    {task.duration && <span className="text-stone-500 font-mono">Duration: {task.duration}</span>}
                  </div>
                  <h4 className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                    {task.title}
                  </h4>
                </div>

                {task.link && (
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-2.5 py-1 rounded bg-stone-100 hover:bg-amber-500 hover:text-stone-950 text-amber-900 text-[11px] font-bold border border-stone-300 transition-all shrink-0 flex items-center gap-1 min-h-[32px]"
                  >
                    <span>Link</span> <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modular Workbench Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveView('survival')}
          className="paper-interactive p-4 sm:p-5 cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-indigo-700">
            <span className="text-xs font-extrabold uppercase">Germany Survival Workbench</span>
            <Compass className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-stone-900">7 Real-World Practical Domains</h4>
          <p className="text-xs text-stone-600">Airport Arrival, University Registration, Landlords, DB Trains & Emergency 112.</p>
        </div>

        <div 
          onClick={() => setActiveView('vocabulary')}
          className="paper-interactive p-4 sm:p-5 cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-extrabold uppercase">Vocabulary Flashcards</span>
            <BookOpen className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-stone-900">500+ A1 Core Words & Articles</h4>
          <p className="text-xs text-stone-600">Color-coded articles (Der = Blue, Die = Red, Das = Green) with audio TTS.</p>
        </div>

        <div 
          onClick={() => setActiveView('grammar')}
          className="paper-interactive p-4 sm:p-5 cursor-pointer space-y-2 group"
        >
          <div className="flex items-center justify-between text-amber-700">
            <span className="text-xs font-extrabold uppercase">18 Grammar Modules</span>
            <PenTool className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <h4 className="text-sm font-bold text-stone-900">Interactive Rules & Quizzes</h4>
          <p className="text-xs text-stone-600">Sentence V2, Accusative, Dative, Modal verbs, Separable verbs & Perfekt.</p>
        </div>
      </div>
    </div>
  );
};
