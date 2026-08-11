/**
 * ══════════════════════════════════════════════════════════
 * ROADMAP GENERATION ENGINE
 * Pure TypeScript - no React, no UI.
 *
 * Takes: learner goal + current level + time budget
 * Returns: personalized phase sequence with best resources
 *
 * Philosophy (Master Directive):
 *   We do NOT own content. We ORCHESTRATE the best existing
 *   resources into an optimal learning sequence.
 * ══════════════════════════════════════════════════════════
 */

import type { CEFRLevel, SkillKey, GoalTrack } from '../types/learner';
import {
  CONTENT_DB,
  selectResourcesForSkill,
  type ContentSource,
  type SkillType,
} from '../data/contentRanking';

// ── Types ────────────────────────────────────────────────────────

export type SkillFocus = 'balanced' | 'speaking' | 'listening' | 'reading_writing';

export interface RoadmapInput {
  goal: GoalTrack;
  currentLevel: CEFRLevel;
  targetLevel: CEFRLevel;
  dailyMinutes: number;
  skillFocus: SkillFocus;
  userName: string;
}

export interface PhaseResource {
  role: 'primary' | 'secondary' | 'reference' | 'tool';
  source: ContentSource;
  why: string;          // justification - WHY this resource
  usageInstruction: string; // HOW to use it
  estimatedMinutes: number;
}

export interface WeeklyTemplate {
  monday: SessionTemplate[];
  tuesday: SessionTemplate[];
  wednesday: SessionTemplate[];
  thursday: SessionTemplate[];
  friday: SessionTemplate[];
  weekend: SessionTemplate[];
}

export interface SessionTemplate {
  skill: SkillKey;
  activityType: 'input' | 'output' | 'review' | 'grammar' | 'vocabulary';
  durationMin: number;
  description: string;
  descriptionAR: string;
}

export interface RoadmapPhase {
  id: string;
  phase: number;
  title: string;
  titleAR: string;
  cefr: CEFRLevel;
  durationWeeks: number;
  estimatedHours: number;
  focusSkills: SkillKey[];
  milestone: string;       // "By end of this phase you can..."
  milestoneAR: string;
  methodNote: string;      // WHY this phase exists in this sequence
  resources: PhaseResource[];
  weeklyTemplate: SessionTemplate[];
  auxiliaryTools: AuxiliaryToolRec[];
}

export interface AuxiliaryToolRec {
  name: string;
  nameAR: string;
  purpose: string;
  url?: string;
  isBuiltIn: boolean;     // true = available inside this app
  buildinView?: string;   // which view in the app
}

export interface GeneratedRoadmap {
  id: string;
  generatedAt: string;
  input: RoadmapInput;
  phases: RoadmapPhase[];
  totalWeeks: number;
  totalHours: number;
  goalSummary: string;
  goalSummaryAR: string;
  paceLabel: string;      // "Casual", "Regular", "Intensive", "Immersive"
  recommendedDailyMinutes: number;
}

// ── Constants ────────────────────────────────────────────────────

const CEFR_ORDER: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

function cefrIndex(l: CEFRLevel): number { return CEFR_ORDER.indexOf(l); }

function getPaceLabel(dailyMin: number): string {
  if (dailyMin < 25) return 'Casual (15-20 min/day)';
  if (dailyMin < 45) return 'Regular (30-40 min/day)';
  if (dailyMin < 80) return 'Intensive (60 min/day)';
  return 'Immersive (90+ min/day)';
}

// Weeks needed per CEFR level jump at different daily minute budgets
function weeksPerLevel(dailyMin: number): number {
  if (dailyMin < 25) return 10;
  if (dailyMin < 45) return 7;
  if (dailyMin < 80) return 5;
  return 3;
}

// ── Goal-to-skill-priority mapping ───────────────────────────────

const GOAL_SKILL_PRIORITY: Record<GoalTrack, SkillKey[]> = {
  TRAVEL:         ['HOEREN', 'SPRECHEN', 'WORTSCHATZ', 'GRAMMATIK', 'LESEN', 'SCHREIBEN', 'AUSSPRACHE', 'KULTURKOMPETENZ'],
  LIFE_IN_GERMANY:['HOEREN', 'SPRECHEN', 'GRAMMATIK', 'WORTSCHATZ', 'LESEN', 'SCHREIBEN', 'AUSSPRACHE', 'KULTURKOMPETENZ'],
  STUDY:          ['LESEN', 'SCHREIBEN', 'HOEREN', 'GRAMMATIK', 'WORTSCHATZ', 'SPRECHEN', 'AUSSPRACHE', 'KULTURKOMPETENZ'],
  CAREER:         ['SPRECHEN', 'SCHREIBEN', 'HOEREN', 'GRAMMATIK', 'WORTSCHATZ', 'LESEN', 'AUSSPRACHE', 'KULTURKOMPETENZ'],
  PROFESSIONAL:   ['SCHREIBEN', 'SPRECHEN', 'LESEN', 'GRAMMATIK', 'WORTSCHATZ', 'HOEREN', 'AUSSPRACHE', 'KULTURKOMPETENZ'],
};

// ── Phase Templates by CEFR ───────────────────────────────────────

interface PhaseTemplate {
  cefr: CEFRLevel;
  title: string;
  titleAR: string;
  milestoneTemplate: (goal: GoalTrack) => string;
  milestoneTemplateAR: (goal: GoalTrack) => string;
  methodNote: string;
  weeklyFocusSkills: SkillKey[];
  weeklyTemplate: SessionTemplate[];
  auxiliaryTools: AuxiliaryToolRec[];
}

const PHASE_TEMPLATES: PhaseTemplate[] = [
  {
    cefr: 'A1',
    title: 'Foundation - Survival German',
    titleAR: 'المرحلة الأولى - الألمانية للبقاء',
    milestoneTemplate: () =>
      'Introduce yourself, handle basic interactions, understand slow simple German speech.',
    milestoneTemplateAR: () =>
      'تستطيع تقديم نفسك، وإجراء محادثات أساسية، وفهم الجمل البسيطة.',
    methodNote:
      'A1 is about building the mental model of German. Focus on high-frequency patterns, not memorizing rules. ' +
      'Comprehensible input (understanding 80%+ of what you hear/read) is the fastest path at this stage.',
    weeklyFocusSkills: ['GRAMMATIK', 'WORTSCHATZ', 'HOEREN'],
    weeklyTemplate: [
      { skill: 'HOEREN',    activityType: 'input',      durationMin: 15, description: 'Structured listening: DW Nicos Weg episode', descriptionAR: 'استماع منظم: حلقة من برنامج Nicos Weg' },
      { skill: 'GRAMMATIK', activityType: 'grammar',    durationMin: 15, description: 'One grammar concept with Arabic explanation', descriptionAR: 'قاعدة واحدة مع شرح بالعربية' },
      { skill: 'WORTSCHATZ',activityType: 'vocabulary', durationMin: 10, description: 'SRS vocabulary review or 10 new words', descriptionAR: 'مراجعة المفردات أو تعلم 10 كلمات جديدة' },
      { skill: 'SPRECHEN',  activityType: 'output',     durationMin: 10, description: 'Shadowing: repeat after native speaker audio', descriptionAR: 'تقليد الصوت: كرر بعد المتحدث الأصلي' },
      { skill: 'SCHREIBEN', activityType: 'output',     durationMin: 10, description: 'Write 3-5 sentences using today\'s grammar', descriptionAR: 'اكتب 3-5 جمل باستخدام قاعدة اليوم' },
    ],
    auxiliaryTools: [
      { name: 'SRS Vocabulary Tracker', nameAR: 'بطاقات المفردات', purpose: 'Track and schedule vocabulary reviews', isBuiltIn: true, buildinView: 'vocabulary' },
      { name: 'Anki (Desktop/Mobile)', nameAR: 'تطبيق أنكي', purpose: 'The gold standard for spaced repetition. Use "German A1 Core" deck.', url: 'https://ankiweb.net', isBuiltIn: false },
      { name: 'Grammar Reference', nameAR: 'مرجع القواعد', purpose: 'Quick grammar lookup for Arabic speakers', isBuiltIn: true, buildinView: 'grammar' },
      { name: 'Slow German Podcast', nameAR: 'بودكاست الألمانية البطيئة', purpose: 'Comprehensible input at A1 speed', url: 'https://www.slowgerman.com', isBuiltIn: false },
    ],
  },
  {
    cefr: 'A2',
    title: 'Elementary - Daily Life German',
    titleAR: 'المرحلة الثانية - ألمانية الحياة اليومية',
    milestoneTemplate: () =>
      'Handle everyday situations: shopping, appointments, directions, simple conversations.',
    milestoneTemplateAR: () =>
      'تستطيع التعامل مع مواقف يومية: التسوق، المواعيد، الاتجاهات، والمحادثات البسيطة.',
    methodNote:
      'A2 shifts from recognition to production. You now need to start speaking and writing real German. ' +
      'Comprehensible input continues, but add structured output: writing short texts, guided speaking.',
    weeklyFocusSkills: ['HOEREN', 'SPRECHEN', 'LESEN'],
    weeklyTemplate: [
      { skill: 'HOEREN',    activityType: 'input',      durationMin: 20, description: 'Podcast or YouTube at natural pace with transcripts', descriptionAR: 'بودكاست أو يوتيوب بسرعة طبيعية مع النصوص' },
      { skill: 'LESEN',     activityType: 'input',      durationMin: 15, description: 'Graded reader or Deutsche Welle easy articles', descriptionAR: 'نصوص مستوى مبتدئ أو مقالات DW سهلة' },
      { skill: 'SPRECHEN',  activityType: 'output',     durationMin: 15, description: 'Language exchange (italki Community) or record yourself', descriptionAR: 'تبادل لغوي (italki) أو تسجيل نفسك' },
      { skill: 'SCHREIBEN', activityType: 'output',     durationMin: 15, description: 'Write a short journal entry or message (100+ words)', descriptionAR: 'اكتب يوميات قصيرة أو رسالة (100+ كلمة)' },
      { skill: 'WORTSCHATZ',activityType: 'vocabulary', durationMin: 10, description: 'SRS review + 10 thematic new words', descriptionAR: 'مراجعة SRS + 10 كلمات جديدة موضوعية' },
    ],
    auxiliaryTools: [
      { name: 'SRS Vocabulary Tracker', nameAR: 'بطاقات المفردات', purpose: 'Continue SRS reviews daily', isBuiltIn: true, buildinView: 'vocabulary' },
      { name: 'italki Community', nameAR: 'مجتمع إيتالكي', purpose: 'Free language exchange with native German speakers', url: 'https://italki.com/community', isBuiltIn: false },
      { name: 'LanguageTool', nameAR: 'LanguageTool', purpose: 'Grammar checker for your German writing', url: 'https://languagetool.org', isBuiltIn: false },
      { name: 'DW Top-Thema', nameAR: 'DW Top-Thema', purpose: 'Graded articles with audio and exercises', url: 'https://www.dw.com/de/deutsch-lernen/top-thema/s-8031', isBuiltIn: false },
    ],
  },
  {
    cefr: 'B1',
    title: 'Intermediate - Independent Communication',
    titleAR: 'المرحلة الثالثة - التواصل المستقل',
    milestoneTemplate: (goal: GoalTrack) => {
      if (goal === 'STUDY') return 'Follow university lectures, write academic emails, discuss topics in your field.';
      if (goal === 'CAREER') return 'Participate in meetings, write professional emails, handle work situations.';
      return 'Discuss most everyday topics, understand main points of complex German, write clear texts.';
    },
    milestoneTemplateAR: (goal: GoalTrack) => {
      if (goal === 'STUDY') return 'تتابع محاضرات جامعية، تكتب رسائل أكاديمية، وتناقش موضوعات في مجالك.';
      if (goal === 'CAREER') return 'تشارك في اجتماعات، تكتب رسائل مهنية، وتتعامل مع مواقف العمل.';
      return 'تناقش معظم المواضيع اليومية وتفهم النقاط الرئيسية للألمانية المعقدة.';
    },
    methodNote:
      'B1 requires massive comprehensible input: podcasts, YouTube, news. ' +
      'Output becomes critical: speaking with natives, writing regularly. ' +
      'Grammar at this level is about refinement, not new rules - use errors as a learning signal.',
    weeklyFocusSkills: ['SPRECHEN', 'SCHREIBEN', 'HOEREN'],
    weeklyTemplate: [
      { skill: 'HOEREN',    activityType: 'input',      durationMin: 25, description: 'Authentic German podcast/YouTube (no subtitles)', descriptionAR: 'بودكاست/يوتيوب ألماني أصيل (بدون ترجمة)' },
      { skill: 'LESEN',     activityType: 'input',      durationMin: 20, description: 'Authentic German news (Der Spiegel, Zeit Campus)', descriptionAR: 'أخبار ألمانية أصيلة (Spiegel, Zeit)' },
      { skill: 'SPRECHEN',  activityType: 'output',     durationMin: 30, description: 'Conversation session with native tutor or tandem partner', descriptionAR: 'جلسة محادثة مع معلم أصلي أو شريك تعلم' },
      { skill: 'SCHREIBEN', activityType: 'output',     durationMin: 20, description: 'Write an essay or structured text (200+ words)', descriptionAR: 'اكتب مقالاً أو نصاً منظماً (200+ كلمة)' },
      { skill: 'WORTSCHATZ',activityType: 'vocabulary', durationMin: 10, description: 'SRS review + topic-based vocabulary expansion', descriptionAR: 'مراجعة SRS + توسيع المفردات الموضوعية' },
    ],
    auxiliaryTools: [
      { name: 'italki Tutors', nameAR: 'معلمو إيتالكي', purpose: 'Paid tutors for structured speaking practice (budget: $5-15/hr)', url: 'https://italki.com', isBuiltIn: false },
      { name: 'SRS Vocabulary Tracker', nameAR: 'بطاقات المفردات', purpose: 'Daily SRS reviews - critical at B1+', isBuiltIn: true, buildinView: 'vocabulary' },
      { name: 'Easy German Podcast', nameAR: 'بودكاست ألمانية سهلة', purpose: 'Native-speed German with subtitles + community', url: 'https://www.easygerman.org', isBuiltIn: false },
      { name: 'Goethe B1 Preparation', nameAR: 'تحضير Goethe B1', purpose: 'Official exam materials from Goethe Institut', url: 'https://www.goethe.de/en/spr/kup/prf/prf/gb1.html', isBuiltIn: false },
    ],
  },
];

// ── Resource selection for a phase ───────────────────────────────

function selectPhaseResources(
  cefr: CEFRLevel,
  focusSkills: SkillKey[],
): PhaseResource[] {
  const resources: PhaseResource[] = [];
  const usedIds = new Set<string>();

  const skillTypeMap: Partial<Record<SkillKey, SkillType>> = {
    HOEREN: 'HOEREN',
    SPRECHEN: 'SPRECHEN',
    LESEN: 'LESEN',
    SCHREIBEN: 'SCHREIBEN',
    GRAMMATIK: 'GRAMMATIK',
    WORTSCHATZ: 'VOCAB',
  };

  const cefrMap: Record<string, 'A1' | 'A2' | 'B1' | 'ALL'> = {
    A1: 'A1', A2: 'A2', B1: 'B1', B2: 'B1', C1: 'B1', C2: 'B1',
  };

  for (const skill of focusSkills.slice(0, 3)) {
    const st = skillTypeMap[skill];
    if (!st) continue;
    const { primary, secondary } = selectResourcesForSkill(
      CONTENT_DB,
      st,
      cefrMap[cefr] ?? 'A1',
      'arabic',
    );

    if (primary && !usedIds.has(primary.id)) {
      usedIds.add(primary.id);
      resources.push({
        role: 'primary',
        source: primary,
        why: `Highest-ranked ${skill.toLowerCase()} resource for ${cefr} Arabic learners (score: ${primary.rankScore ?? '-'}/100). ${
          primary.language === 'AR'
            ? 'Arabic-first instruction reduces cognitive load.'
            : primary.channelOrAuthor.includes('DW')
              ? 'Deutsche Welle is an official, Goethe-verified resource.'
              : 'Top-ranked by view count, community recommendations, and content quality.'
        }`,
        usageInstruction: `Watch/use this resource. Take notes in Arabic first, then translate key points to German. Do the accompanying exercises if available.`,
        estimatedMinutes: primary.durationMin ?? 20,
      });
    }

    for (const sec of secondary) {
      if (!usedIds.has(sec.id)) {
        usedIds.add(sec.id);
        resources.push({
          role: 'secondary',
          source: sec,
          why: `Strong alternative for ${skill.toLowerCase()} - use when you want a different angle or have already mastered the primary.`,
          usageInstruction: 'Use as a complement to the primary resource, not a replacement.',
          estimatedMinutes: sec.durationMin ?? 15,
        });
        break; // one secondary per skill
      }
    }
  }

  return resources;
}

// ── Main Generator ───────────────────────────────────────────────

export function generateRoadmap(input: RoadmapInput): GeneratedRoadmap {
  const { goal, currentLevel, targetLevel, dailyMinutes, skillFocus } = input;

  const startIdx = cefrIndex(currentLevel);
  const endIdx   = cefrIndex(targetLevel);
  const levelsToAdvance = Math.max(1, endIdx - startIdx);

  const weeks = weeksPerLevel(dailyMinutes);
  const skillPriority = GOAL_SKILL_PRIORITY[goal] ?? GOAL_SKILL_PRIORITY.LIFE_IN_GERMANY;

  // Apply skill-focus override
  if (skillFocus !== 'balanced') {
    const focusMap: Record<string, SkillKey[]> = {
      speaking:       ['SPRECHEN', 'AUSSPRACHE', 'HOEREN', 'GRAMMATIK', 'WORTSCHATZ', 'LESEN', 'SCHREIBEN', 'KULTURKOMPETENZ'],
      listening:      ['HOEREN', 'SPRECHEN', 'GRAMMATIK', 'WORTSCHATZ', 'LESEN', 'SCHREIBEN', 'AUSSPRACHE', 'KULTURKOMPETENZ'],
      reading_writing:['LESEN', 'SCHREIBEN', 'GRAMMATIK', 'WORTSCHATZ', 'HOEREN', 'SPRECHEN', 'AUSSPRACHE', 'KULTURKOMPETENZ'],
    };
    skillPriority.splice(0, skillPriority.length, ...(focusMap[skillFocus] ?? skillPriority));
  }

  const phases: RoadmapPhase[] = [];

  for (let i = 0; i < levelsToAdvance; i++) {
    const phaseCEFR = CEFR_ORDER[startIdx + i];
    if (!phaseCEFR) break;

    const template = PHASE_TEMPLATES.find(t => t.cefr === phaseCEFR)
      ?? PHASE_TEMPLATES[PHASE_TEMPLATES.length - 1];

    const phaseResources = selectPhaseResources(phaseCEFR, skillPriority);
    const phaseHours = Math.round((weeks * 7 * dailyMinutes) / 60);

    phases.push({
      id: `phase-${phaseCEFR.toLowerCase()}-${i}`,
      phase: i + 1,
      title: template.title,
      titleAR: template.titleAR,
      cefr: phaseCEFR,
      durationWeeks: weeks,
      estimatedHours: phaseHours,
      focusSkills: skillPriority.slice(0, 4),
      milestone: template.milestoneTemplate(goal),
      milestoneAR: template.milestoneTemplateAR(goal),
      methodNote: template.methodNote,
      resources: phaseResources,
      weeklyTemplate: template.weeklyTemplate,
      auxiliaryTools: template.auxiliaryTools,
    });
  }

  const totalWeeks = phases.reduce((s, p) => s + p.durationWeeks, 0);
  const totalHours = phases.reduce((s, p) => s + p.estimatedHours, 0);

  const goalLabels: Record<GoalTrack, { en: string; ar: string }> = {
    TRAVEL:         { en: 'Travel to German-speaking countries', ar: 'السفر إلى البلدان الناطقة بالألمانية' },
    LIFE_IN_GERMANY:{ en: 'Live and integrate in Germany', ar: 'العيش والاندماج في ألمانيا' },
    STUDY:          { en: 'Study at a German university', ar: 'الدراسة في جامعة ألمانية' },
    CAREER:         { en: 'Work professionally in German', ar: 'العمل باحترافية باللغة الألمانية' },
    PROFESSIONAL:   { en: 'Achieve professional-level German', ar: 'بلوغ مستوى احترافي في الألمانية' },
  };

  return {
    id: `roadmap-${Date.now()}`,
    generatedAt: new Date().toISOString(),
    input,
    phases,
    totalWeeks,
    totalHours,
    goalSummary: `${currentLevel} → ${targetLevel} for ${goalLabels[goal]?.en ?? 'German proficiency'}`,
    goalSummaryAR: `${currentLevel} ← ${targetLevel} لهدف: ${goalLabels[goal]?.ar ?? 'إتقان الألمانية'}`,
    paceLabel: getPaceLabel(dailyMinutes),
    recommendedDailyMinutes: dailyMinutes,
  };
}

/**
 * Get the single best resource recommendation for a skill+level.
 * Used by the NBA engine on the dashboard.
 */
export function getBestResourceForSkill(
  skill: SkillType,
  level: 'A1' | 'A2' | 'B1' | 'ALL',
): ContentSource | null {
  return selectResourcesForSkill(CONTENT_DB, skill, level, 'arabic').primary;
}
