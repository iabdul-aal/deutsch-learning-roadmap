import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CURRICULUM_DATA } from '../data/tracks/german-a1-ar/curriculum';
import { 
  Calendar, ChevronRight, CheckCircle2, Circle, 
  Search 
} from 'lucide-react';

export const CurriculumView = () => {
  const { mode, completedTasks, toggleTask, markDayComplete, completedDays } = useApp();
  const [selectedWeekNum, setSelectedWeekNum] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const activeWeek = (CURRICULUM_DATA?.weeks || []).find((w) => w.weekNumber === selectedWeekNum) || CURRICULUM_DATA?.weeks?.[0];

  const filteredDays = (activeWeek?.days || []).filter((day) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return day.title.toLowerCase().includes(q) || day.objective.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Filter Bar */}
      <div className="paper-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-stone-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-700" />
            <span>56-Day Master Curriculum Matrix</span>
          </h2>
          <p className="text-xs text-stone-600 mt-0.5">
            Primary Backbone: <strong className="text-amber-800">Deutsch mit Hend (Arabic)</strong>  |  Exam Alignment: <strong className="text-stone-900">Goethe-Zertifikat A1 & FAU Erlangen</strong>.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search curriculum days..."
            className="w-full pl-9 pr-3 py-1.5 rounded bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* 2-Column Split-Pane Composition */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Navigation Sidebar: 8 Weeks */}
        <div className="md:col-span-4 space-y-2">
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-1">
            Select Week (1 to 8)
          </div>

          <div className="space-y-2">
            {(CURRICULUM_DATA?.weeks || []).map((week) => {
              const isSelected = selectedWeekNum === week.weekNumber;

              return (
                <button
                  key={week.weekNumber}
                  onClick={() => setSelectedWeekNum(week.weekNumber)}
                  className={`w-full flex items-center justify-between p-3.5 rounded border text-left text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 border-amber-500 font-extrabold shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-extrabold text-stone-500 block">
                      WEEK {week.weekNumber}
                    </span>
                    <span className="text-xs line-clamp-1">{week.title}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isSelected ? 'text-stone-950' : 'text-stone-400'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Content Pane: 7 Days Matrix */}
        <div className="md:col-span-8 space-y-4">
          <div className="paper-card p-4 space-y-1">
            <span className="text-[10px] font-extrabold text-amber-700 uppercase">WEEK {activeWeek?.weekNumber} OVERVIEW</span>
            <h3 className="text-base font-extrabold text-stone-900">{activeWeek?.title}</h3>
            <p className="text-xs text-stone-600">{activeWeek?.objective}</p>
          </div>

          {/* Days Accordion Cards */}
          <div className="space-y-4">
            {filteredDays.map((day) => {
              const isDayDone = Boolean(completedDays?.includes(day.dayNumber));
              const dayTasks = mode === 'intensive'
                ? [...(day.standardTasks || []), ...(day.intensiveTasks || [])]
                : (day.standardTasks || []);

              return (
                <div key={day.dayNumber} className="paper-card p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-stone-500 uppercase">
                        DAY {day.dayNumber} OF 56  |  {day.focusSkill}
                      </span>
                      <h4 className="text-sm font-extrabold text-stone-900">{day.title}</h4>
                      <p className="text-xs text-stone-600">{day.objective}</p>
                    </div>

                    <button
                      onClick={() => markDayComplete(day.dayNumber)}
                      className={`px-3 py-1.5 rounded font-extrabold text-xs border transition-all shrink-0 flex items-center gap-1 ${
                        isDayDone
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                          : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isDayDone ? 'Day Complete [Done]' : 'Mark Complete'}</span>
                    </button>
                  </div>

                  {/* Tasks Sub-List */}
                  <div className="space-y-1.5">
                    {dayTasks.map((t, tIdx) => {
                      const taskId = `day-${day.dayNumber}-task-${tIdx}`;
                      const isDone = Boolean(completedTasks[taskId]);

                      return (
                        <div
                          key={tIdx}
                          onClick={() => toggleTask(taskId, day.dayNumber)}
                          className={`p-2.5 rounded border text-xs flex items-center justify-between cursor-pointer transition-all ${
                            isDone ? 'bg-stone-50 opacity-60' : 'bg-white hover:bg-stone-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Circle className="w-4 h-4 text-stone-400" />}
                            <span className={isDone ? 'line-through text-stone-400' : 'text-stone-800'}>{t.title}</span>
                          </div>
                          {t.duration && <span className="text-[11px] font-mono text-stone-500 shrink-0">{t.duration}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
