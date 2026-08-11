/**
 * ══════════════════════════════════════════════════════════
 * LEARNER MODEL TYPES
 * The data model that drives ALL personalization decisions.
 * ══════════════════════════════════════════════════════════
 */

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type SkillKey = 'HOEREN' | 'SPRECHEN' | 'LESEN' | 'SCHREIBEN' | 'GRAMMATIK' | 'WORTSCHATZ' | 'AUSSPRACHE' | 'KULTURKOMPETENZ';

/** 0-100 mastery score per skill. 100 = complete mastery at current level. */
export type SkillMastery = Record<SkillKey, number>;

/** CEFR estimate per skill - a learner may be B1 in Grammar but A2 in Listening. */
export type SkillCEFR = Record<SkillKey, CEFRLevel>;

export interface CEFREstimate {
  overall: CEFRLevel;
  perSkill: SkillCEFR;
  confidence: number;       // 0-1: how confident we are in this estimate
  lastAssessed: string;     // ISO date
}

export type SRSCardState = 'NEW' | 'LEARNING' | 'REVIEW' | 'MATURE' | 'SUSPENDED';

/** SM-2 Spaced Repetition Card for a vocabulary item */
export interface SRSCard {
  wordId: string;           // references VocabWord.id
  state: SRSCardState;
  easeFactor: number;       // SM-2: starts at 2.5
  interval: number;         // days until next review
  repetitions: number;      // consecutive successful reviews
  nextReviewDate: string;   // ISO date
  lastReviewDate?: string;
  lapses: number;           // times the card was forgotten
  averageResponseMs?: number;
}

export type ErrorType =
  | 'gender' | 'case' | 'word_order' | 'verb_position' | 'articles'
  | 'pronunciation' | 'plural' | 'negation' | 'prepositions'
  | 'adjective_endings' | 'verb_conjugation' | 'separable_verbs'
  | 'modal_verbs' | 'tense_selection' | 'subordinate_clause';

/** A logged mistake made by the learner */
export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  errorType: ErrorType;
  conceptId?: string;       // which grammar concept it relates to
  wrongAnswer: string;
  correctAnswer: string;
  context?: string;         // the sentence/task
}

export type GoalTrack = 'LIFE_IN_GERMANY' | 'STUDY' | 'CAREER' | 'TRAVEL' | 'PROFESSIONAL';
export type ProfessionalField = 'MEDIZIN' | 'INFORMATIK' | 'INGENIEURWESEN' | 'WIRTSCHAFT' | 'RECHT' | 'FORSCHUNG' | 'PFLEGE' | 'SONSTIGE';

export interface GoalProfile {
  track: GoalTrack;
  targetCEFR: CEFRLevel;
  targetDate?: string;      // ISO date
  weeklyHours: number;
  professionalField?: ProfessionalField;
  country?: string;
  reason?: string;          // free text: "I want to study at FAU Erlangen"
}

/** The complete learner model - persisted in localStorage */
export interface LearnerModel {
  id: string;               // generated UUID
  name: string;
  createdAt: string;
  lastActiveAt: string;

  // ── Skill Tracking ──
  skillMastery: SkillMastery;
  cefrEstimate: CEFREstimate;

  // ── Vocabulary SRS ──
  srsCards: Record<string, SRSCard>;   // wordId → card
  totalWordsLearned: number;
  activeVocabularySize: number;

  // ── Grammar Mastery ──
  conceptMastery: Record<string, number>;  // conceptId → 0-100

  // ── Error Intelligence ──
  errorLog: ErrorLogEntry[];
  errorFrequency: Partial<Record<ErrorType, number>>;
  weakConcepts: string[];   // concept IDs with mastery < 40

  // ── Goals ──
  goalProfile: GoalProfile;

  // ── Study Analytics ──
  totalStudyMinutes: number;
  studyStreak: number;
  lastStudyDate: string;
  studyMinutesBySkill: Partial<Record<SkillKey, number>>;

  // ── Completed Missions ──
  completedMissions: string[];
  activeMissionId?: string;

  // ── Assessment History ──
  assessmentHistory: AssessmentResult[];
}

export interface AssessmentResult {
  date: string;
  weekNumber: number;
  trackId: string;
  score: number;
  total: number;
  percent: number;
  flaggedConcepts: string[];
  estimatedCEFR?: CEFRLevel;
}

/** Recommended next action for the learner */
export interface NextAction {
  type: 'SRS_REVIEW' | 'GRAMMAR_CONCEPT' | 'LISTENING' | 'SPEAKING' | 'READING' | 'WRITING' | 'MISSION' | 'ASSESSMENT' | 'VOCABULARY_STUDY';
  priority: number;         // 1 = highest
  title: string;
  titleAR: string;
  description: string;
  reason: string;           // why this action was recommended
  estimatedMinutes: number;
  resourceId?: string;      // videoId, conceptId, missionId, etc.
  skill?: SkillKey;
}

export const DEFAULT_SKILL_MASTERY: SkillMastery = {
  HOEREN:          0,
  SPRECHEN:        0,
  LESEN:           0,
  SCHREIBEN:       0,
  GRAMMATIK:       0,
  WORTSCHATZ:      0,
  AUSSPRACHE:      0,
  KULTURKOMPETENZ: 0,
};

export const DEFAULT_SKILL_CEFR: SkillCEFR = {
  HOEREN:          'A1',
  SPRECHEN:        'A1',
  LESEN:           'A1',
  SCHREIBEN:       'A1',
  GRAMMATIK:       'A1',
  WORTSCHATZ:      'A1',
  AUSSPRACHE:      'A1',
  KULTURKOMPETENZ: 'A1',
};

export const SKILL_LABELS: Record<SkillKey, { de: string; ar: string; en: string }> = {
  HOEREN:          { de: 'Hören',          ar: 'الاستماع',    en: 'Listening'    },
  SPRECHEN:        { de: 'Sprechen',       ar: 'التحدث',      en: 'Speaking'     },
  LESEN:           { de: 'Lesen',          ar: 'القراءة',     en: 'Reading'      },
  SCHREIBEN:       { de: 'Schreiben',      ar: 'الكتابة',     en: 'Writing'      },
  GRAMMATIK:       { de: 'Grammatik',      ar: 'القواعد',     en: 'Grammar'      },
  WORTSCHATZ:      { de: 'Wortschatz',     ar: 'المفردات',    en: 'Vocabulary'   },
  AUSSPRACHE:      { de: 'Aussprache',     ar: 'النطق',       en: 'Pronunciation'},
  KULTURKOMPETENZ: { de: 'Kulturkompetenz',ar: 'الكفاءة الثقافية', en: 'Cultural Competence' },
};
