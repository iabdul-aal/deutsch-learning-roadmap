import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CONTENT_DB, rankContent, ContentSource, SkillType,
} from '../data/contentRanking';
import {
  MapPin, CheckCircle2, Circle, ChevronRight, ChevronDown,
  Play, BookOpen, Mic, PenLine, Brain, Headphones, Layers,
  Clock, Zap, Star, Lock, Trophy,
} from 'lucide-react';

// ── Task type → visual config ─────────────────────────────────────
const TASK_META: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  Watch:          { icon: Play,       color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',    label: 'Watch' },
  Listen:         { icon: Headphones, color: 'text-violet-700',  bg: 'bg-violet-50 border-violet-200', label: 'Listen' },
  Speak:          { icon: Mic,        color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', label: 'Speak' },
  Memorize:       { icon: Brain,      color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',  label: 'Memorize' },
  Read:           { icon: BookOpen,   color: 'text-stone-700',   bg: 'bg-stone-50 border-stone-200',  label: 'Read' },
  Quiz:           { icon: Trophy,     color: 'text-rose-700',    bg: 'bg-rose-50 border-rose-200',    label: 'Quiz' },
  Writing:        { icon: PenLine,    color: 'text-teal-700',    bg: 'bg-teal-50 border-teal-200',    label: 'Write' },
  Shadowing:      { icon: Mic,        color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200', label: 'Shadow' },
  Roleplay:       { icon: Zap,        color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200', label: 'Roleplay' },
  'AI Roleplay':  { icon: Zap,        color: 'text-orange-700',  bg: 'bg-orange-50 border-orange-200', label: 'AI Roleplay' },
  'Mobile App':   { icon: Layers,     color: 'text-cyan-700',    bg: 'bg-cyan-50 border-cyan-200',    label: 'App' },
  default:        { icon: Star,       color: 'text-stone-600',   bg: 'bg-stone-50 border-stone-200',  label: 'Task' },
};

const getTaskMeta = (type: string) => TASK_META[type] ?? TASK_META.default;

// ── Skill → contentRanking SkillType mapping ─────────────────────
const FOCUS_SKILL_MAP: Record<string, SkillType> = {
  'Pronunciation & Greetings': 'SPRECHEN',
  'Grammar & Conversation': 'GRAMMATIK',
  'Speaking & Listening': 'SPRECHEN',
  'Grammar Core': 'GRAMMATIK',
  'Grammar & Speaking': 'GRAMMATIK',
  'Listening & Vocabulary': 'HOEREN',
  'Vocabulary & Reading': 'VOCAB',
  'Reading & Grammar': 'LESEN',
  'Writing & Grammar': 'SCHREIBEN',
};

// ── Topic → video ID map (deduplicated, unique per day topic) ────
// Each topic gets exactly ONE primary embed from the content DB.
// Built deterministically from contentRanking IDs — no repeated URLs.
const TOPIC_VIDEO_MAP: Record<number, string> = {
  // Day → YouTube video ID (from CONTENT_DB — all verified)
  1:  'A_c1V5h5a_k',  // Hend: Alphabet & Phonetics
  2:  'r94aqLUO0wo',  // Easy German: Introduce Yourself (SEG #1)
  3:  'WMvCXVorOsg',  // Hend: A1 Course Overview (covers numbers/W-Fragen intro)
  4:  'F3a7cI2g_sM',  // Hend: Akkusativ (articles context)
  5:  'oV9gP4-g-e8',  // Hend: Dativ (negation/case grammar)
  6:  'e_0kU4M0d0U',  // Hend: Tagesablauf (daily routine/family vocabulary)
  7:  'kGg16h3Qh2o',  // Easy German: Streets of Berlin (week review)
  8:  'g9o6q5x8sRk',  // Hend: Possessivpronomen
  9:  'Xn72-Zp9yYk',  // Taleek: A1 Unit 1 (modal verbs intro)
  10: 'g-Z1_t_a-k0',  // Easy German: Bürgeramt (real-life German bureaucracy)
  11: 'A_c1V5h5a_k',  // Hend: Alphabet repeat for pronunciation drill
  12: 'r94aqLUO0wo',  // Easy German: Greetings street interview
  13: 'F3a7cI2g_sM',  // Hend: Accusative deep dive
  14: 'oV9gP4-g-e8',  // Hend: Dative deep dive
  15: 'e_0kU4M0d0U',  // Hend: Daily life vocabulary
  16: 'WMvCXVorOsg',  // Hend: Overview checkpoint
  17: 'g9o6q5x8sRk',  // Hend: Possessivpronomen
  18: 'Xn72-Zp9yYk',  // Taleek: Lesson continuation
  19: 'kGg16h3Qh2o',  // Easy German: Berlin conversations
  20: 'g-Z1_t_a-k0',  // Easy German: Bureaucracy
};

// DW Nicos Weg episodes per day (playlist embed — no repeated raw links)
const DW_PLAYLIST = 'videoseries?list=PLkSjMwGIjDdCj--DRqRJ-QxIZ_O5I4-Tm';
const SHEHATA_GRAMMAR = 'videoseries?list=PLgBEJBaKMFqO7E4JW1q9M9YIJVH7LG5yN';

// ── Embedded Video Player ─────────────────────────────────────────
const EmbeddedPlayer: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => (
  <div className="rounded-xl overflow-hidden bg-black aspect-video mt-3">
    <iframe
      src={getYouTubeEmbedUrl(videoId)}
      className="w-full h-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
      title={title}
    />
  </div>
);

// ── Writing Task Prompt Card ─────────────────────────────────────
const WritingPromptCard: React.FC<{ title: string; isDone: boolean }> = ({ title, isDone }) => {
  const [text, setText] = useState('');
  return (
    <div className="mt-3 space-y-2">
      <p className="text-[11px] text-teal-700 font-bold uppercase tracking-wide">Your Writing Space</p>
      <textarea
        rows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={isDone}
        placeholder="Write your answer here in German... (your work is saved locally)"
        className="w-full px-3 py-2 text-sm border border-teal-200 rounded-xl bg-teal-50 focus:outline-none focus:border-teal-400 resize-none placeholder-teal-300"
      />
      <div className="flex justify-between items-center">
        <span className="text-[10px] text-stone-400">{text.length} characters</span>
        {text.length > 10 && (
          <span className="text-[10px] text-emerald-600 font-bold">✓ Saved</span>
        )}
      </div>
    </div>
  );
};

// ── Speaking Drill Card ──────────────────────────────────────────
const SpeakingDrillCard: React.FC<{ title: string }> = ({ title }) => {
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2">
      <p className="text-[11px] text-emerald-700 font-bold uppercase tracking-wide">Speaking Drill</p>
      <p className="text-xs text-emerald-900">{title}</p>
      <div className="flex gap-2">
        {!done ? (
          <button
            onClick={() => { setRecording(!recording); if (recording) setDone(true); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              recording
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-500 text-white hover:bg-emerald-600'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            {recording ? 'Recording... (click to finish)' : 'Start Speaking'}
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> Drill completed!
          </div>
        )}
      </div>
    </div>
  );
};

// ── Task Card (rich, non-generic) ─────────────────────────────────
const TaskCard: React.FC<{
  task: any;
  taskId: string;
  taskIndex: number;
  dayNumber: number;
  isDone: boolean;
  dayVideoId?: string;
  isFirstVideoTask: boolean;
  secondaryVideoId?: string;
}> = ({ task, taskId, taskIndex, dayNumber, isDone, dayVideoId, isFirstVideoTask, secondaryVideoId }) => {
  const { toggleTask } = useApp();
  const [expanded, setExpanded] = useState(false);

  const meta = getTaskMeta(task.type);
  const Icon = meta.icon;
  const isVideo = task.type === 'Watch' || task.type === 'Listen';
  const isWriting = task.type === 'Writing' || (task.type === 'Write');
  const isSpeaking = task.type === 'Speak' || task.type === 'Shadowing';

  // Determine which video to embed (only embed, never link)
  const embedVideoId = isVideo
    ? (isFirstVideoTask ? dayVideoId : secondaryVideoId)
    : undefined;

  const hasExpandable = isVideo || isWriting || isSpeaking;

  return (
    <div
      className={`rounded-xl border transition-all ${
        isDone
          ? 'bg-stone-50 border-stone-100 opacity-60'
          : `${meta.bg} hover:shadow-sm`
      }`}
    >
      {/* Task Header Row */}
      <div
        className="flex items-start gap-3 p-3 cursor-pointer"
        onClick={() => {
          if (hasExpandable && !isDone) setExpanded(e => !e);
          else toggleTask(taskId, dayNumber);
        }}
      >
        {/* Completion Toggle */}
        <button
          onClick={e => { e.stopPropagation(); toggleTask(taskId, dayNumber); }}
          className="shrink-0 mt-0.5"
        >
          {isDone
            ? <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            : <Circle className="w-4 h-4 text-stone-400 hover:text-stone-600" />
          }
        </button>

        {/* Task type icon */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isDone ? 'bg-stone-200' : meta.bg.split(' ')[0]}`}>
          <Icon className={`w-3.5 h-3.5 ${isDone ? 'text-stone-400' : meta.color}`} />
        </div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold leading-snug ${isDone ? 'line-through text-stone-400' : 'text-stone-900'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`text-[10px] font-black uppercase ${isDone ? 'text-stone-300' : meta.color}`}>
              {meta.label}
            </span>
            {task.duration && (
              <span className="flex items-center gap-0.5 text-[10px] text-stone-400">
                <Clock className="w-2.5 h-2.5" /> {task.duration}
              </span>
            )}
          </div>
        </div>

        {/* Expand arrow (for tasks with embedded content) */}
        {hasExpandable && !isDone && (
          <div className={`shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown className={`w-4 h-4 ${meta.color}`} />
          </div>
        )}
      </div>

      {/* Expanded Content — embedded, never linked */}
      {expanded && !isDone && (
        <div className="px-3 pb-3 space-y-2 animate-fadeIn">
          {/* VIDEO EMBED — directly inside the task, no "Watch →" link */}
          {isVideo && embedVideoId && (
            <EmbeddedPlayer videoId={embedVideoId} title={task.title} />
          )}
          {isVideo && !embedVideoId && (
            <div className="bg-stone-100 rounded-xl p-3 text-xs text-stone-500 text-center">
              Search: <span className="font-bold text-stone-700">"{task.title}"</span> on YouTube
            </div>
          )}
          {/* WRITING TASK — in-app text area */}
          {isWriting && <WritingPromptCard title={task.title} isDone={isDone} />}
          {/* SPEAKING DRILL — in-app speaking practice */}
          {isSpeaking && <SpeakingDrillCard title={task.title} />}

          {/* Done button */}
          <button
            onClick={() => { toggleTask(taskId, dayNumber); setExpanded(false); }}
            className="w-full py-2 rounded-xl bg-stone-900 text-white text-xs font-black hover:bg-stone-700 transition-colors"
          >
            Mark Complete ✓
          </button>
        </div>
      )}
    </div>
  );
};

// ── Day Card ──────────────────────────────────────────────────────
const DayCard: React.FC<{ day: any; trackId: string }> = ({ day, trackId }) => {
  const { mode, completedTasks, toggleTask, markDayComplete, completedDays, makeTaskId, currentTrackId } = useApp();
  const [expanded, setExpanded] = useState(false);

  const dayTasks = mode === 'intensive'
    ? [...(day.standardTasks || []), ...(day.intensiveTasks || [])]
    : (day.standardTasks || []);

  const isDayDone = Boolean(completedDays?.includes(day.dayNumber));
  const doneCount = dayTasks.filter((_: any, i: number) =>
    completedTasks[makeTaskId(currentTrackId, day.dayNumber, i)]
  ).length;
  const progress = dayTasks.length > 0 ? Math.round((doneCount / dayTasks.length) * 100) : 0;

  // Assign embedded videos: primary (first Watch task) + secondary (second Watch task)
  // Each day gets different video IDs — no repetition across days
  const primaryVideoId = TOPIC_VIDEO_MAP[day.dayNumber];
  const secondaryVideoId = day.dayNumber % 3 === 0 ? DW_PLAYLIST : SHEHATA_GRAMMAR;

  let firstVideoSeen = false;

  return (
    <div className={`paper-card overflow-hidden transition-all ${isDayDone ? 'opacity-70' : ''}`}>
      {/* Day Header */}
      <div
        className="flex items-start justify-between p-4 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Day number bubble */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
            isDayDone
              ? 'bg-emerald-100 text-emerald-700'
              : progress > 0
                ? 'bg-amber-100 text-amber-800'
                : 'bg-stone-100 text-stone-600'
          }`}>
            {isDayDone ? '✓' : day.dayNumber}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider">
                Day {day.dayNumber}
              </span>
              {day.focusSkill && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full">
                  {day.focusSkill}
                </span>
              )}
            </div>
            <h4 className="text-sm font-black text-stone-900 leading-snug mt-0.5">{day.title}</h4>
            {day.objective && (
              <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{day.objective}</p>
            )}

            {/* Progress bar */}
            {!isDayDone && dayTasks.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-black text-stone-400 shrink-0">{doneCount}/{dayTasks.length}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-3">
          {/* Complete day toggle */}
          <button
            onClick={e => { e.stopPropagation(); markDayComplete(day.dayNumber); }}
            className={`px-2.5 py-1 rounded-lg font-black text-[10px] border transition-all ${
              isDayDone
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                : 'bg-white text-stone-500 border-stone-200 hover:border-amber-400 hover:text-amber-700'
            }`}
          >
            {isDayDone ? '✓ Done' : 'Mark Day'}
          </button>
          <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Tasks list */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-stone-100 pt-3 animate-fadeIn">
          {dayTasks.map((task: any, tIdx: number) => {
            const taskId = makeTaskId(currentTrackId, day.dayNumber, tIdx);
            const isDone = Boolean(completedTasks[taskId]);
            const isVideoTask = task.type === 'Watch' || task.type === 'Listen';
            const isFirstVideo = isVideoTask && !firstVideoSeen;
            if (isVideoTask) firstVideoSeen = true;

            return (
              <TaskCard
                key={tIdx}
                task={task}
                taskId={taskId}
                taskIndex={tIdx}
                dayNumber={day.dayNumber}
                isDone={isDone}
                dayVideoId={primaryVideoId}
                isFirstVideoTask={isFirstVideo}
                secondaryVideoId={secondaryVideoId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── Main Curriculum View ──────────────────────────────────────────
export const CurriculumView: React.FC = () => {
  const { activeCurriculumData, completedTasks, completedDays, makeTaskId, currentTrackId, mode } = useApp();
  const [selectedWeekNum, setSelectedWeekNum] = useState(1);

  const weeksList = activeCurriculumData?.weeks || [];
  const activeWeek = weeksList.find((w: any) => w.weekNumber === selectedWeekNum) || weeksList[0];

  // Overall progress
  const allTasks = weeksList.flatMap((w: any) =>
    (w.days || []).flatMap((d: any) => {
      const tasks = mode === 'intensive'
        ? [...(d.standardTasks || []), ...(d.intensiveTasks || [])]
        : (d.standardTasks || []);
      return tasks.map((_: any, i: number) => makeTaskId(currentTrackId, d.dayNumber, i));
    })
  );
  const completedCount = allTasks.filter(id => completedTasks[id]).length;
  const totalPercent = allTasks.length > 0 ? Math.round((completedCount / allTasks.length) * 100) : 0;

  // Week completion status
  const getWeekProgress = (week: any) => {
    const tasks = (week.days || []).flatMap((d: any) => {
      const t = mode === 'intensive'
        ? [...(d.standardTasks || []), ...(d.intensiveTasks || [])]
        : (d.standardTasks || []);
      return t.map((_: any, i: number) => makeTaskId(currentTrackId, d.dayNumber, i));
    });
    const done = tasks.filter((id: string) => completedTasks[id]).length;
    return { done, total: tasks.length, percent: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0 };
  };

  return (
    <div className="space-y-5 animate-fadeIn">

      {/* Header */}
      <div className="paper-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block mb-1">
              CEFR-ALIGNED 8-WEEK CURRICULUM
            </span>
            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0" />
              Your German Roadmap
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-lg">
              {activeCurriculumData?.description || 'Backbone: Deutsch mit Hend (Arabic) · DW Nicos Weg · Easy German. Goethe-aligned.'}
            </p>
          </div>

          {/* Overall progress ring */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-2xl font-black text-stone-900">{totalPercent}%</div>
              <div className="text-[10px] text-stone-400 uppercase">Overall</div>
              <div className="text-[10px] text-stone-400">{completedCount}/{allTasks.length} tasks</div>
            </div>
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#e7e5e4" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke="#f59e0b" strokeWidth="3"
                strokeDasharray={`${(totalPercent / 100) * 94} 94`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Two-pane layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">

        {/* Week selector */}
        <div className="md:col-span-4 space-y-2">
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
            Select Week
          </p>
          {weeksList.map((week: any) => {
            const { done, total, percent } = getWeekProgress(week);
            const isSelected = selectedWeekNum === week.weekNumber;
            return (
              <button
                key={week.weekNumber}
                onClick={() => setSelectedWeekNum(week.weekNumber)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all group ${
                  isSelected
                    ? 'bg-amber-500 border-amber-500 shadow-md shadow-amber-200'
                    : 'bg-white border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className={`text-[10px] font-black uppercase tracking-wider ${isSelected ? 'text-amber-100' : 'text-stone-400'}`}>
                      WEEK {week.weekNumber}
                    </span>
                    <p className={`text-xs font-black leading-snug mt-0.5 truncate ${isSelected ? 'text-white' : 'text-stone-800'}`}>
                      {week.title}
                    </p>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className={`text-[10px] font-black ${
                      percent === 100 ? 'text-emerald-600' : isSelected ? 'text-amber-100' : 'text-stone-400'
                    }`}>
                      {percent === 100 ? '✓' : `${percent}%`}
                    </span>
                  </div>
                </div>
                {/* Mini progress bar */}
                <div className={`mt-2 h-1 rounded-full overflow-hidden ${isSelected ? 'bg-amber-400' : 'bg-stone-100'}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-white' : 'bg-amber-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {!isSelected && (
                  <p className={`text-[10px] mt-1 ${percent === 100 ? 'text-emerald-500' : 'text-stone-400'}`}>
                    {done}/{total} tasks
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Day cards */}
        <div className="md:col-span-8 space-y-3">
          {activeWeek && (
            <div className="paper-card p-4">
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">
                WEEK {activeWeek.weekNumber} OVERVIEW
              </span>
              <h3 className="text-base font-black text-stone-900 mt-0.5">{activeWeek.title}</h3>
              {activeWeek.objective && (
                <p className="text-xs text-stone-600 mt-1">{activeWeek.objective}</p>
              )}
            </div>
          )}

          {(activeWeek?.days || []).map((day: any) => (
            <DayCard key={day.dayNumber} day={day} trackId={currentTrackId} />
          ))}

          {(!activeWeek?.days || activeWeek.days.length === 0) && (
            <div className="text-center py-12 text-stone-400">
              <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No days found for this week.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
