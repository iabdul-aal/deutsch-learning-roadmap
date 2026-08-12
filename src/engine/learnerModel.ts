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
      title: `Review ${reviewCards.length} Due Words`,
      titleAR: `مراجعة ${reviewCards.length} كلمة متأخرة`,
      description: `You have ${reviewCards.length} vocabulary cards due for review. Reviewing now prevents forgetting.`,
      reason: 'Spaced repetition: reviewing now maximizes long-term retention.',
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
    actions.push({
      type: skillMap[weakest],
      priority: 2,
      title: `Strengthen Your ${weakest.charAt(0) + weakest.slice(1).toLowerCase()}`,
      titleAR: `تقوية مهارة ${getArabicSkillName(weakest)}`,
      description: `Your ${weakest.toLowerCase()} is your current bottleneck at ${weakestMastery}% mastery.`,
      reason: `Weakest skill (${weakestMastery}% mastery) - improving this unlocks your overall CEFR level.`,
      estimatedMinutes: 20,
      skill: weakest,
    });
  }

  // 3. Weak concepts to review
  if (learner.weakConcepts.length > 0) {
    actions.push({
      type: 'GRAMMAR_CONCEPT',
      priority: 3,
      title: 'Revisit Grammar Weak Points',
      titleAR: 'مراجعة نقاط ضعف القواعد',
      description: `${learner.weakConcepts.length} grammar concepts need reinforcement.`,
      reason: 'Error pattern analysis detected recurring mistakes in these areas.',
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
      title: 'Start a Real-World Mission',
      titleAR: 'ابدأ مهمة حياتية',
      description: 'Apply your German in realistic scenarios (renting a flat, doctor visit, workplace).',
      reason: 'Real-world practice converts passive knowledge into active skill.',
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
      description: 'Expand your active vocabulary with today\'s new words.',
      reason: `${stats.new} words waiting to be learned in your deck.`,
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
