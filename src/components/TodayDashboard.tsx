/**
 * TodayDashboard.tsx — The German Learning OS
 *
 * Philosophy (Master Directive):
 *   This is NOT a course viewer or content library.
 *   This is the intelligence layer that answers:
 *   "Given who I am and what I want, what is the single best
 *    thing I should do RIGHT NOW to learn German?"
 *
 * Layout:
 *   1. Next Best Action — ONE priority action, fully justified
 *   2. Today's Stack — 3-5 sequenced activities for the day
 *   3. Skill Radar — live mastery bars
 *   4. Goal Tracker — pace estimate, target CEFR
 *   5. Method Notes — WHY this sequence (pedagogical reasoning)
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  Zap, Brain, Headphones, Mic, PenLine, BookOpen, Star,
  ArrowRight, Clock, BarChart2, Target, ChevronDown, ChevronUp,
  Play, ExternalLink, RefreshCw, Flame, TrendingUp, CheckCircle2,
  Info, Youtube, FileText, Globe, Dumbbell,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { selectResourcesForSkill, CONTENT_DB } from '../data/contentRanking';
import type { ContentSource, SkillType } from '../data/contentRanking';
import { masteryToCEFR, getSkillGaps } from '../engine/learnerModel';
import { generateRoadmap } from '../engine/roadmap';
import type { NextAction, SkillKey, CEFRLevel, GoalTrack } from '../types/learner';

// ── Constants ─────────────────────────────────────────────────────

const SKILL_LABELS: Record<SkillKey, { en: string; ar: string; icon: React.ReactNode; color: string }> = {
  HOEREN:          { en: 'Listening',    ar: 'الاستماع', icon: <Headphones className="w-3.5 h-3.5" />, color: 'text-blue-600 bg-blue-50' },
  SPRECHEN:        { en: 'Speaking',     ar: 'التحدث',   icon: <Mic className="w-3.5 h-3.5" />,        color: 'text-rose-600 bg-rose-50' },
  LESEN:           { en: 'Reading',      ar: 'القراءة',  icon: <BookOpen className="w-3.5 h-3.5" />,   color: 'text-emerald-600 bg-emerald-50' },
  SCHREIBEN:       { en: 'Writing',      ar: 'الكتابة',  icon: <PenLine className="w-3.5 h-3.5" />,    color: 'text-purple-600 bg-purple-50' },
  GRAMMATIK:       { en: 'Grammar',      ar: 'القواعد',  icon: <Brain className="w-3.5 h-3.5" />,      color: 'text-amber-700 bg-amber-50' },
  WORTSCHATZ:      { en: 'Vocabulary',   ar: 'المفردات', icon: <Star className="w-3.5 h-3.5" />,       color: 'text-indigo-600 bg-indigo-50' },
  AUSSPRACHE:      { en: 'Pronunciation',ar: 'النطق',    icon: <Mic className="w-3.5 h-3.5" />,        color: 'text-cyan-600 bg-cyan-50' },
  KULTURKOMPETENZ: { en: 'Culture',      ar: 'الثقافة',  icon: <Globe className="w-3.5 h-3.5" />,      color: 'text-stone-600 bg-stone-100' },
};

const ACTION_ICONS: Record<string, React.ReactNode> = {
  SRS_REVIEW:       <Brain className="w-5 h-5" />,
  GRAMMAR_CONCEPT:  <Brain className="w-5 h-5" />,
  LISTENING:        <Headphones className="w-5 h-5" />,
  SPEAKING:         <Mic className="w-5 h-5" />,
  READING:          <BookOpen className="w-5 h-5" />,
  WRITING:          <PenLine className="w-5 h-5" />,
  VOCABULARY_STUDY: <Star className="w-5 h-5" />,
  MISSION:          <Dumbbell className="w-5 h-5" />,
  ASSESSMENT:       <BarChart2 className="w-5 h-5" />,
};

const ACTION_TYPE_TO_SKILL_TYPE: Partial<Record<string, SkillType>> = {
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

const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// ── Helpers ───────────────────────────────────────────────────────

function weeksToTarget(
  currentMastery: number,
  targetMastery: number,
  dailyMinutes: number,
): number {
  const masteryPerHour = 1.5;
  const hoursNeeded = (targetMastery - currentMastery) / masteryPerHour;
  const hoursPerWeek = (dailyMinutes * 7) / 60;
  return Math.ceil(hoursNeeded / hoursPerWeek);
}

function getResourceTypeIcon(source: ContentSource): React.ReactNode {
  if (source.type === 'VIDEO') return <Youtube className="w-4 h-4 text-rose-500" />;
  if (source.type === 'PDF') return <FileText className="w-4 h-4 text-blue-500" />;
  if (source.type === 'INTERACTIVE') return <Globe className="w-4 h-4 text-emerald-500" />;
  return <Globe className="w-4 h-4 text-stone-400" />;
}

function buildYouTubeUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// ── Sub-components ────────────────────────────────────────────────

/** The central "Next Best Action" card — biggest piece of UI real estate */
const NextBestActionCard: React.FC<{
  action: NextAction;
  resource: ContentSource | null;
  onStart: () => void;
}> = ({ action, resource, onStart }) => {
  const [showReason, setShowReason] = useState(false);
  const skillLabel = action.skill ? SKILL_LABELS[action.skill] : null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 to-stone-900 p-6 shadow-2xl border border-stone-800">
      {/* Amber glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="relative space-y-5">
        {/* Label */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-amber-500 text-stone-950 text-[10px] font-black px-3 py-1 rounded-full">
            <Zap className="w-3 h-3" />
            NEXT BEST ACTION
          </div>
          {skillLabel && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${skillLabel.color}`}>
              {skillLabel.en}
            </span>
          )}
          <span className="text-[10px] text-stone-500 font-mono ml-auto">
            ~{action.estimatedMinutes} min
          </span>
        </div>

        {/* Action title */}
        <div>
          <h2 className="text-2xl font-black text-white leading-tight">{action.title}</h2>
          <p className="text-sm text-stone-400 mt-1 leading-relaxed">{action.description}</p>
        </div>

        {/* Resource recommendation */}
        {resource && (
          <div className="bg-stone-800/60 border border-stone-700 rounded-2xl p-4 space-y-2">
            <div className="flex items-start gap-2">
              {getResourceTypeIcon(resource)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">{resource.title}</p>
                <p className="text-[11px] text-stone-400">{resource.channelOrAuthor}</p>
                {resource.titleAR && (
                  <p className="text-[11px] text-stone-500 mt-0.5" dir="rtl">{resource.titleAR}</p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {resource.language === 'AR' && (
                  <span className="text-[10px] bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    عربي
                  </span>
                )}
                <span className="text-[10px] text-stone-500 font-mono">{resource.durationMin}m</span>
              </div>
            </div>

            {/* Why this resource */}
            <button
              onClick={() => setShowReason(r => !r)}
              className="flex items-center gap-1.5 text-[11px] text-amber-500 hover:text-amber-400 font-bold transition-colors"
            >
              <Info className="w-3 h-3" />
              Why this resource?
              {showReason ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
            {showReason && (
              <div className="bg-stone-900/50 rounded-xl p-3 text-[11px] text-stone-400 leading-relaxed animate-fadeIn">
                Ranked #{resource.rankScore !== undefined ? Math.round(100 - resource.rankScore) + 1 : '?'} for {action.skill?.toLowerCase() ?? 'this skill'} at your level.
                {resource.language === 'AR' && ' Arabic-first instruction reduces cognitive load by 30%.'}
                {resource.viewsApprox && ` ${(resource.viewsApprox / 1000).toFixed(0)}K+ learners use this resource.`}
              </div>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onStart}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm transition-all shadow-lg shadow-amber-900/30 active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-current" />
            Start Now
          </button>
          {resource?.type === 'VIDEO' && (
            <a
              href={buildYouTubeUrl(resource.resourceId)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl border border-stone-700 text-stone-300 hover:text-white hover:border-stone-500 text-sm font-bold transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open
            </a>
          )}
        </div>

        {/* Pedagogical reason */}
        <button
          onClick={() => setShowReason(r => !r)}
          className="flex items-center gap-1.5 text-[11px] text-stone-500 hover:text-stone-300 transition-colors"
        >
          <Info className="w-3 h-3" />
          <span>{action.reason}</span>
        </button>
      </div>
    </div>
  );
};

/** One item in the Today's Stack list */
const StackItem: React.FC<{
  index: number;
  action: NextAction;
  resource: ContentSource | null;
  isActive: boolean;
  isDone: boolean;
  onDone: () => void;
  setActiveView: (view: string) => void;
}> = ({ index, action, resource, isActive, isDone, onDone, setActiveView }) => {
  const skillLabel = action.skill ? SKILL_LABELS[action.skill] : null;
  const [expanded, setExpanded] = useState(false);

  const handleStart = useCallback(() => {
    if (action.type === 'SRS_REVIEW' || action.type === 'VOCABULARY_STUDY') {
      setActiveView('vocabulary');
    } else if (action.type === 'GRAMMAR_CONCEPT') {
      setActiveView('grammar');
    } else if (action.type === 'MISSION') {
      setActiveView('missions');
    }
  }, [action.type, setActiveView]);

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isDone ? 'border-stone-100 bg-stone-50 opacity-60' :
      isActive ? 'border-amber-300 bg-amber-50 shadow-md' :
      'border-stone-200 bg-white hover:border-stone-300'
    }`}>
      <div className="flex items-center gap-3 p-3.5">
        {/* Step number / check */}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-black ${
          isDone ? 'bg-emerald-500 text-white' :
          isActive ? 'bg-amber-500 text-stone-950' :
          'bg-stone-100 text-stone-500'
        }`}>
          {isDone ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={`text-sm font-bold ${isDone ? 'text-stone-400 line-through' : 'text-stone-900'}`}>
              {action.title}
            </p>
            {skillLabel && (
              <span className={`hidden sm:inline text-[10px] font-bold px-1.5 py-0.5 rounded-full ${skillLabel.color}`}>
                {skillLabel.en}
              </span>
            )}
          </div>
          {resource && (
            <p className="text-[11px] text-stone-400 truncate">{resource.title}</p>
          )}
        </div>

        {/* Meta + actions */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-stone-400 font-mono">{action.estimatedMinutes}m</span>
          {!isDone && (
            <button
              onClick={() => setExpanded(e => !e)}
              className="p-1 rounded-lg hover:bg-stone-100 text-stone-400"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={onDone}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-stone-100 hover:bg-emerald-100 hover:text-emerald-700 text-stone-400'
            }`}
            aria-label={isDone ? 'Completed' : 'Mark as done'}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && !isDone && (
        <div className="border-t border-stone-100 bg-stone-50 p-3.5 space-y-3 animate-fadeIn">
          <p className="text-xs text-stone-600">{action.description}</p>
          {resource && (
            <div className="flex items-center gap-2">
              {getResourceTypeIcon(resource)}
              <span className="text-xs font-bold text-stone-700">{resource.channelOrAuthor}</span>
              {resource.language === 'AR' && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">عربي</span>}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleStart}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-black hover:bg-amber-400 transition-all"
            >
              <Play className="w-3 h-3 fill-current" /> Start
            </button>
            {resource?.type === 'VIDEO' && (
              <a
                href={buildYouTubeUrl(resource.resourceId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-white transition-all"
              >
                <Youtube className="w-3 h-3 text-rose-500" /> Watch on YouTube
              </a>
            )}
          </div>
          <p className="text-[10px] text-stone-400 italic">{action.reason}</p>
        </div>
      )}
    </div>
  );
};

/** Skill mastery bar row */
const SkillBar: React.FC<{ skill: SkillKey; mastery: number }> = ({ skill, mastery }) => {
  const meta = SKILL_LABELS[skill];
  const cefr = masteryToCEFR(mastery);

  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${meta.color}`}>
        {meta.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs font-bold text-stone-700">{meta.en}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-stone-400">{Math.round(mastery)}%</span>
            <span className="text-[10px] font-black bg-amber-100 text-amber-800 px-1.5 py-px rounded-full">{cefr}</span>
          </div>
        </div>
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 bg-gradient-to-r from-amber-400 to-amber-600"
            style={{ width: `${Math.max(2, mastery)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// ── MAIN DASHBOARD ────────────────────────────────────────────────

export const TodayDashboard: React.FC = () => {
  const {
    learnerModel, nextActions, setActiveView, userName,
    addStudyMinutes, srsStats,
  } = useApp();

  const [doneSet, setDoneSet] = useState<Set<number>>(new Set());
  const [sessionStarted, setSessionStarted] = useState(false);

  const { skillMastery, goalProfile, cefrEstimate } = learnerModel;
  const goal = goalProfile.track;
  const currentCEFR = cefrEstimate.overall;
  const targetCEFR = goalProfile.targetCEFR;

  // ── Resource matching for each action ──────────────────────────
  const contentLevel = CEFR_TO_CONTENT_LEVEL[currentCEFR] ?? 'A1';

  const actionResources = useMemo(() => {
    return nextActions.map(action => {
      const skillType = ACTION_TYPE_TO_SKILL_TYPE[action.type];
      if (!skillType) return null;
      const { primary } = selectResourcesForSkill(CONTENT_DB, skillType, contentLevel, 'arabic');
      return primary ?? null;
    });
  }, [nextActions, contentLevel]);

  // ── Session budget ─────────────────────────────────────────────
  const dailyMinutes = Math.round((goalProfile.weeklyHours * 60) / 7);
  const stackActions = useMemo(() => {
    let budget = Math.min(dailyMinutes || 45, 120);
    const selected: typeof nextActions = [];
    for (const action of nextActions) {
      if (budget <= 0) break;
      selected.push(action);
      budget -= action.estimatedMinutes;
    }
    return selected;
  }, [nextActions, dailyMinutes]);

  // ── Goal pace estimate ─────────────────────────────────────────
  const paceEstimate = useMemo(() => {
    const targetMastery = { A1: 20, A2: 40, B1: 60, B2: 80, C1: 95, C2: 100 }[targetCEFR] ?? 60;
    const avgMastery = Object.values(skillMastery).reduce((a, b) => a + b, 0) / 8;
    if (avgMastery >= targetMastery) return 'Goal achieved! 🎉';
    const weeks = weeksToTarget(avgMastery, targetMastery, dailyMinutes || 30);
    const months = Math.ceil(weeks / 4);
    return months <= 1 ? `~${weeks} weeks` : `~${months} months`;
  }, [skillMastery, targetCEFR, dailyMinutes]);

  // ── Goal label ─────────────────────────────────────────────────
  const goalLabel: Record<GoalTrack, { en: string; ar: string }> = {
    TRAVEL:         { en: 'Travel',         ar: 'السفر' },
    LIFE_IN_GERMANY:{ en: 'Live in Germany', ar: 'العيش في ألمانيا' },
    STUDY:          { en: 'University',      ar: 'الدراسة الجامعية' },
    CAREER:         { en: 'Career',          ar: 'العمل المهني' },
    PROFESSIONAL:   { en: 'Professional',    ar: 'الاحتراف' },
  };

  const primaryAction = nextActions[0] ?? null;
  const primaryResource = actionResources[0] ?? null;

  const totalDoneMinutes = stackActions
    .filter((_, i) => doneSet.has(i))
    .reduce((s, a) => s + a.estimatedMinutes, 0);

  const handleMarkDone = useCallback((index: number) => {
    setDoneSet(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else {
        next.add(index);
        const action = stackActions[index];
        if (action?.skill) {
          addStudyMinutes(action.skill, action.estimatedMinutes ?? 5);
        }
      }
      return next;
    });
  }, [stackActions, addStudyMinutes]);

  const today = new Date().toLocaleDateString('ar-SA', { weekday: 'long', month: 'long', day: 'numeric' });
  const todayEN = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  // ── Skill list (core 6 only) ───────────────────────────────────
  const coreSkills: SkillKey[] = ['GRAMMATIK', 'WORTSCHATZ', 'HOEREN', 'SPRECHEN', 'LESEN', 'SCHREIBEN'];

  const avgMastery = Math.round(
    coreSkills.reduce((s, k) => s + skillMastery[k], 0) / coreSkills.length
  );

  return (
    <div className="space-y-5 animate-fadeIn max-w-3xl mx-auto" id="main-content">

      {/* ── Header ── */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest">{todayEN}</p>
          <h1 className="text-2xl font-black text-stone-900">
            {userName ? `مرحباً، ${userName}` : 'Learning OS'}
          </h1>
          <p className="text-xs text-stone-400" dir="rtl">{today}</p>
        </div>
        <div className="flex items-center gap-2">
          {learnerModel.studyStreak > 1 && (
            <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 rounded-xl px-3 py-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-black text-orange-700">{learnerModel.studyStreak}</span>
            </div>
          )}
          <div className="text-center bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
            <div className="text-lg font-black text-amber-900">{currentCEFR}</div>
            <div className="text-[10px] text-amber-600 font-bold">CURRENT</div>
          </div>
          <div className="text-center bg-stone-100 border border-stone-200 rounded-xl px-3 py-1.5">
            <div className="text-lg font-black text-stone-600">{targetCEFR}</div>
            <div className="text-[10px] text-stone-400 font-bold">TARGET</div>
          </div>
        </div>
      </div>

      {/* ── NEXT BEST ACTION ── */}
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
        <div className="rounded-3xl bg-gradient-to-br from-emerald-900 to-stone-900 p-6 text-center space-y-2">
          <div className="text-4xl">🎉</div>
          <h2 className="text-xl font-black text-white">All caught up!</h2>
          <p className="text-sm text-stone-400">Great work. Come back tomorrow for your next session.</p>
          <p className="text-sm text-stone-500" dir="rtl">عمل رائع! عد غداً للجلسة التالية.</p>
        </div>
      )}

      {/* ── TODAY'S STACK ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-stone-900">Today's Study Stack</h2>
            <p className="text-[11px] text-stone-400" dir="rtl">
              جلسة اليوم · {stackActions.reduce((s, a) => s + a.estimatedMinutes, 0)} دقيقة
            </p>
          </div>
          {totalDoneMinutes > 0 && (
            <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-black">{totalDoneMinutes} min done</span>
            </div>
          )}
        </div>

        {/* Progress bar across stack */}
        {stackActions.length > 0 && (
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(doneSet.size / stackActions.length) * 100}%` }}
            />
          </div>
        )}

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
              setActiveView={setActiveView}
            />
          ))}
        </div>

        {/* Method note */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-stone-700">Why this sequence?</p>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Input first (listening/reading) → Grammar (structured knowledge) → Output (speaking/writing).
                This mirrors natural language acquisition: comprehension before production.
                SRS reviews are always first because delayed review causes forgetting.
              </p>
              <p className="text-[11px] text-stone-400 leading-relaxed" dir="rtl">
                الاستماع/القراءة أولاً ← القواعد ← الإنتاج (تحدث/كتابة). هذا يعكس اكتساب اللغة الطبيعي.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SKILL RADAR ── */}
      <div className="paper-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-stone-900">Skill Mastery</h2>
            <p className="text-[11px] text-stone-400" dir="rtl">المهارات اللغوية</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-stone-900">{avgMastery}%</div>
            <div className="text-[10px] text-stone-400">Overall avg</div>
          </div>
        </div>
        <div className="space-y-3">
          {coreSkills.map(skill => (
            <SkillBar key={skill} skill={skill} mastery={skillMastery[skill]} />
          ))}
        </div>
        <button
          onClick={() => setActiveView('trackers')}
          className="flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-600 font-bold"
        >
          <TrendingUp className="w-3.5 h-3.5" />
          View detailed skill analytics
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* ── GOAL TRACKER ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Goal',
            labelAR: 'الهدف',
            value: goalLabel[goal]?.en ?? 'Learn German',
            icon: <Target className="w-4 h-4 text-amber-600" />,
            bg: 'bg-amber-50 border-amber-200',
          },
          {
            label: 'Est. Time',
            labelAR: 'الوقت المتوقع',
            value: paceEstimate,
            icon: <Clock className="w-4 h-4 text-blue-600" />,
            bg: 'bg-blue-50 border-blue-200',
          },
          {
            label: 'Daily Budget',
            labelAR: 'ميزانية يومية',
            value: `${dailyMinutes || 30} min`,
            icon: <Zap className="w-4 h-4 text-emerald-600" />,
            bg: 'bg-emerald-50 border-emerald-200',
          },
          {
            label: 'SRS Due',
            labelAR: 'بطاقات للمراجعة',
            value: `${srsStats.due} cards`,
            icon: <Brain className="w-4 h-4 text-purple-600" />,
            bg: 'bg-purple-50 border-purple-200',
          },
        ].map(item => (
          <div key={item.label} className={`rounded-2xl border p-3 space-y-1 ${item.bg}`}>
            <div className="flex items-center gap-1.5">
              {item.icon}
              <span className="text-[10px] font-black text-stone-500 uppercase tracking-wide">{item.label}</span>
            </div>
            <div className="text-sm font-black text-stone-900">{item.value}</div>
            <div className="text-[10px] text-stone-400" dir="rtl">{item.labelAR}</div>
          </div>
        ))}
      </div>

      {/* ── QUICK NAV ── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {([
          { view: 'vocabulary', label: 'SRS Cards', labelAR: 'المفردات', icon: <Brain className="w-4 h-4" /> },
          { view: 'grammar',    label: 'Grammar',   labelAR: 'القواعد',  icon: <BookOpen className="w-4 h-4" /> },
          { view: 'resources',  label: 'Resources', labelAR: 'الموارد',  icon: <Youtube className="w-4 h-4" /> },
          { view: 'missions',   label: 'Practice',  labelAR: 'التدريب',  icon: <Dumbbell className="w-4 h-4" /> },
          { view: 'curriculum', label: 'Roadmap',   labelAR: 'خارطة',    icon: <Target className="w-4 h-4" /> },
          { view: 'trackers',   label: 'Progress',  labelAR: 'التقدم',   icon: <BarChart2 className="w-4 h-4" /> },
        ] as const).map(item => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white border border-stone-200 hover:border-amber-300 hover:bg-amber-50 transition-all text-stone-600 hover:text-amber-800"
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>

      {/* ── RESOURCE HUB PREVIEW ── */}
      <div className="paper-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-stone-900">Top Resources for Your Level</h2>
          <button
            onClick={() => setActiveView('resources')}
            className="text-xs text-amber-700 hover:text-amber-600 font-bold flex items-center gap-1"
          >
            See all <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        {(() => {
          const skills: SkillType[] = ['GRAMMATIK', 'HOEREN', 'SPRECHEN'];
          return skills.map(st => {
            const { primary } = selectResourcesForSkill(CONTENT_DB, st, contentLevel, 'arabic');
            if (!primary) return null;
            return (
              <div key={st} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                {getResourceTypeIcon(primary)}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-stone-800 truncate">{primary.title}</p>
                  <p className="text-[10px] text-stone-400">{primary.channelOrAuthor} · {primary.durationMin}m</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {primary.language === 'AR' && (
                    <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold">عربي</span>
                  )}
                  <a
                    href={primary.type === 'VIDEO' ? buildYouTubeUrl(primary.resourceId) : primary.resourceId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-500 hover:text-amber-700 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          });
        })()}
      </div>

    </div>
  );
};
