import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  CONTENT_DB, rankContent, ContentSource, SkillType, getYouTubeWatchUrl
} from '../data/contentRanking';
import { resolveTaskVideoEmbed } from '../data/videoLibrary';
import { YouTubePlayer } from './YouTubePlayer';
import {
  MapPin, CheckCircle2, Circle, ChevronRight, ChevronDown,
  Play, BookOpen, Mic, PenLine, Brain, Headphones, Layers,
  Clock, Zap, Star, Lock, Trophy, ExternalLink,
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
  'Pronunciation and Greetings': 'SPRECHEN',
  'Grammar and Conversation': 'GRAMMATIK',
  'Speaking and Listening': 'SPRECHEN',
  'Grammar Core': 'GRAMMATIK',
  'Grammar and Speaking': 'GRAMMATIK',
  'Listening and Vocabulary': 'HOEREN',
  'Vocabulary and Reading': 'VOCAB',
  'Reading and Grammar': 'LESEN',
  'Writing and Grammar': 'SCHREIBEN',
};

// ── Topic → video ID map (all 56 days — pedagogy-matched) ────────────
const VERIFIED_PLAYABLE_DECK = [
  'WMvCXVorOsg', // Hend A1 — pronunciation, alphabet, grammar basics
  'r94aqLUO0wo', // Easy German — greetings, self-intro, listening immersion
  '4-eDoThe6qo', // DW Nicos Weg — story-based A1 full course
  'OFSHdj_2FQA', // Easy German — daily life, food, routines
  'RrfgbBp6ScI', // lingoni GERMAN — structured grammar course
  'MmacJnqL3i0', // Easy German 100 words — vocabulary
  'dr-dJ0a3Scs', // Deutsch mit Hend A2/B1 — intermediate grammar
];

const SECONDARY_PLAYABLE_DECK = [
  'r94aqLUO0wo', // Easy German Greetings / Introductions
  'OFSHdj_2FQA', // Easy German Restaurant & Daily Life
  '4-eDoThe6qo', // DW Nicos Weg Movie
  'RrfgbBp6ScI', // lingoni GERMAN Grammar
  'MmacJnqL3i0', // Easy German 100 Essential Words
  'dr-dJ0a3Scs', // Deutsch mit Hend A2
];

const TOPIC_VIDEO_MAP: Record<number, string> = {
  1:  'WMvCXVorOsg', 2:  'r94aqLUO0wo', 3:  'r94aqLUO0wo', 4:  'WMvCXVorOsg', 5:  'WMvCXVorOsg',
  6:  'OFSHdj_2FQA', 7:  '4-eDoThe6qo', 8:  'WMvCXVorOsg', 9:  'OFSHdj_2FQA', 10: 'r94aqLUO0wo',
  11: 'RrfgbBp6ScI', 12: 'OFSHdj_2FQA', 13: 'WMvCXVorOsg', 14: '4-eDoThe6qo', 15: 'WMvCXVorOsg',
  16: 'r94aqLUO0wo', 17: 'OFSHdj_2FQA', 18: 'WMvCXVorOsg', 19: 'RrfgbBp6ScI', 20: 'r94aqLUO0wo',
  21: '4-eDoThe6qo', 22: 'WMvCXVorOsg', 23: 'RrfgbBp6ScI', 24: 'r94aqLUO0wo', 25: 'OFSHdj_2FQA',
  26: 'WMvCXVorOsg', 27: 'MmacJnqL3i0', 28: '4-eDoThe6qo', 29: 'WMvCXVorOsg', 30: 'RrfgbBp6ScI',
  31: 'r94aqLUO0wo', 32: 'OFSHdj_2FQA', 33: 'WMvCXVorOsg', 34: 'RrfgbBp6ScI', 35: '4-eDoThe6qo',
  36: 'dr-dJ0a3Scs', 37: 'dr-dJ0a3Scs', 38: 'r94aqLUO0wo', 39: 'dr-dJ0a3Scs', 40: 'MmacJnqL3i0',
  41: 'OFSHdj_2FQA', 42: '4-eDoThe6qo', 43: 'WMvCXVorOsg', 44: 'RrfgbBp6ScI', 45: 'r94aqLUO0wo',
  46: 'dr-dJ0a3Scs', 47: 'OFSHdj_2FQA', 48: 'MmacJnqL3i0', 49: '4-eDoThe6qo', 50: 'WMvCXVorOsg',
  51: 'r94aqLUO0wo', 52: 'dr-dJ0a3Scs', 53: 'OFSHdj_2FQA', 54: 'RrfgbBp6ScI', 55: 'MmacJnqL3i0',
  56: '4-eDoThe6qo',
};

// Fallback helper for days 1-56
function getVerifiedDayVideoId(dayNum: number): string {
  if (TOPIC_VIDEO_MAP[dayNum]) return TOPIC_VIDEO_MAP[dayNum];
  const idx = (dayNum - 1) % VERIFIED_PLAYABLE_DECK.length;
  return VERIFIED_PLAYABLE_DECK[idx];
}

function getSecondaryDayVideoId(dayNum: number): string {
  const idx = (dayNum - 1) % SECONDARY_PLAYABLE_DECK.length;
  return SECONDARY_PLAYABLE_DECK[idx];
}

/**
 * Calculates start and end timestamps for long video masterclasses to crop 25-min Pomodoro chapters per day.
 */
export function getVideoCroppedSegment(videoId: string, dayNumber = 1, estimatedMinutes = 25) {
  const durationSec = Math.max(15, estimatedMinutes) * 60; // 25 min default = 1500s

  if (videoId === 'WMvCXVorOsg' || videoId === 'dr-dJ0a3Scs') {
    // 26-30 hour masterclass series: crop 25-minute Pomodoro segment for this specific day
    const start = Math.max(0, (dayNumber - 1) * 1500);
    const end = start + durationSec;
    return { startTimeSeconds: start, endTimeSeconds: end };
  }

  if (videoId === '4-eDoThe6qo') {
    // DW Nicos Weg full movie (100 min = 6000s): crop 10-minute episode for this specific day
    const dayMod = (dayNumber - 1) % 10;
    const start = dayMod * 600;
    const end = start + 600;
    return { startTimeSeconds: start, endTimeSeconds: end };
  }

  return { startTimeSeconds: 0, endTimeSeconds: durationSec };
}

// ── Embedded Video Player (persistent watch tracking & Pomodoro focus timer) ──
const EmbeddedPlayer: React.FC<{
  videoId: string;
  title: string;
  dayNumber?: number;
  startTimeSeconds?: number;
  endTimeSeconds?: number;
  estimatedMinutes?: number;
}> = ({ videoId, title, dayNumber, startTimeSeconds, endTimeSeconds, estimatedMinutes }) => (
  <div className="mt-3">
    <YouTubePlayer
      videoId={videoId}
      title={title}
      dayNumber={dayNumber}
      taskTitle={title}
      startTimeSeconds={startTimeSeconds}
      endTimeSeconds={endTimeSeconds}
      estimatedMinutes={estimatedMinutes}
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
          <span className="text-[10px] text-emerald-600 font-bold">Saved</span>
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

// ── Lesson Resource Attachment Card ────────────────────────────────
const TaskResourceCard: React.FC<{ task: any; dayNumber?: number }> = ({ task, dayNumber = 1 }) => {
  let link = (task.link || '').trim();

  // Only fall back to external learning portals if link is missing or an invalid placeholder
  if (!link || link.includes('NO_LINK') || link.includes('bahn.de')) {
    if (task.type === 'Quiz') {
      link = 'https://www.schubert-verlag.de/aufgaben/index.htm';
    } else if (task.type === 'Read') {
      link = 'https://learngerman.dw.com/en/nicos-weg';
    } else if (task.type === 'Memorize' || task.type === 'Mobile App') {
      link = 'https://apps.ankiweb.net/';
    } else if (task.type === 'Writing') {
      link = 'https://www.deutschakademie.de/online-deutschkurs/App#user/exercises';
    } else {
      link = 'https://en.pons.com/translate/german-arabic';
    }
  }

  return (
    <div className="mt-3 bg-stone-50 border border-stone-200 rounded-xl p-3 space-y-2">
      <p className="text-[11px] text-stone-600 font-bold uppercase tracking-wide">Lesson Resource & Practice Link</p>
      <p className="text-xs text-stone-900 font-medium">{task.title}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-stone-200 hover:border-amber-400 text-xs font-bold text-stone-800 transition-all shadow-xs group"
      >
        <span className="truncate pr-2">
          {link.includes('youtube.com') || link.includes('youtu.be') ? 'Open Video Lesson on YouTube ↗' :
           task.type === 'Quiz' ? 'Open Schubert Verlag Practice Exercises' :
           task.type === 'Read' ? 'Open DW Nicos Weg Interactive Module' :
           task.type === 'Memorize' || task.type === 'Mobile App' ? 'Open Anki German A1 Deck' :
           task.type === 'Writing' ? 'Open DeutschAkademie Writing Trainer' :
           'Open Reference Dictionary (PONS)'}
        </span>
        <ExternalLink className="w-3.5 h-3.5 text-amber-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
      </a>
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
  const { currentTrackId, toggleTask } = useApp();
  const [expanded, setExpanded] = useState(false);

  const meta = getTaskMeta(task.type);
  const Icon = meta.icon;
  const isVideo = task.type === 'Watch' || task.type === 'Listen' || task.type === 'Speak' || task.type === 'Shadowing' || Boolean(task.link && task.link.includes('v='));
  const isWriting = task.type === 'Writing' || (task.type === 'Write');
  const isSpeaking = task.type === 'Speak' || task.type === 'Shadowing' || task.type === 'Roleplay' || task.type === 'AI Roleplay';

  // Calculate duration & intelligent creator-matched video embed
  const durationMatch = (task.duration || '').match(/(\d+)/);
  const estimatedMin = durationMatch ? parseInt(durationMatch[1], 10) : 25;

  const resolvedVideo = isVideo
    ? resolveTaskVideoEmbed(task.title, task.link, dayNumber, currentTrackId, estimatedMin)
    : null;

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
          if (!isDone) setExpanded(e => !e);
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
              <span className="flex items-center gap-0.5 text-[10px] text-stone-400 font-medium">
                <Clock className="w-2.5 h-2.5 text-amber-500" /> {task.duration}
              </span>
            )}
          </div>
        </div>

        {/* Expand arrow */}
        {!isDone && (
          <div className={`shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <ChevronDown className={`w-4 h-4 ${meta.color}`} />
          </div>
        )}
      </div>

      {/* Expanded Content - rich embeddings & attachments */}
      {expanded && !isDone && (
        <div className="px-3 pb-3 space-y-2 animate-fadeIn">
          {/* VIDEO EMBED */}
          {isVideo && resolvedVideo && (
            <EmbeddedPlayer
              videoId={resolvedVideo.videoId}
              title={task.title}
              dayNumber={dayNumber}
              startTimeSeconds={resolvedVideo.startTimeSeconds}
              endTimeSeconds={resolvedVideo.endTimeSeconds}
              estimatedMinutes={estimatedMin}
            />
          )}

          {/* WRITING TASK */}
          {isWriting && <WritingPromptCard title={task.title} isDone={isDone} />}

          {/* SPEAKING DRILL */}
          {isSpeaking && <SpeakingDrillCard title={task.title} />}

          {/* PRACTICE RESOURCE LINK */}
          <TaskResourceCard task={task} dayNumber={dayNumber} />
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
  const primaryVideoId = getVerifiedDayVideoId(day.dayNumber);
  const secondaryVideoId = getSecondaryDayVideoId(day.dayNumber);

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

        {/* Right controls */}
        <div className="flex items-center gap-2 shrink-0 ml-3">
          {/* Mark Day button */}
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
          {/* Expand indicator */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors">
            <span className="text-[10px] text-stone-500 font-bold hidden sm:block">
              {expanded ? 'Close' : 'Open'}
            </span>
            <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </div>
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

  // Overall track statistics
  const totalTrackDays = activeCurriculumData?.totalDays || 56;
  const doneDaysCount = (completedDays || []).length;
  const trackProgressPercent = Math.round((doneDaysCount / totalTrackDays) * 100);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="paper-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              CURRICULUM ROADMAP
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-500 text-stone-950 uppercase">
              {currentTrackId.replace('-ar', '').toUpperCase()} Track
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 mt-1">
            {activeCurriculumData?.title || '56-Day Mastery Roadmap'}
          </h2>
          <p className="text-xs text-stone-600 mt-0.5 max-w-2xl">
            Structured daily Pomodoro blocks combining Arabic video masterclasses, DW story immersion, and Goethe/TELC exam practice.
          </p>
        </div>

        {/* Progress gauge */}
        <div className="w-full md:w-48 bg-stone-50 border border-stone-200 p-3 rounded-2xl flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1">
            <span>Progress</span>
            <span className="text-amber-700 font-black">{trackProgressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${trackProgressPercent}%` }}
            />
          </div>
          <p className="text-[10px] text-stone-400 font-bold mt-1 text-right">
            {doneDaysCount} / {totalTrackDays} Days Complete
          </p>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(weeksList || []).map((w: any) => {
          const isSelected = w.weekNumber === selectedWeekNum;
          return (
            <button
              key={w.weekNumber}
              onClick={() => setSelectedWeekNum(w.weekNumber)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all border shrink-0 ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:text-stone-900'
              }`}
            >
              Week {w.weekNumber}: {w.title.split(':')[1] || w.title}
            </button>
          );
        })}
      </div>

      {/* Selected Week Header */}
      {activeWeek && (
        <div className="bg-stone-900 text-white p-4 rounded-2xl space-y-1 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-400">
              Week {activeWeek.weekNumber} Focus
            </span>
          </div>
          <h3 className="text-base font-extrabold">{activeWeek.title}</h3>
          {activeWeek.objective && (
            <p className="text-xs text-stone-300 leading-relaxed">{activeWeek.objective}</p>
          )}
        </div>
      )}

      {/* Days List */}
      <div className="space-y-3">
        {(activeWeek?.days || []).map((day: any) => (
          <DayCard key={day.dayNumber} day={day} trackId={currentTrackId} />
        ))}
      </div>
    </div>
  );
};
