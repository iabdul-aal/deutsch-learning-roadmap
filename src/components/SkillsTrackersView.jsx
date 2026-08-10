import React from 'react';
import { useApp } from '../context/AppContext';
import { Mic, Headphones, PenTool, Zap, CheckCircle2 } from 'lucide-react';

export const SkillsTrackersView = () => {
  const { 
    listeningMinutes, addListeningMinutes, 
    speakingMinutes, addSpeakingMinutes, 
    writingTasksCompleted, incrementWritingTasks,
    autoMetrics 
  } = useApp();

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="paper-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
            SKILL TRACKING WORKBENCH
          </span>
          <h2 className="text-lg font-extrabold text-stone-900 mt-0.5 flex items-center gap-2">
            <span>Listening, Speaking & Writing Execution Metrics</span>
            <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-black text-[10px] uppercase flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" /> Auto-Tracked
            </span>
          </h2>
          <p className="text-xs text-stone-600">
            Real-time automatic metric tracking! As you check off daily schedule tasks in the 56-Day Roadmap, your listening, speaking, and writing totals update instantly.
          </p>
        </div>
      </div>

      {/* 3 Skill Tracker Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Listening Tracker */}
        <div className="paper-card p-6 space-y-4">
          <div className="flex items-center justify-between text-indigo-700 border-b border-stone-200 pb-3">
            <span className="text-xs font-black uppercase">Listening Immersion</span>
            <Headphones className="w-5 h-5" />
          </div>

          <div className="text-center space-y-1">
            <span className="text-4xl font-black text-stone-900">{listeningMinutes}</span>
            <span className="text-xs text-stone-500 block font-mono">Total Listening Minutes</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
               {autoMetrics?.autoListeningMins || 0} mins auto-tracked from schedule
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">Manual Extra Logs:</span>
            <button
              onClick={() => addListeningMinutes(20)}
              className="w-full py-2 rounded bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-bold text-xs"
            >
              +20 Minutes (Super Easy German)
            </button>
            <button
              onClick={() => addListeningMinutes(40)}
              className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
            >
              +40 Minutes (Hend / DW Nicos Weg)
            </button>
          </div>
        </div>

        {/* Speaking Tracker */}
        <div className="paper-card p-6 space-y-4">
          <div className="flex items-center justify-between text-emerald-700 border-b border-stone-200 pb-3">
            <span className="text-xs font-black uppercase">Speaking & Shadowing</span>
            <Mic className="w-5 h-5" />
          </div>

          <div className="text-center space-y-1">
            <span className="text-4xl font-black text-stone-900">{speakingMinutes}</span>
            <span className="text-xs text-stone-500 block font-mono">Total Speaking Minutes</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
               {autoMetrics?.autoSpeakingMins || 0} mins auto-tracked from schedule
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">Manual Extra Logs:</span>
            <button
              onClick={() => addSpeakingMinutes(15)}
              className="w-full py-2 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs"
            >
              +15 Minutes (Self-Recording Intro)
            </button>
            <button
              onClick={() => addSpeakingMinutes(30)}
              className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
            >
              +30 Minutes (Survival Roleplay)
            </button>
          </div>
        </div>

        {/* Writing Tracker */}
        <div className="paper-card p-6 space-y-4">
          <div className="flex items-center justify-between text-amber-700 border-b border-stone-200 pb-3">
            <span className="text-xs font-black uppercase">Writing Compositions</span>
            <PenTool className="w-5 h-5" />
          </div>

          <div className="text-center space-y-1">
            <span className="text-4xl font-black text-stone-900">{writingTasksCompleted}</span>
            <span className="text-xs text-stone-500 block font-mono">Tasks Completed</span>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
               {autoMetrics?.autoWritingCount || 0} tasks auto-tracked from schedule
            </span>
          </div>

          <div className="space-y-2 pt-2 border-t border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">Manual Extra Logs:</span>
            <button
              onClick={incrementWritingTasks}
              className="w-full py-2 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs"
            >
              +1 Completed Writing Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
