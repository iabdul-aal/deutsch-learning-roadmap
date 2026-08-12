/**
 * TodayDashboard.tsx - The German Learning OS
 *
 * Answers one question: "What should I do RIGHT NOW?"
 *
 * Layout:
 *   1. Next Best Action - one priority action, resource-justified
 *   2. Today's Stack - time-budgeted activity sequence
 *   3. Skill Mastery - live progress bars
 *   4. Goal Tracker - pace estimate, stat cards
 *   5. Resource Preview - top ranked resources for current level
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  Zap, Brain, Headphones, Mic, PenLine, BookOpen, Star,
  ArrowRight, Clock, BarChart2, Target, ChevronDown, ChevronUp,
  Play, ExternalLink, Flame, TrendingUp, CheckCircle2,
  Info, Youtube, FileText, Globe, Dumbbell,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { selectResourcesForSkill, CONTENT_DB, getYouTubeWatchUrl } from '../data/contentRanking';
import type { ContentSource, SkillType } from '../data/contentRanking';
import { masteryToCEFR } from '../engine/learnerModel';
import type { NextAction, SkillKey, GoalTrack } from '../types/learner';
import { YouTubePlayer } from './YouTubePlayer';

// ── Skill metadata ────────────────────────────────────────────────

const SKILL_META: Record<SkillKey, { label: string; icon: React.ReactNode; color: string }> = {
  HOEREN:          { label: 'Listening',     icon: <Headphones className="w-3.5 h-3.5" />, color: 'text-blue-600 bg-blue-50' },
  SPRECHEN:        { label: 'Speaking',      icon: <Mic className="w-3.5 h-3.5" />,        color: 'text-rose-600 bg-rose-50' },
  LESEN:           { label: 'Reading',       icon: <BookOpen className="w-3.5 h-3.5" />,   color: 'text-emerald-600 bg-emerald-50' },
  SCHREIBEN:       { label: 'Writing',       icon: <PenLine className="w-3.5 h-3.5" />,    color: 'text-purple-600 bg-purple-50' },
  GRAMMATIK:       { label: 'Grammar',       icon: <Brain className="w-3.5 h-3.5" />,      color: 'text-amber-700 bg-amber-50' },
  WORTSCHATZ:      { label: 'Vocabulary',    icon: <Star className="w-3.5 h-3.5" />,       color: 'text-indigo-600 bg-indigo-50' },
  AUSSPRACHE:      { label: 'Pronunciation', icon: <Mic className="w-3.5 h-3.5" />,        color: 'text-cyan-600 bg-cyan-50' },
  KULTURKOMPETENZ: { label: 'Culture',       icon: <Globe className="w-3.5 h-3.5" />,      color: 'text-stone-600 bg-stone-100' },
};

const ACTION_TO_SKILL_TYPE: Partial<Record<string, SkillType>> = {
  LISTENING:        'HOEREN',
  SPEAKING:         'SPRECHEN',
  READING:          'LESEN',
  WRITING:          'SCHREIBEN',
  GRAMMAR_CONCEPT:  'GRAMMATIK',
  VOCABULARY_STUDY: 'VOCAB',
  SRS_REVIEW:       'VOCAB',
};

const CEFR_TO_CONTENT_LEVEL: Record<string, 'A1' | 'A2' | 'B1' | 'ALL'> = {
  A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B1', C1: 'B1', C2: 'B1',
};

const GOAL_LABELS: Record<GoalTrack, string> = {
  TRAVEL:          'Travel',
  LIFE_IN_GERMANY: 'Live in Germany',
  STUDY:           'University',
  CAREER:          'Career',
  PROFESSIONAL:    'Professional',
};

// ── Helpers ───────────────────────────────────────────────────────

function safeAvg(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
  return Math.round(sum / values.length);
}

function weeksToTarget(currentMastery: number, targetMastery: number, dailyMinutes: number): number {
  const effectiveMinutes = Math.max(dailyMinutes, 5);
  const masteryPerHour = 1.5;
  const hoursNeeded = Math.max(0, (targetMastery - currentMastery)) / masteryPerHour;
  const hoursPerWeek = (effectiveMinutes * 7) / 60;
  return Math.ceil(hoursNeeded / Math.max(hoursPerWeek, 0.1));
}

function resourceUrl(source: ContentSource): string {
  return source.type === 'VIDEO'
    ? getYouTubeWatchUrl(source.resourceId)
    : source.resourceId;
}

function ResourceTypeIcon({ source }: { source: ContentSource }): React.ReactElement {
  if (source.type === 'VIDEO')       return <Youtube className="w-4 h-4 text-rose-500" />;
  if (source.type === 'PDF')         return <FileText className="w-4 h-4 text-blue-500" />;
  if (source.type === 'INTERACTIVE') return <Globe className="w-4 h-4 text-emerald-500" />;
  return <Globe className="w-4 h-4 text-stone-400" />;
}

// ── Next Best Action Card ─────────────────────────────────────────

const NextBestActionCard: React.FC<{
  action: NextAction;
  resource: ContentSource | null;
  onStart: () => void;
}> = ({ action, resource, onStart }) => {
  const [showReason, setShowReason] = useState(false);
  const skillMeta = action.skill ? SKILL_META[action.skill] : null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 to-stone-900 p-6 shadow-2xl border border-stone-800">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative space-y-5">
        {/* Labels row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-500 text-stone-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide">
            <Zap className="w-3 h-3" />
            Up Next
          </div>
          {skillMeta && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${skillMeta.color}`}>
              {skillMeta.label}
            </span>
          )}
          <span className="text-[10px] text-stone-500 font-mono ml-auto">
            {action.estimatedMinutes} min
          </span>
        </div>

        {/* Title + description */}
        <div>
          <h2 className="text-2xl font-black text-white leading-tight">{action.title}</h2>
          <p className="text-sm text-stone-400 mt-1 leading-relaxed">{action.description}</p>
        </div>

        {/* Resource card */}
        {resource && (
          <div className="bg-stone-800/60 border border-stone-700 rounded-2xl p-4 space-3">
            <div className="flex items-start gap-3">
              <ResourceTypeIcon source={resource} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-snug">{resource.title}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{resource.channelOrAuthor}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] text-stone-400 font-mono">{resource.durationMin}m</span>
              </div>
            </div>

            {/* Persistent-tracked YouTube player */}
            {resource.type === 'VIDEO' && resource.resourceId && (
              <div className="my-2">
                <YouTubePlayer
                  videoId={resource.resourceId}
                  title={resource.title}
                  taskTitle={resource.title}
                />
              </div>
            )}

            <button
              onClick={() => setShowReason(r => !r)}
              className="flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-bold transition-colors pt-1"
            >
              <Info className="w-3 h-3" />
              Why this one?
              {showReason ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showReason && (
              <div className="bg-stone-900/50 rounded-xl p-3 text-[11px] text-stone-400 leading-relaxed">
                {resource.channelOrAuthor.includes('DW') || resource.channelOrAuthor.includes('Deutsche Welle')
                  ? 'Deutsche Welle is the official German public broadcaster. Free, structured, and trusted by millions worldwide.'
                  : 'Picked because real learners love it and it matches your level well.'
                }
                {resource.viewsApprox
                  ? ` Over ${(resource.viewsApprox / 1_000_000).toFixed(1)}M learners have watched this.`
                  : ''
                }
              </div>
            )}
          </div>
        )}

        {/* CTA row */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStart}
            className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm transition-all shadow-lg shadow-amber-900/30 active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            Go Study
          </button>
          {resource && (
            <a
              href={resourceUrl(resource)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-2xl bg-white/10 border border-stone-600 hover:bg-white/20 text-white text-sm font-bold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {resource.type === 'VIDEO' ? 'Watch on YouTube' : 'Open Resource'}
            </a>
          )}
        </div>

        {/* Reason footnote */}
        {action.reason && (
          <div className="flex items-start gap-1.5 bg-stone-800/50 border border-stone-700 rounded-xl px-3 py-2">
            <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-stone-300 leading-relaxed">{action.reason}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Stack Item ────────────────────────────────────────────────────

const StackItem: React.FC<{
  index: number;
  action: NextAction;
  resource: ContentSource | null;
  isActive: boolean;
  isDone: boolean;
  onDone: () => void;
  onNavigate: (view: string) => void;
}> = ({ index, action, resource, isActive, isDone, onDone, onNavigate }) => {
  const skillMeta = action.skill ? SKILL_META[action.skill] : null;
  const [expanded, setExpanded] = useState(false);

  const handleStart = useCallback(() => {
    if (action.type === 'SRS_REVIEW' || action.type === 'VOCABULARY_STUDY') onNavigate('vocabulary');
    else if (action.type === 'GRAMMAR_CONCEPT') onNavigate('grammar');
    else if (action.type === 'MISSION') onNavigate('missions');
    else if (action.type === 'ASSESSMENT') onNavigate('assessments');
  }, [action.type, onNavigate]);

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isDone    ? 'border-stone-100 bg-stone-50 opacity-60' :
      isActive  ? 'border-amber-300 bg-amber-50 shadow-sm' :
                  'border-stone-200 bg-white hover:border-stone-300'
    }`}>
      <div className="flex items-center gap-3 p-3.5">
        {/* Step bubble */}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${
          isDone   ? 'bg-emerald-500 text-white' :
          isActive ? 'bg-amber-500 text-stone-950' :
                     'bg-stone-100 text-stone-500'
        }`}>
          {isDone ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-bold leading-snug ${isDone ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
              {action.title}
            </p>
            {skillMeta && (
              <span className={`hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-full ${skillMeta.color}`}>
                {skillMeta.label}
              </span>
            )}
          </div>
          {resource && (
            <p className="text-[11px] text-stone-400 truncate mt-0.5">{resource.channelOrAuthor}</p>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] text-stone-400 font-mono">{action.estimatedMinutes}m</span>
          {!isDone && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-2 rounded-xl hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-all border border-transparent hover:border-stone-200"
              aria-label={expanded ? 'Collapse details' : 'Show details'}
              title={expanded ? 'Hide details' : 'Show details & resource'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={onDone}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isDone
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-stone-100 hover:bg-emerald-100 hover:text-emerald-700 text-stone-400'
            }`}
            aria-label={isDone ? 'Mark incomplete' : 'Mark done'}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded drawer */}
      {expanded && !isDone && (
        <div className="border-t border-stone-100 bg-stone-50 p-3.5 space-y-3">
          <p className="text-xs text-stone-600 leading-relaxed">{action.description}</p>
          {resource && (
            <div className="flex items-center gap-2">
              <ResourceTypeIcon source={resource} />
              <span className="text-xs font-bold text-stone-700">{resource.channelOrAuthor}</span>
              {resource.language === 'AR' && (
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">AR</span>
              )}
            </div>
          )}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-black hover:bg-amber-400 transition-all"
            >
              <ArrowRight className="w-3 h-3" />
              Go to Section
            </button>
            {resource && (
              <a
                href={resourceUrl(resource)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-700 transition-all"
              >
                <ExternalLink className="w-3 h-3" />
                {resource.type === 'VIDEO' ? 'Watch on YouTube' : 'Open Resource'}
              </a>
            )}
          </div>
          {action.reason && (
            <p className="text-[10px] text-stone-400 italic leading-relaxed">{action.reason}</p>
          )}
        </div>
      )}
    </div>
  );
};

// ── Skill Bar ────────────────────────────────────────────────────

const SkillBar: React.FC<{ skill: SkillKey; mastery: number }> = ({ skill, mastery }) => {
  const meta = SKILL_META[skill];
  const safeMastery = Number.isFinite(mastery) ? mastery : 0;
  const cefr = masteryToCEFR(safeMastery);

  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}>
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-stone-700">{meta.label}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-stone-400">{Math.round(safeMastery)}%</span>
            <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-1.5 py-px rounded-full">{cefr}</span>
          </div>
        </div>
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-400 to-amber-600"
            style={{ width: `${Math.max(2, safeMastery)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────

export const TodayDashboard: React.FC = () => {
  const {
    learnerModel,
    nextActions,
    setActiveView,
    userName,
    addStudyMinutes,
    srsStats,
  } = useApp();

  const [doneSet, setDoneSet] = useState<Set<number>>(new Set());
  const [sessionStarted, setSessionStarted] = useState(false);

  const { skillMastery, goalProfile, cefrEstimate } = learnerModel;
  const currentCEFR = cefrEstimate?.overall ?? 'A1';
  const targetCEFR  = goalProfile?.targetCEFR ?? 'B1';
  const goal        = goalProfile?.track ?? 'LIFE_IN_GERMANY';

  const contentLevel = CEFR_TO_CONTENT_LEVEL[currentCEFR] ?? 'A1';
  const dailyMinutes = Math.max(15, Math.round(((goalProfile?.weeklyHours ?? 3.5) * 60) / 7));

  // Map each action to its best resource
  const actionResources = useMemo(() =>
    nextActions.map(action => {
      const st = ACTION_TO_SKILL_TYPE[action.type];
      if (!st) return null;
      return selectResourcesForSkill(CONTENT_DB, st, contentLevel, 'arabic').primary ?? null;
    }),
    [nextActions, contentLevel],
  );

  // Budget today's stack to fit daily time allocation
  const stackActions = useMemo(() => {
    let budget = Math.min(dailyMinutes, 120);
    const out: typeof nextActions = [];
    for (const action of nextActions) {
      if (budget <= 0) break;
      out.push(action);
      budget -= action.estimatedMinutes;
    }
    return out;
  }, [nextActions, dailyMinutes]);

  // Pace estimate: how long to reach target CEFR
  const paceEstimate = useMemo(() => {
    const masteryTarget = { A1: 20, A2: 40, B1: 60, B2: 80, C1: 95, C2: 100 }[targetCEFR] ?? 60;
    const vals = Object.values(skillMastery ?? {}).filter(Number.isFinite) as number[];
    const avg  = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    if (avg >= masteryTarget) return 'Goal achieved';
    const weeks  = weeksToTarget(avg, masteryTarget, dailyMinutes);
    const months = Math.ceil(weeks / 4);
    return months <= 1 ? `${weeks} weeks` : `${months} months`;
  }, [skillMastery, targetCEFR, dailyMinutes]);

  const primaryAction   = nextActions[0] ?? null;
  const primaryResource = actionResources[0] ?? null;

  const totalDoneMinutes = stackActions
    .filter((_, i) => doneSet.has(i))
    .reduce((s, a) => s + a.estimatedMinutes, 0);

  const handleMarkDone = useCallback((index: number) => {
    setDoneSet(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        const action = stackActions[index];
        if (action?.skill) addStudyMinutes(action.skill, action.estimatedMinutes ?? 5);
      }
      return next;
    });
  }, [stackActions, addStudyMinutes]);

  const todayLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric',
  });

  const coreSkills: SkillKey[] = ['GRAMMATIK', 'WORTSCHATZ', 'HOEREN', 'SPRECHEN', 'LESEN', 'SCHREIBEN'];
  const avgMastery = safeAvg(coreSkills.map(k => skillMastery?.[k] ?? 0));
  const dueCount   = srsStats?.due ?? 0;

  return (
    <div className="space-y-5 max-w-3xl mx-auto" id="learning-os-main">

      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest">{todayLabel}</p>
          <h1 className="text-2xl font-black text-stone-900 mt-0.5">
            {(() => {
              const hour = new Date().getHours();
              const greeting = hour >= 5 && hour < 12 ? 'Guten Morgen' : hour >= 12 && hour < 18 ? 'Guten Tag' : 'Guten Abend';
              return userName ? `${greeting}, ${userName}` : `${greeting}!`;
            })()}
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">Here's what to tackle today</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {(learnerModel.studyStreak ?? 0) >= 1 && (
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-black text-orange-700">{learnerModel.studyStreak}</span>
            </div>
          )}
          <div className="text-center bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
            <div className="text-lg font-black text-amber-900 leading-none">{currentCEFR}</div>
            <div className="text-[9px] text-amber-600 font-bold mt-0.5 uppercase">Current</div>
          </div>
          <div className="text-center bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5">
            <div className="text-lg font-black text-stone-600 leading-none">{targetCEFR}</div>
            <div className="text-[9px] text-stone-400 font-bold mt-0.5 uppercase">Target</div>
          </div>
        </div>
      </div>

      {/* Next Best Action */}
      {primaryAction ? (
        <NextBestActionCard
          action={primaryAction}
          resource={primaryResource}
          onStart={() => {
            setSessionStarted(true);
            if (primaryAction.skill) {
              addStudyMinutes(primaryAction.skill, primaryAction.estimatedMinutes);
            }
          }}
        />
      ) : (
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 to-stone-900 p-8 text-center space-y-3 border border-emerald-800">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-black text-white">You're all caught up!</h2>
          <p className="text-sm text-stone-400 leading-relaxed">
            Nothing pending right now. Come back tomorrow, or add new words to keep the momentum going.
          </p>
          <button
            onClick={() => setActiveView('vocabulary')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all"
          >
            <Star className="w-4 h-4" />
            Add Vocabulary
          </button>
        </div>
      )}

      {/* Today's Stack */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-stone-900">Today's Study Stack</h2>
            <p className="text-[11px] text-stone-400 mt-0.5">
              {stackActions.length > 0
                ? `${stackActions.reduce((s, a) => s + a.estimatedMinutes, 0)} min total`
                : 'Nothing lined up yet'}
            </p>
          </div>
          {totalDoneMinutes > 0 && (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-black">{totalDoneMinutes} min done</span>
            </div>
          )}
        </div>

        {stackActions.length > 0 ? (
          <>
            <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${doneSet.size === 0 ? 0 : (doneSet.size / stackActions.length) * 100}%` }}
              />
            </div>
            <div className="space-y-2">
              {stackActions.map((action, i) => (
                <StackItem
                  key={`${action.type}-${i}`}
                  index={i}
                  action={action}
                  resource={actionResources[i] ?? null}
                  isActive={i === 0 && !doneSet.has(0)}
                  isDone={doneSet.has(i)}
                  onDone={() => handleMarkDone(i)}
                  onNavigate={setActiveView}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-stone-200 p-6 text-center">
            <p className="text-sm text-stone-400">Finish the quick setup to unlock your daily plan.</p>
          </div>
        )}

        {/* Method note */}
        <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-stone-600 mb-1">How today is built</p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                You listen and read first, then grammar, then speak or write — same order you learned Arabic as a child.
                Word reviews always come first while your memory is freshest.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Skill Mastery */}
      <div className="paper-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-stone-900">Your Skills</h2>
          <div className="text-right">
            <div className="text-xl font-black text-stone-900">{avgMastery}%</div>
            <div className="text-[10px] text-stone-400">overall</div>
          </div>
        </div>
        <div className="space-y-3">
          {coreSkills.map(skill => (
            <SkillBar key={skill} skill={skill} mastery={skillMastery?.[skill] ?? 0} />
          ))}
        </div>
        <button
          onClick={() => setActiveView('assessments')}
          className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-600 font-bold transition-colors"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          See full progress & take a test
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Goal Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Goal',
            value: GOAL_LABELS[goal] ?? 'Learn German',
            icon: <Target className="w-4 h-4 text-amber-600" />,
            bg: 'bg-amber-50 border-amber-200',
          },
          {
            label: 'Est. Time',
            value: paceEstimate,
            icon: <Clock className="w-4 h-4 text-blue-600" />,
            bg: 'bg-blue-50 border-blue-200',
          },
          {
            label: 'Daily Budget',
            value: `${dailyMinutes} min`,
            icon: <Zap className="w-4 h-4 text-emerald-600" />,
            bg: 'bg-emerald-50 border-emerald-200',
          },
          {
            label: 'Words Due',
            value: dueCount === 0 ? 'All done' : `${dueCount} word${dueCount === 1 ? '' : 's'}`,
            icon: <Brain className="w-4 h-4 text-purple-600" />,
            bg: dueCount > 0 ? 'bg-purple-50 border-purple-200' : 'bg-stone-50 border-stone-200',
          },
        ].map(item => (
          <div key={item.label} className={`rounded-2xl border p-3 space-y-1 ${item.bg}`}>
            <div className="flex items-center gap-1.5">
              {item.icon}
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-wide">{item.label}</span>
            </div>
            <div className="text-sm font-black text-stone-900 leading-snug">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {([
          { view: 'vocabulary',  label: 'Vocabulary', icon: <Brain className="w-4 h-4" /> },
          { view: 'grammar',     label: 'Grammar',    icon: <BookOpen className="w-4 h-4" /> },
          { view: 'resources',   label: 'Resources',  icon: <Youtube className="w-4 h-4" /> },
          { view: 'missions',    label: 'Missions',   icon: <Dumbbell className="w-4 h-4" /> },
          { view: 'curriculum',  label: 'Roadmap',    icon: <Target className="w-4 h-4" /> },
          { view: 'assessments', label: 'Tests',      icon: <BarChart2 className="w-4 h-4" /> },
        ] as const).map(item => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-stone-600 hover:text-amber-800"
          >
            {item.icon}
            <span className="text-[10px] font-bold leading-none">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Resource Preview */}
      <div className="paper-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-stone-900">Top Resources for {currentCEFR}</h2>
          <button
            onClick={() => setActiveView('resources')}
            className="text-xs text-amber-700 hover:text-amber-600 font-bold flex items-center gap-1 transition-colors"
          >
            See all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {(() => {
          const previewItems: { st: SkillType; primary: ContentSource }[] = [];
          const seenIds = new Set<string>();
          for (const st of ['GRAMMATIK', 'HOEREN', 'SPRECHEN', 'LESEN'] as SkillType[]) {
            const { primary } = selectResourcesForSkill(CONTENT_DB, st, contentLevel, 'arabic');
            if (primary && !seenIds.has(primary.resourceId)) {
              seenIds.add(primary.resourceId);
              previewItems.push({ st, primary });
              if (previewItems.length === 3) break;
            }
          }
          return previewItems.map(({ st, primary }) => (
            <div key={st} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
              <ResourceTypeIcon source={primary} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-stone-800 truncate">{primary.title}</p>
                <p className="text-[10px] text-stone-400">{primary.channelOrAuthor} · {primary.durationMin}m</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={resourceUrl(primary)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-amber-600 text-white text-[11px] font-bold transition-all shadow-xs"
                  aria-label={`Open ${primary.title}`}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{primary.type === 'VIDEO' ? 'Watch' : 'Open'}</span>
                </a>
              </div>
            </div>
          ));
        })()}
      </div>

    </div>
  );
};
