import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MISSIONS, getMissionsForLevel, getMissionsByTrack,
  type Mission, type MissionTrack, type MissionDialog
} from '../data/missions';
import { getYouTubeEmbedUrl } from '../data/contentRanking';
import {
  Trophy, Lock, Play, CheckCircle2, Clock, Globe,
  ChevronRight, ChevronDown, BookOpen, Volume2, PenLine,
  Star, Target, ArrowLeft, Mic
} from 'lucide-react';

const TRACK_CONFIG: Record<MissionTrack, { label: string; labelAR: string; color: string; bg: string; icon: string }> = {
  LIFE:   { label: 'Life in Germany',  labelAR: 'الحياة في ألمانيا',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: '🏠' },
  STUDY:  { label: 'University',       labelAR: 'الجامعة',             color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200',  icon: '🎓' },
  CAREER: { label: 'Career & Work',    labelAR: 'المهنة والعمل',      color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',    icon: '💼' },
};

const CEFR_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-800',
  A2: 'bg-blue-100 text-blue-800',
  B1: 'bg-amber-100 text-amber-800',
  B2: 'bg-violet-100 text-violet-800',
};

const TASK_ICONS: Record<string, React.ElementType> = {
  DIALOG: Volume2, FILL_IN: PenLine, TRANSLATE: Globe, LISTEN: Volume2, WRITE: BookOpen,
};

// ── Dialog Component ─────────────────────────────────────────────
const DialogLine: React.FC<{ line: MissionDialog; index: number }> = ({ line, index }) => {
  const [showAR, setShowAR] = useState(false);
  const isYou = line.speaker === 'YOU';

  return (
    <div
      className={`flex gap-3 animate-fadeIn ${isYou ? 'flex-row-reverse' : 'flex-row'}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 font-black ${
        isYou ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-700'
      }`}>
        {isYou ? 'Ich' : '👤'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] space-y-1 ${isYou ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-2.5 text-sm ${
          isYou
            ? 'bg-amber-500 text-white rounded-tr-sm'
            : 'bg-white border border-stone-200 text-stone-900 rounded-tl-sm shadow-xs'
        }`}>
          {line.german}
        </div>
        <button
          onClick={() => setShowAR(!showAR)}
          className="text-[10px] text-stone-400 hover:text-stone-600 transition-colors"
        >
          {showAR ? 'إخفاء الترجمة' : 'عرض الترجمة العربية'}
        </button>
        {showAR && (
          <div className="text-[11px] text-stone-600 bg-stone-50 rounded-lg px-3 py-1.5 border border-stone-100" dir="rtl">
            {line.arabic}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Mission Detail ────────────────────────────────────────────────
const MissionDetail: React.FC<{ mission: Mission; onBack: () => void }> = ({ mission, onBack }) => {
  const { completeMission, learnerModel } = useApp();
  const [activeTab, setActiveTab] = useState<'dialog' | 'vocab' | 'tasks'>('dialog');
  const [taskAnswers, setTaskAnswers] = useState<Record<string, string>>({});
  const [taskSubmitted, setTaskSubmitted] = useState<Record<string, boolean>>({});
  const isCompleted = learnerModel.completedMissions.includes(mission.id);

  const TABS = [
    { id: 'dialog' as const, label: 'Gespräch',    labelAR: 'الحوار',        icon: Volume2 },
    { id: 'vocab' as const,  label: 'Wortschatz',  labelAR: 'المفردات',      icon: BookOpen },
    { id: 'tasks' as const,  label: 'Aufgaben',    labelAR: 'التدريبات',     icon: PenLine },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Zurück
        </button>
        <div className="h-4 w-px bg-stone-200" />
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${CEFR_COLORS[mission.difficulty]}`}>
          {mission.difficulty}
        </span>
        <span className="text-[10px] text-stone-400">{mission.estimatedMinutes} min</span>
      </div>

      {/* Mission Card */}
      <div className="paper-card p-5">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{mission.icon}</div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-stone-900">{mission.title}</h2>
            <p className="text-xs text-stone-500 mt-0.5" dir="rtl">{mission.titleAR}</p>
            <p className="text-xs text-stone-600 mt-2">{mission.description}</p>
            <div className="flex items-center gap-2 mt-3">
              <Globe className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-[11px] text-stone-500">{mission.scenario}</span>
            </div>
          </div>
        </div>

        {/* Success Criteria */}
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <Target className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-black text-emerald-700 uppercase tracking-wide">Goal</p>
              <p className="text-xs text-emerald-800 mt-0.5">{mission.successCriteria}</p>
              <p className="text-[11px] text-emerald-700 mt-1" dir="rtl">{mission.successCriteriaAR}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Support Video */}
      {mission.videoId && (
        <div className="paper-card p-3">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider mb-2">Support Video</p>
          <div className="rounded-xl overflow-hidden bg-black aspect-video">
            <iframe
              src={getYouTubeEmbedUrl(mission.videoId)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title={mission.title}
            />
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'dialog' && (
        <div className="paper-card p-4 space-y-4">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
            Practice Dialog — Click bubbles to see Arabic translation
          </p>
          {mission.dialog.length > 0 ? (
            <div className="space-y-4">
              {mission.dialog.map((line, i) => (
                <DialogLine key={i} line={line} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-400 text-center py-4">This mission focuses on written tasks. See the Tasks tab.</p>
          )}
        </div>
      )}

      {activeTab === 'vocab' && (
        <div className="paper-card p-4 space-y-3">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
            Key Vocabulary — {mission.keyVocab.length} phrases
          </p>
          <div className="space-y-2">
            {mission.keyVocab.map((word, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] font-black text-amber-700">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-900">{word.german}</p>
                  <p className="text-xs text-stone-500" dir="rtl">{word.arabic}</p>
                  <p className="text-[11px] text-stone-400 italic mt-1 truncate">{word.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {mission.tasks.map((task, i) => {
            const Icon = TASK_ICONS[task.type] ?? PenLine;
            const submitted = taskSubmitted[task.id];
            return (
              <div key={task.id} className="paper-card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-stone-900">Task {i + 1}</p>
                    <p className="text-[10px] text-stone-400 uppercase">{task.type}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-stone-800">{task.prompt}</p>
                <p className="text-xs text-stone-500 mt-0.5" dir="rtl">{task.promptAR}</p>

                {/* Task content */}
                <div className="mt-3 bg-stone-50 border border-stone-200 rounded-xl p-3">
                  <p className="text-sm text-stone-700 whitespace-pre-line">{task.content}</p>
                </div>

                {/* Input for FILL_IN / TRANSLATE */}
                {(task.type === 'FILL_IN' || task.type === 'TRANSLATE') && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      placeholder="Your answer..."
                      value={taskAnswers[task.id] ?? ''}
                      onChange={e => setTaskAnswers(prev => ({ ...prev, [task.id]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 bg-white"
                      disabled={submitted}
                    />
                    {!submitted && (
                      <button
                        onClick={() => setTaskSubmitted(prev => ({ ...prev, [task.id]: true }))}
                        className="btn-amber text-xs px-4 py-2"
                      >
                        Check Answer
                      </button>
                    )}
                    {submitted && task.answer && (
                      <div className={`p-3 rounded-xl text-xs space-y-1 ${
                        taskAnswers[task.id]?.toLowerCase().trim() === task.answer.toLowerCase().trim()
                          ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                          : 'bg-stone-50 border border-stone-200 text-stone-700'
                      }`}>
                        <p className="font-bold">Correct answer: {task.answer}</p>
                        {task.explanationAR && <p dir="rtl">{task.explanationAR}</p>}
                        {task.explanation && <p>{task.explanation}</p>}
                      </div>
                    )}
                  </div>
                )}

                {/* Write tasks get textarea */}
                {task.type === 'WRITE' && (
                  <textarea
                    rows={5}
                    placeholder="Write your answer here in German..."
                    className="mt-3 w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 bg-white resize-none"
                  />
                )}

                {/* Arabic note */}
                {task.explanationAR && task.type === 'WRITE' && (
                  <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl p-2.5 text-[11px] text-amber-800" dir="rtl">
                    💡 {task.explanationAR}
                  </div>
                )}
              </div>
            );
          })}

          {/* Complete Mission Button */}
          <button
            onClick={() => completeMission(mission.id)}
            disabled={isCompleted}
            className={`w-full py-3 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                : 'bg-amber-500 hover:bg-amber-400 text-white shadow-md shadow-amber-200 active:scale-98'
            }`}
          >
            {isCompleted ? (
              <><CheckCircle2 className="w-4 h-4" /> Mission Completed! ✓</>
            ) : (
              <><Trophy className="w-4 h-4" /> Mark Mission as Complete</>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

// ── Mission Card ─────────────────────────────────────────────────
const MissionCard: React.FC<{ mission: Mission; locked: boolean; onSelect: () => void }> = ({ mission, locked, onSelect }) => {
  const { learnerModel } = useApp();
  const isCompleted = learnerModel.completedMissions.includes(mission.id);
  const trackCfg = TRACK_CONFIG[mission.track];

  return (
    <button
      onClick={locked ? undefined : onSelect}
      disabled={locked}
      className={`w-full text-left rounded-2xl border p-4 transition-all group ${
        locked
          ? 'opacity-50 cursor-not-allowed bg-stone-50 border-stone-200'
          : isCompleted
            ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400'
            : 'bg-white border-stone-200 hover:border-amber-300 hover:shadow-md active:scale-98'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{mission.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${CEFR_COLORS[mission.difficulty]}`}>
              {mission.difficulty}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${trackCfg.bg} ${trackCfg.color}`}>
              {trackCfg.icon} {trackCfg.label}
            </span>
            {isCompleted && (
              <span className="text-[10px] font-black text-emerald-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Done
              </span>
            )}
          </div>
          <h3 className="text-sm font-black text-stone-900 mt-1.5 leading-snug">{mission.title}</h3>
          <p className="text-[11px] text-stone-500 mt-0.5 leading-snug" dir="rtl">{mission.titleAR}</p>
          <p className="text-[11px] text-stone-400 mt-1.5 line-clamp-2">{mission.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[10px] text-stone-400">
              <Clock className="w-3 h-3" /> {mission.estimatedMinutes} min
            </span>
            <span className="flex items-center gap-1 text-[10px] text-stone-400">
              <BookOpen className="w-3 h-3" /> {mission.keyVocab.length} words
            </span>
          </div>
        </div>
        {locked ? (
          <Lock className="w-4 h-4 text-stone-300 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-stone-300 group-hover:text-amber-500 shrink-0 transition-colors" />
        )}
      </div>
    </button>
  );
};

// ── Main View ────────────────────────────────────────────────────
export const MissionsView: React.FC = () => {
  const { currentTrackId, learnerModel } = useApp();
  const [selectedMission, setSelectedMission] = useState<string | null>(null);
  const [trackFilter, setTrackFilter] = useState<MissionTrack | 'ALL'>('ALL');

  const level =
    currentTrackId === 'german-a2-ar' ? 'A2' :
    currentTrackId === 'german-b1-ar' ? 'B1' : 'A1';

  const available = getMissionsForLevel(level);
  const filtered = trackFilter === 'ALL'
    ? available
    : available.filter(m => m.track === trackFilter);

  const completedCount = learnerModel.completedMissions.filter(id =>
    available.some(m => m.id === id)
  ).length;

  if (selectedMission) {
    const mission = MISSIONS.find(m => m.id === selectedMission);
    if (!mission) return null;
    return <MissionDetail mission={mission} onBack={() => setSelectedMission(null)} />;
  }

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="paper-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">
              Real-World Missions · {level} Level
            </div>
            <h2 className="text-xl font-black text-stone-900">Sprach-Missionen</h2>
            <p className="text-xs text-stone-500 mt-1 max-w-md">
              Practice German in realistic scenarios. Each mission simulates real situations you will encounter in Germany.
            </p>
            <p className="text-[11px] text-stone-400 mt-0.5" dir="rtl">
              تدرب على الألمانية في سيناريوهات حياتية حقيقية ستواجهها في ألمانيا.
            </p>
          </div>
          {/* Progress */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center">
              <div className="text-2xl font-black text-amber-600">{completedCount}</div>
              <div className="text-[10px] text-stone-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-stone-900">{available.length}</div>
              <div className="text-[10px] text-stone-400">Available</div>
            </div>
            <div className="w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e7e5e4" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  strokeDasharray={`${available.length > 0 ? (completedCount / available.length) * 94 : 0} 94`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Track Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {([['ALL', 'All Missions', 'جميع المهام', '🗺️']] as const).concat(
          (['LIFE', 'STUDY', 'CAREER'] as MissionTrack[]).map(t => [
            t, TRACK_CONFIG[t].label, TRACK_CONFIG[t].labelAR, TRACK_CONFIG[t].icon
          ] as const)
        ).map(([id, label, labelAR, icon]) => (
          <button
            key={id}
            onClick={() => setTrackFilter(id as MissionTrack | 'ALL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 transition-all border ${
              trackFilter === id
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
            }`}
          >
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Mission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map(mission => {
          // Lock missions above current level
          const levelOrder = { A1: 0, A2: 1, B1: 2, B2: 3 };
          const locked = levelOrder[mission.difficulty] > levelOrder[level as keyof typeof levelOrder];
          return (
            <MissionCard
              key={mission.id}
              mission={mission}
              locked={locked}
              onSelect={() => setSelectedMission(mission.id)}
            />
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-stone-400">
          <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No missions for this filter. Try switching track.</p>
        </div>
      )}
    </div>
  );
};
