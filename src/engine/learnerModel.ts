/**
 * ══════════════════════════════════════════════════════════
 * LEARNER MODEL ENGINE
 * CEFR estimation, skill gap analysis, mastery computation.
 * Pure TypeScript - no React.
 * ══════════════════════════════════════════════════════════
 */

import type {
  LearnerModel, SkillKey, CEFRLevel, SkillMastery, CEFREstimate,
  SkillCEFR, NextAction, ErrorType, GoalProfile,
  DEUniversityLT_SKILL_MASTERY, DEUniversityLT_SKILL_CEFR
} from '../types/learner';
import {
  DEUniversityLT_SKILL_MASTERY as DSM,
  DEUniversityLT_SKILL_CEFR as DSC
} from '../types/learner';
import { getDeckStats, getDueCards } from './srs';

// ── CEFR Thresholds ──────────────────────────────────────────────
// Mastery score → CEFR level mapping per skill
const CEFR_THRESHOLDS: Record<CEFRLevel, number> = {
  A1: 0,
  A2: 20,
  B1: 40,
  B2: 60,
  C1: 80,
  C2: 95,
};

const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export function masteryToCEFR(mastery: number): CEFRLevel {
  let level: CEFRLevel = 'A1';
  for (const [lvl, threshold] of Object.entries(CEFR_THRESHOLDS)) {
    if (mastery >= threshold) level = lvl as CEFRLevel;
  }
  return level;
}

export function cefrToMinMastery(level: CEFRLevel): number {
  return CEFR_THRESHOLDS[level];
}

export function cefrIndex(level: CEFRLevel): number {
  return CEFR_ORDER.indexOf(level);
}

/** Compute per-skill CEFR from mastery scores */
export function estimateCEFRPerSkill(mastery: SkillMastery): SkillCEFR {
  const result = { ...DSC };
  for (const key of Object.keys(mastery) as SkillKey[]) {
    result[key] = masteryToCEFR(mastery[key]);
  }
  return result;
}

/** Overall CEFR = minimum of all core skills (weakest link) */
export function estimateOverallCEFR(perSkill: SkillCEFR): CEFRLevel {
  const coreSkills: SkillKey[] = ['HOEREN', 'SPRECHEN', 'LESEN', 'SCHREIBEN', 'GRAMMATIK', 'WORTSCHATZ'];
  const indices = coreSkills.map(k => cefrIndex(perSkill[k]));
  const minIndex = Math.min(...indices);
  return CEFR_ORDER[minIndex];
}

/** Full CEFR estimate from learner model */
export function computeCEFREstimate(mastery: SkillMastery): CEFREstimate {
  const perSkill = estimateCEFRPerSkill(mastery);
  const overall = estimateOverallCEFR(perSkill);
  // Confidence: higher when skills are balanced
  const indices = Object.values(perSkill).map(lvl => cefrIndex(lvl));
  const variance = indices.reduce((v, i) => v + Math.pow(i - (indices.reduce((a,b) => a+b,0)/indices.length), 2), 0) / indices.length;
  const confidence = Math.max(0.3, 1 - variance / 10);
  return { overall, perSkill, confidence, lastAssessed: new Date().toISOString() };
}

// ── Skill Gap Analysis ────────────────────────────────────────────
export interface SkillGap {
  skill: SkillKey;
  currentMastery: number;
  targetMastery: number;
  gap: number;
  priority: number;  // 1 = most urgent
}

/** Find the skills most in need of practice */
export function getSkillGaps(mastery: SkillMastery, targetCEFR: CEFRLevel): SkillGap[] {
  const targetMastery = cefrToMinMastery(targetCEFR);
  return (Object.keys(mastery) as SkillKey[])
    .map(skill => ({
      skill,
      currentMastery: mastery[skill],
      targetMastery,
      gap: Math.max(0, targetMastery - mastery[skill]),
      priority: 0,
    }))
    .filter(g => g.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .map((g, i) => ({ ...g, priority: i + 1 }));
}

/** Return weakest skill key (lowest mastery score) */
export function getWeakestSkill(mastery: SkillMastery): SkillKey {
  return (Object.entries(mastery) as [SkillKey, number][])
    .sort(([, a], [, b]) => a - b)[0][0];
}

const SKILL_READABLE_NAMES: Record<SkillKey, { en: string; ar: string }> = {
  HOEREN:          { en: 'Listening Skills',      ar: 'مهارة الاستماع' },
  SPRECHEN:        { en: 'Speaking Skills',       ar: 'مهارة التحدث' },
  LESEN:           { en: 'Reading Comprehension', ar: 'مهارة القراءة' },
  SCHREIBEN:       { en: 'Writing Practice',      ar: 'مهارة الكتابة' },
  GRAMMATIK:       { en: 'German Grammar',        ar: 'قواعد اللغة' },
  WORTSCHATZ:      { en: 'Vocabulary Building',   ar: 'بناء المفردات' },
  AUSSPRACHE:      { en: 'Pronunciation',         ar: 'النطق الصحيح' },
  KULTURKOMPETENZ: { en: 'Cultural Knowledge',    ar: 'الثقافة الألمانية' },
};

// ── Next Best Action ────────────────────────────────────────────
export function computeNextActions(learner: LearnerModel): NextAction[] {
  const actions: NextAction[] = [];

  // 1. SRS reviews due (highest urgency)
  const due = getDueCards(learner.srsCards);
  const reviewCards = due.filter(c => c.state !== 'NEW');
  if (reviewCards.length > 0) {
    actions.push({
      type: 'SRS_REVIEW',
      priority: 1,
      title: `Review ${reviewCards.length} Due Word${reviewCards.length === 1 ? '' : 's'}`,
      titleAR: `مراجعة ${reviewCards.length} كلمة`,
      description: `You have ${reviewCards.length} word${reviewCards.length === 1 ? '' : 's'} ready to review — catch them now before they start to fade.`,
      reason: 'Best to review words while they\'re still fresh. Waiting too long means starting from scratch.',
      estimatedMinutes: Math.ceil(reviewCards.length * 0.5),
      skill: 'WORTSCHATZ',
    });
  }

  // 2. Weakest skill
  const weakest = getWeakestSkill(learner.skillMastery);
  const weakestMastery = learner.skillMastery[weakest];
  if (weakestMastery < 80) {
    const skillMap: Record<SkillKey, NextAction['type']> = {
      HOEREN: 'LISTENING', SPRECHEN: 'SPEAKING', LESEN: 'READING',
      SCHREIBEN: 'WRITING', GRAMMATIK: 'GRAMMAR_CONCEPT',
      WORTSCHATZ: 'VOCABULARY_STUDY', AUSSPRACHE: 'SPEAKING',
      KULTURKOMPETENZ: 'READING',
    };
    const readable = SKILL_READABLE_NAMES[weakest] || { en: weakest, ar: getArabicSkillName(weakest) };
    actions.push({
      type: skillMap[weakest],
      priority: 2,
      title: `Work on Your ${readable.en}`,
      titleAR: `تطوير ${readable.ar}`,
      description: `Your ${readable.en.toLowerCase()} is where you'll grow the fastest right now — even short focused sessions here make a big difference.`,
      reason: `This is your weakest area at the moment. A quick session here will lift everything else faster than practicing what you're already good at.`,
      estimatedMinutes: 20,
      skill: weakest,
    });
  }

  // 3. Weak concepts to review
  if (learner.weakConcepts.length > 0) {
    actions.push({
      type: 'GRAMMAR_CONCEPT',
      priority: 3,
      title: 'Revisit Some Grammar',
      titleAR: 'مراجعة بعض القواعد',
      description: `You've stumbled on ${learner.weakConcepts.length} grammar point${learner.weakConcepts.length === 1 ? '' : 's'} before — a quick revisit now will make them stick for good.`,
      reason: 'These are spots where you\'ve made the same slip more than once. Five minutes now saves a lot of frustration later.',
      estimatedMinutes: 15,
      skill: 'GRAMMATIK',
      resourceId: learner.weakConcepts[0],
    });
  }

  // 4. Mission (if none active and learner has some mastery)
  const overallMastery = Object.values(learner.skillMastery).reduce((a, b) => a + b, 0) / 8;
  if (!learner.activeMissionId && overallMastery > 15) {
    actions.push({
      type: 'MISSION',
      priority: 4,
      title: 'Try a Real-World Mission',
      titleAR: 'جرّب مهمة من الحياة الحقيقية',
      description: 'Use your German in a real situation — renting a flat, a doctor\'s appointment, a work email. This is where it all clicks.',
      reason: 'You know enough to try the real thing. Missions turn what you\'ve learned into actual language you can use.',
      estimatedMinutes: 25,
    });
  }

  // 5. New vocabulary
  const stats = getDeckStats(learner.srsCards);
  if (stats.new > 0 && reviewCards.length === 0) {
    actions.push({
      type: 'VOCABULARY_STUDY',
      priority: actions.length + 1,
      title: `Learn ${Math.min(10, stats.new)} New Words`,
      titleAR: `تعلم ${Math.min(10, stats.new)} كلمة جديدة`,
      description: 'Pick up a few new words today — they add up faster than you think.',
      reason: `You have ${stats.new} new words waiting. Learning a handful a day is how vocabulary really grows.`,
      estimatedMinutes: 15,
      skill: 'WORTSCHATZ',
    });
  }

  return actions.sort((a, b) => a.priority - b.priority);
}

function getArabicSkillName(skill: SkillKey): string {
  const names: Record<SkillKey, string> = {
    HOEREN: 'الاستماع', SPRECHEN: 'التحدث', LESEN: 'القراءة',
    SCHREIBEN: 'الكتابة', GRAMMATIK: 'القواعد', WORTSCHATZ: 'المفردات',
    AUSSPRACHE: 'النطق', KULTURKOMPETENZ: 'الكفاءة الثقافية',
  };
  return names[skill];
}

// ── Error Intelligence ───────────────────────────────────────────
export function getTopErrors(learner: LearnerModel, limit = 5): Array<[ErrorType, number]> {
  return Object.entries(learner.errorFrequency)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .slice(0, limit) as Array<[ErrorType, number]>;
}

/** Update mastery score based on a quiz result (0-100) */
export function updateSkillMastery(
  current: number,
  score: number,  // 0-100
  weight = 0.3    // how much this review affects the mastery score
): number {
  const updated = current * (1 - weight) + score * weight;
  return Math.max(0, Math.min(100, Math.round(updated)));
}

/** Create a fresh LearnerModel */
export function createLearnerModel(name: string, goal: GoalProfile): LearnerModel {
  return {
    id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
    name,
    createdAt: new Date().toISOString(),
    lastActiveAt: new Date().toISOString(),
    skillMastery: { ...DSM },
    cefrEstimate: {
      overall: 'A1',
      perSkill: { ...DSC },
      confidence: 0.5,
      lastAssessed: new Date().toISOString(),
    },
    srsCards: {},
    totalWordsLearned: 0,
    activeVocabularySize: 0,
    conceptMastery: {},
    errorLog: [],
    errorFrequency: {},
    weakConcepts: [],
    goalProfile: goal,
    totalStudyMinutes: 0,
    studyStreak: 0,
    lastStudyDate: '',
    studyMinutesBySkill: {},
    completedMissions: [],
    assessmentHistory: [],
  };
}
