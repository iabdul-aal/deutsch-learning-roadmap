/**
 * OnboardingFlow.tsx
 *
 * Two modes:
 * ① FAST START (Semi-Custom) — 4 card-selection steps, ~60 seconds
 * ② FULL DIAGNOSTIC — placement test + skills self-assessment, ~15 min
 *
 * Both modes output a GoalProfile + initial skill mastery estimate
 * that seed the learner model and generate the first roadmap.
 */

import React, { useState, useCallback } from 'react';
import {
  ArrowRight, ArrowLeft, Zap, ClipboardList, Check, ChevronRight,
  GraduationCap, Briefcase, Globe, Flag, Star, Clock, BookOpen,
  Mic, Headphones, PenLine, Brain, Trophy, AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateRoadmap } from '../engine/roadmap';
import type { GoalTrack, CEFRLevel, SkillKey, SkillMastery } from '../types/learner';
import type { SkillFocus } from '../engine/roadmap';

// ── Types ─────────────────────────────────────────────────────────

type OnboardingMode = 'choose' | 'fast' | 'diagnostic';

interface FastStartData {
  name: string;
  goal: GoalTrack;
  currentLevel: CEFRLevel;
  dailyMinutes: number;
  skillFocus: SkillFocus;
}

interface DiagnosticData extends FastStartData {
  englishLevel: 'basic' | 'intermediate' | 'fluent';
  previousStudyMonths: number;
  targetLevel: CEFRLevel;
  selfRating: Partial<Record<SkillKey, number>>; // 0–5
  quizAnswers: number[]; // answers to placement questions
}

// ── Placement Quiz Questions (A1–B1) ─────────────────────────────

interface QuizQuestion {
  id: number;
  level: 'A1' | 'A2' | 'B1';
  question: string;
  questionAR: string;
  options: string[];
  correct: number;
  explanation: string;
}

const PLACEMENT_QUIZ: QuizQuestion[] = [
  {
    id: 1, level: 'A1',
    question: 'Choose the correct article: ___ Tisch (table)',
    questionAR: 'اختر المقال الصحيح: ___ Tisch (طاولة)',
    options: ['der', 'die', 'das', 'den'],
    correct: 0,
    explanation: 'Der Tisch — masculine noun. Most furniture is masculine.',
  },
  {
    id: 2, level: 'A1',
    question: 'Where does the verb go? "Ich ___ aus Ägypten." (come)',
    questionAR: 'أين يذهب الفعل؟ "أنا ___ من مصر." (أتي)',
    options: ['komme', 'kommen', 'kommt', 'kommst'],
    correct: 0,
    explanation: '"Ich komme" — verb conjugated for "ich" (I).',
  },
  {
    id: 3, level: 'A1',
    question: 'Which is correct German word order?',
    questionAR: 'أي ترتيب كلمات ألماني صحيح؟',
    options: [
      'Ich heute gehe ins Kino.',
      'Ich gehe heute ins Kino.',
      'Heute ich gehe ins Kino.',
      'Gehe ich heute ins Kino.',
    ],
    correct: 1,
    explanation: 'German verb-second rule: the verb must be in position 2.',
  },
  {
    id: 4, level: 'A1',
    question: '"Ich habe ___ Bruder." (I have a brother) — accusative article:',
    questionAR: '"لدي أخ" — ما المقال الصحيح في حالة المفعول به؟',
    options: ['ein', 'einen', 'einem', 'einer'],
    correct: 1,
    explanation: 'Masculine noun in accusative: ein → einen.',
  },
  {
    id: 5, level: 'A2',
    question: 'Complete: "Er ___ gestern ins Kino gegangen." (went)',
    questionAR: 'أكمل الجملة: "هو ___ إلى السينما أمس."',
    options: ['hat', 'ist', 'war', 'hatte'],
    correct: 1,
    explanation: '"gehen" (to go) uses "sein" as auxiliary in Perfekt: ist gegangen.',
  },
  {
    id: 6, level: 'A2',
    question: 'Which preposition uses dative ONLY?',
    questionAR: 'أي حرف جر يستخدم حالة المجرور فقط؟',
    options: ['in', 'an', 'mit', 'auf'],
    correct: 2,
    explanation: '"mit" always takes dative. "in, an, auf" are two-way prepositions.',
  },
  {
    id: 7, level: 'A2',
    question: '"Weil ich ___ bin, bleibe ich zu Hause." (tired)',
    questionAR: '"لأنني ___ أبقى في البيت."',
    options: [
      'müde, bleibe ich zu Hause.',
      'müde bin, bleibe ich zu Hause.',
      'bin müde, bleibe ich zu Hause.',
      'müde, ich bleibe zu Hause.',
    ],
    correct: 1,
    explanation: 'In subordinate clauses (weil, dass, weil), the verb goes to the END.',
  },
  {
    id: 8, level: 'B1',
    question: 'Choose the correct form: "Sie bat mich, ___ zu helfen."',
    questionAR: 'اختر الشكل الصحيح:',
    options: ['ihr', 'ihn', 'ihm', 'sie'],
    correct: 2,
    explanation: '"helfen" takes dative: jemandem helfen → ihr helfen (feminine dative).',
  },
  {
    id: 9, level: 'B1',
    question: 'Konjunktiv II: "Wenn ich Zeit ___, würde ich lernen."',
    questionAR: 'الصيغة الشرطية: "لو كان لدي وقت، كنت سأتعلم."',
    options: ['habe', 'hätte', 'hatte', 'haben'],
    correct: 1,
    explanation: 'Konjunktiv II of "haben" is "hätte" — used for unreal conditions.',
  },
  {
    id: 10, level: 'B1',
    question: '"Trotzdem ___ er nicht aufgehört." (stopped)',
    questionAR: '"على الرغم من ذلك، ___ لم يتوقف."',
    options: ['hat', 'hatte', 'ist', 'hätte'],
    correct: 0,
    explanation: '"trotzdem" (nevertheless) triggers regular word order — verb in position 2.',
  },
];

// ── Score → CEFR mapping ──────────────────────────────────────────

function quizScoreToCEFR(correct: number, total: number): CEFRLevel {
  const pct = correct / total;
  if (pct >= 0.85) return 'B1';
  if (pct >= 0.60) return 'A2';
  return 'A1';
}

function quizScoreToMastery(correct: number, total: number): number {
  return Math.round((correct / total) * 65); // max 65 — test is not exhaustive
}

// ── Sub-components ────────────────────────────────────────────────

const StepIndicator: React.FC<{ current: number; total: number; label: string }> = ({ current, total, label }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current ? 'bg-amber-500 w-6' : i === current ? 'bg-amber-300 w-4' : 'bg-stone-200 w-4'
          }`}
        />
      ))}
    </div>
    <span className="text-xs text-stone-400 font-medium">{label}</span>
  </div>
);

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  labelAR: string;
  sublabel?: string;
  badge?: string;
}
const OptionCard: React.FC<OptionCardProps> = ({ selected, onClick, icon, label, labelAR, sublabel, badge }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-center gap-3 ${
      selected
        ? 'border-amber-500 bg-amber-50 shadow-md'
        : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50'
    }`}
    aria-pressed={selected}
  >
    {icon && (
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
        selected ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-500'
      }`}>
        {icon}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-stone-900">{label}</p>
        {badge && <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">{badge}</span>}
      </div>
      <p className="text-[11px] text-stone-500" dir="rtl">{labelAR}</p>
      {sublabel && <p className="text-[11px] text-stone-400 mt-0.5">{sublabel}</p>}
    </div>
    {selected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
  </button>
);

// ── FAST START FLOW ───────────────────────────────────────────────

const FastStartFlow: React.FC<{ onComplete: (data: FastStartData) => void; onBack: () => void }> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<FastStartData>>({});

  const steps = [
    {
      title: "What's your name?",
      titleAR: 'ما اسمك؟',
      content: (
        <div className="space-y-3">
          <input
            type="text"
            value={data.name ?? ''}
            onChange={e => setData(d => ({ ...d, name: e.target.value }))}
            placeholder="Your name / اسمك"
            className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-amber-500 focus:outline-none text-base font-medium"
            autoFocus
          />
        </div>
      ),
      canProceed: (data.name?.trim().length ?? 0) > 0,
    },
    {
      title: "What's your main goal?",
      titleAR: 'ما هدفك الرئيسي من تعلم الألمانية؟',
      content: (
        <div className="space-y-2">
          {([
            { goal: 'TRAVEL', icon: <Globe className="w-5 h-5" />, label: 'Travel to Germany', labelAR: 'السفر إلى ألمانيا', sublabel: 'Survival German, conversations, navigation' },
            { goal: 'LIFE_IN_GERMANY', icon: <Flag className="w-5 h-5" />, label: 'Live & integrate in Germany', labelAR: 'العيش والاندماج في ألمانيا', sublabel: 'Daily life, bureaucracy, social integration', badge: 'Most Popular' },
            { goal: 'STUDY', icon: <GraduationCap className="w-5 h-5" />, label: 'Study at a German university', labelAR: 'الدراسة في جامعة ألمانية', sublabel: 'Academic German, Goethe B1/B2, DSH/TestDaF' },
            { goal: 'CAREER', icon: <Briefcase className="w-5 h-5" />, label: 'Work professionally', labelAR: 'العمل باحترافية بالألمانية', sublabel: 'Meetings, emails, technical communication' },
          ] as const).map(opt => (
            <OptionCard
              key={opt.goal}
              selected={data.goal === opt.goal}
              onClick={() => setData(d => ({ ...d, goal: opt.goal as GoalTrack }))}
              icon={opt.icon}
              label={opt.label}
              labelAR={opt.labelAR}
              sublabel={opt.sublabel}
              badge={'badge' in opt ? (opt as any).badge : undefined}
            />
          ))}
        </div>
      ),
      canProceed: !!data.goal,
    },
    {
      title: 'What is your current German level?',
      titleAR: 'ما مستواك الحالي في الألمانية؟',
      content: (
        <div className="space-y-2">
          {([
            { level: 'A1', label: 'Complete beginner', labelAR: 'مبتدئ تماماً — لا أعرف شيئاً', sublabel: 'I know zero German' },
            { level: 'A1', label: 'I know a few words', labelAR: 'أعرف بعض الكلمات', sublabel: 'Numbers, greetings, basic phrases' },
            { level: 'A2', label: 'Basic level (A1 done)', labelAR: 'مستوى أساسي (A1 مكتمل)', sublabel: 'I can introduce myself and handle simple situations' },
            { level: 'B1', label: 'Elementary (A2 done)', labelAR: 'مستوى مبتدئ (A2 مكتمل)', sublabel: 'I can handle everyday conversations' },
          ] as { level: CEFRLevel; label: string; labelAR: string; sublabel: string }[]).map((opt, i) => (
            <OptionCard
              key={i}
              selected={data.currentLevel === opt.level && (
                (opt.label.includes('beginner') && data.currentLevel === 'A1') ||
                (!opt.label.includes('beginner') && data.currentLevel === opt.level)
              )}
              onClick={() => setData(d => ({ ...d, currentLevel: opt.level }))}
              label={`${opt.level} — ${opt.label}`}
              labelAR={opt.labelAR}
              sublabel={opt.sublabel}
            />
          ))}
        </div>
      ),
      canProceed: !!data.currentLevel,
    },
    {
      title: 'How much time can you study daily?',
      titleAR: 'كم من الوقت يمكنك دراسة الألمانية يومياً؟',
      content: (
        <div className="space-y-2">
          {([
            { min: 15, label: '15–20 minutes', labelAR: '15-20 دقيقة يومياً', sublabel: 'Casual pace — great for consistency', icon: <Clock className="w-5 h-5" /> },
            { min: 30, label: '30–40 minutes', labelAR: '30-40 دقيقة يومياً', sublabel: 'Regular pace — solid progress', icon: <Star className="w-5 h-5" />, badge: 'Recommended' },
            { min: 60, label: '60 minutes', labelAR: '60 دقيقة يومياً', sublabel: 'Intensive — fast progress', icon: <Zap className="w-5 h-5" /> },
            { min: 120, label: '2+ hours', labelAR: 'ساعتان أو أكثر', sublabel: 'Immersive — fastest possible progress', icon: <Trophy className="w-5 h-5" /> },
          ] as const).map(opt => (
            <OptionCard
              key={opt.min}
              selected={data.dailyMinutes === opt.min}
              onClick={() => setData(d => ({ ...d, dailyMinutes: opt.min }))}
              icon={opt.icon}
              label={opt.label}
              labelAR={opt.labelAR}
              sublabel={opt.sublabel}
              badge={'badge' in opt ? (opt as any).badge : undefined}
            />
          ))}
        </div>
      ),
      canProceed: !!data.dailyMinutes,
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = () => {
    if (isLast && current.canProceed) {
      onComplete({
        name: data.name ?? 'Learner',
        goal: data.goal ?? 'LIFE_IN_GERMANY',
        currentLevel: data.currentLevel ?? 'A1',
        dailyMinutes: data.dailyMinutes ?? 30,
        skillFocus: 'balanced',
      });
    } else if (current.canProceed) {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="space-y-6">
      <StepIndicator current={step} total={steps.length} label={`Step ${step + 1} of ${steps.length}`} />

      <div>
        <h2 className="text-xl font-black text-stone-900 mb-1">{current.title}</h2>
        <p className="text-sm text-stone-400 mb-5" dir="rtl">{current.titleAR}</p>
        {current.content}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={step === 0 ? onBack : () => setStep(s => s - 1)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={!current.canProceed}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${
            current.canProceed
              ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
          }`}
        >
          {isLast ? 'Build My Roadmap 🗺️' : 'Continue'}
          {!isLast && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

// ── DIAGNOSTIC FLOW ───────────────────────────────────────────────

const DiagnosticFlow: React.FC<{
  onComplete: (data: DiagnosticData) => void;
  onBack: () => void;
}> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<DiagnosticData>>({
    selfRating: {},
    quizAnswers: Array(PLACEMENT_QUIZ.length).fill(-1),
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

  const SKILLS_TO_RATE: { key: SkillKey; label: string; labelAR: string; icon: React.ReactNode }[] = [
    { key: 'HOEREN',    label: 'Listening (Hören)',   labelAR: 'الاستماع', icon: <Headphones className="w-4 h-4" /> },
    { key: 'SPRECHEN',  label: 'Speaking (Sprechen)', labelAR: 'التحدث',   icon: <Mic className="w-4 h-4" /> },
    { key: 'LESEN',     label: 'Reading (Lesen)',     labelAR: 'القراءة',  icon: <BookOpen className="w-4 h-4" /> },
    { key: 'SCHREIBEN', label: 'Writing (Schreiben)', labelAR: 'الكتابة',  icon: <PenLine className="w-4 h-4" /> },
    { key: 'GRAMMATIK', label: 'Grammar (Grammatik)', labelAR: 'القواعد',  icon: <Brain className="w-4 h-4" /> },
  ];

  const DIAG_STEPS = [
    'name_goal',
    'level_time',
    'self_assessment',
    ...PLACEMENT_QUIZ.map((_, i) => `quiz_${i}`),
    'results',
  ];
  const totalSteps = DIAG_STEPS.length;
  const currentStepKey = DIAG_STEPS[step];

  const quizIdx = currentStepKey.startsWith('quiz_')
    ? parseInt(currentStepKey.replace('quiz_', ''), 10)
    : -1;
  const currentQuestion = quizIdx >= 0 ? PLACEMENT_QUIZ[quizIdx] : null;

  const answeredCorrectly = data.quizAnswers
    ? data.quizAnswers.filter((ans, i) => ans === PLACEMENT_QUIZ[i]?.correct).length
    : 0;

  const handleNext = () => {
    if (currentStepKey.startsWith('quiz_') && quizIdx >= 0) {
      const newAnswers = [...(data.quizAnswers ?? [])];
      newAnswers[quizIdx] = selectedAnswer;
      setData(d => ({ ...d, quizAnswers: newAnswers }));
      setSelectedAnswer(-1);
    }

    if (step === totalSteps - 2) {
      // Going to results
      setStep(s => s + 1);
      return;
    }
    if (step === totalSteps - 1) {
      // Final
      const detectedLevel = quizScoreToCEFR(answeredCorrectly, PLACEMENT_QUIZ.length);
      const targetLevels: Record<GoalTrack, CEFRLevel> = {
        TRAVEL: 'A2', LIFE_IN_GERMANY: 'B1', STUDY: 'B2', CAREER: 'B1', PROFESSIONAL: 'B2',
      };
      onComplete({
        name: data.name ?? 'Learner',
        goal: data.goal ?? 'LIFE_IN_GERMANY',
        currentLevel: detectedLevel,
        targetLevel: targetLevels[data.goal ?? 'LIFE_IN_GERMANY'],
        dailyMinutes: data.dailyMinutes ?? 30,
        skillFocus: 'balanced',
        englishLevel: data.englishLevel ?? 'fluent',
        previousStudyMonths: data.previousStudyMonths ?? 0,
        selfRating: data.selfRating ?? {},
        quizAnswers: data.quizAnswers ?? [],
      });
      return;
    }
    setStep(s => s + 1);
  };

  const canProceed = (() => {
    if (currentStepKey === 'name_goal') return !!(data.name?.trim() && data.goal);
    if (currentStepKey === 'level_time') return !!(data.dailyMinutes);
    if (currentStepKey === 'self_assessment') return true;
    if (currentStepKey.startsWith('quiz_')) return selectedAnswer >= 0;
    return true;
  })();

  return (
    <div className="space-y-5">
      <StepIndicator current={step} total={totalSteps} label={`${step + 1}/${totalSteps}`} />

      {/* Step: Name + Goal */}
      {currentStepKey === 'name_goal' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-stone-900 mb-1">Let's build your profile</h2>
            <p className="text-sm text-stone-400" dir="rtl">دعنا نبني ملفك الشخصي لنولد خارطة طريق دقيقة</p>
          </div>
          <input
            type="text"
            value={data.name ?? ''}
            onChange={e => setData(d => ({ ...d, name: e.target.value }))}
            placeholder="Your name / اسمك"
            className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-amber-500 focus:outline-none text-base font-medium"
            autoFocus
          />
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Your main goal / هدفك</p>
            {([
              { goal: 'TRAVEL', label: 'Travel', labelAR: 'سفر' },
              { goal: 'LIFE_IN_GERMANY', label: 'Live in Germany', labelAR: 'العيش في ألمانيا' },
              { goal: 'STUDY', label: 'University study', labelAR: 'الدراسة الجامعية' },
              { goal: 'CAREER', label: 'Professional work', labelAR: 'العمل المهني' },
            ] as const).map(opt => (
              <OptionCard
                key={opt.goal}
                selected={data.goal === opt.goal}
                onClick={() => setData(d => ({ ...d, goal: opt.goal as GoalTrack }))}
                label={opt.label}
                labelAR={opt.labelAR}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step: Time + English level */}
      {currentStepKey === 'level_time' && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-stone-900 mb-1">Study habits</h2>
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Daily study time</p>
            {([
              { min: 15, label: '15 min/day', labelAR: '15 دقيقة' },
              { min: 30, label: '30 min/day', labelAR: '30 دقيقة', badge: 'Optimal' },
              { min: 60, label: '60 min/day', labelAR: 'ساعة' },
              { min: 120, label: '2+ hrs/day', labelAR: 'ساعتان+' },
            ] as const).map(opt => (
              <OptionCard
                key={opt.min}
                selected={data.dailyMinutes === opt.min}
                onClick={() => setData(d => ({ ...d, dailyMinutes: opt.min }))}
                label={opt.label}
                labelAR={opt.labelAR}
                badge={'badge' in opt ? (opt as any).badge : undefined}
              />
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Your English level</p>
            {([
              { val: 'basic', label: 'Basic', labelAR: 'أساسي' },
              { val: 'intermediate', label: 'Intermediate', labelAR: 'متوسط' },
              { val: 'fluent', label: 'Fluent / Advanced', labelAR: 'متقدم / طلاقة' },
            ] as const).map(opt => (
              <OptionCard
                key={opt.val}
                selected={data.englishLevel === opt.val}
                onClick={() => setData(d => ({ ...d, englishLevel: opt.val }))}
                label={opt.label}
                labelAR={opt.labelAR}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step: Self-assessment */}
      {currentStepKey === 'self_assessment' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-stone-900 mb-1">Rate your skills</h2>
            <p className="text-sm text-stone-400" dir="rtl">قيّم مهاراتك بصدق (0 = لا شيء، 5 = متقدم)</p>
          </div>
          <div className="space-y-4">
            {SKILLS_TO_RATE.map(skill => (
              <div key={skill.key} className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-stone-500">{skill.icon}</span>
                  <span className="text-sm font-bold text-stone-700">{skill.label}</span>
                  <span className="text-xs text-stone-400" dir="rtl">{skill.labelAR}</span>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3, 4, 5].map(val => (
                    <button
                      key={val}
                      onClick={() => setData(d => ({
                        ...d,
                        selfRating: { ...d.selfRating, [skill.key]: val },
                      }))}
                      className={`flex-1 h-8 rounded-lg text-xs font-black transition-all ${
                        (data.selfRating?.[skill.key] ?? -1) === val
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-stone-400 px-0.5">
                  <span>None</span>
                  <span>Advanced</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step: Quiz question */}
      {currentQuestion && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              currentQuestion.level === 'A1' ? 'bg-emerald-100 text-emerald-800' :
              currentQuestion.level === 'A2' ? 'bg-blue-100 text-blue-800' :
              'bg-purple-100 text-purple-800'
            }`}>{currentQuestion.level}</span>
            <span className="text-xs text-stone-400">Question {quizIdx + 1} of {PLACEMENT_QUIZ.length}</span>
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900 mb-1 leading-snug">{currentQuestion.question}</h2>
            <p className="text-sm text-stone-400 mb-4" dir="rtl">{currentQuestion.questionAR}</p>
            <div className="space-y-2">
              {currentQuestion.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedAnswer(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                    selectedAnswer === i
                      ? 'border-amber-500 bg-amber-50 text-stone-900'
                      : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                  }`}
                >
                  <span className="font-mono text-stone-400 mr-2">{['A', 'B', 'C', 'D'][i]}.</span>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step: Results */}
      {currentStepKey === 'results' && (
        <div className="space-y-4 text-center">
          <div className="text-5xl mb-2">🎯</div>
          <h2 className="text-2xl font-black text-stone-900">Your Diagnostic Results</h2>
          <p className="text-sm text-stone-500" dir="rtl">نتائج التشخيص الخاصة بك</p>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-700">Quiz Score</span>
              <span className="text-xl font-black text-amber-700">{answeredCorrectly}/{PLACEMENT_QUIZ.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-700">Detected Level</span>
              <span className="text-xl font-black text-stone-900">
                {quizScoreToCEFR(answeredCorrectly, PLACEMENT_QUIZ.length)}
              </span>
            </div>
            <div className="h-px bg-amber-200" />
            <p className="text-xs text-stone-500">
              This estimate will be refined as you use the platform. The roadmap will adapt to your actual performance.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-4 text-left space-y-2">
            {SKILLS_TO_RATE.map(skill => {
              const rating = data.selfRating?.[skill.key] ?? 0;
              return (
                <div key={skill.key} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-bold text-stone-600">{skill.label.split(' ')[0]}</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(rating / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-stone-400 w-4">{rating}/5</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={step === 0 ? onBack : () => { setSelectedAnswer(-1); setStep(s => s - 1); }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${
            canProceed
              ? 'bg-amber-500 hover:bg-amber-600 text-stone-950'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
          }`}
        >
          {currentStepKey === 'results' ? 'Generate My Roadmap 🗺️' : 'Continue'}
          {currentStepKey !== 'results' && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

// ── MAIN ONBOARDING COMPONENT ─────────────────────────────────────

export const OnboardingFlow: React.FC = () => {
  const {
    setUserName, setHasSeenWelcome, setGoalProfile, updateSkillScore,
  } = useApp();
  const [mode, setMode] = useState<OnboardingMode>('choose');

  const applyAndFinish = useCallback((
    name: string,
    goal: GoalTrack,
    currentLevel: CEFRLevel,
    dailyMinutes: number,
    quizCorrect?: number,
    selfRating?: Partial<Record<SkillKey, number>>,
  ) => {
    // 1. Set user name
    setUserName(name);

    // 2. Set goal profile
    const targetLevels: Record<GoalTrack, CEFRLevel> = {
      TRAVEL: 'A2', LIFE_IN_GERMANY: 'B1', STUDY: 'B2',
      CAREER: 'B1', PROFESSIONAL: 'B2',
    };
    setGoalProfile({
      track: goal,
      targetCEFR: targetLevels[goal],
      weeklyHours: Math.round((dailyMinutes * 7) / 60),
    });

    // 3. Seed skill mastery from self-rating or current level
    // These are 0-100 mastery scores. Level A1=5, A2=25, B1=45, B2=65
    const levelMastery: Record<CEFRLevel, number> = {
      A1: 5, A2: 25, B1: 45, B2: 65, C1: 80, C2: 95,
    };
    const baseMastery = levelMastery[currentLevel];

    const coreSkills: SkillKey[] = ['HOEREN', 'SPRECHEN', 'LESEN', 'SCHREIBEN', 'GRAMMATIK', 'WORTSCHATZ'];

    if (selfRating && Object.keys(selfRating).length > 0) {
      // Map 0-5 self-rating to 0-100 mastery, bounded by level estimate
      coreSkills.forEach(skill => {
        const rating = selfRating[skill] ?? 2;
        const mastery = Math.min(baseMastery * 1.4, (rating / 5) * 60 + baseMastery * 0.3);
        updateSkillScore(skill, Math.round(mastery));
      });
    } else {
      // Uniform seeding from self-reported level
      coreSkills.forEach(skill => updateSkillScore(skill, baseMastery));
    }

    // 4. Mark welcome as seen → exits onboarding
    setTimeout(() => setHasSeenWelcome(true), 100);
  }, [setUserName, setHasSeenWelcome, setGoalProfile, updateSkillScore]);

  const handleFastComplete = useCallback((data: FastStartData) => {
    applyAndFinish(data.name, data.goal, data.currentLevel, data.dailyMinutes);
  }, [applyAndFinish]);

  const handleDiagnosticComplete = useCallback((data: DiagnosticData) => {
    applyAndFinish(
      data.name, data.goal, data.currentLevel, data.dailyMinutes,
      data.quizAnswers.filter((ans, i) => ans === PLACEMENT_QUIZ[i]?.correct).length,
      data.selfRating,
    );
  }, [applyAndFinish]);

  // ── Mode chooser ──
  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">

          {/* Logo area */}
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🇩🇪</div>
            <h1 className="text-3xl font-black text-white mb-2">
              Your German Learning OS
            </h1>
            <p className="text-stone-400 text-sm">
              Method → Roadmap → Best Resources → Practice → Progress
            </p>
            <p className="text-stone-500 text-xs mt-1" dir="rtl">
              منهجية → خارطة طريق → أفضل الموارد → تدريب → تقدم
            </p>
          </div>

          <div className="space-y-4">
            {/* Fast Start */}
            <button
              onClick={() => setMode('fast')}
              className="w-full p-6 rounded-3xl bg-amber-500 hover:bg-amber-400 transition-all shadow-xl shadow-amber-900/30 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/50 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-xl font-black text-stone-950">Fast Start</h3>
                    <span className="text-xs bg-stone-950/20 text-stone-950 px-2 py-0.5 rounded-full font-bold">~60 seconds</span>
                  </div>
                  <p className="text-sm text-amber-900 font-medium">
                    Choose your goal + level → instant roadmap
                  </p>
                  <p className="text-[12px] text-amber-800 mt-0.5" dir="rtl">
                    اختر هدفك ومستواك ← خارطة طريق فورية
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-amber-900 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Full Diagnostic */}
            <button
              onClick={() => setMode('diagnostic')}
              className="w-full p-6 rounded-3xl bg-stone-800 hover:bg-stone-700 transition-all shadow-xl border border-stone-700 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-stone-700 flex items-center justify-center">
                  <ClipboardList className="w-7 h-7 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-xl font-black text-white">Full Diagnostic</h3>
                    <span className="text-xs bg-stone-700 text-stone-300 px-2 py-0.5 rounded-full font-bold">~15 min</span>
                  </div>
                  <p className="text-sm text-stone-400 font-medium">
                    Placement test + skill assessment → deep personalization
                  </p>
                  <p className="text-[12px] text-stone-500 mt-0.5" dir="rtl">
                    اختبار تحديد مستوى + تقييم مهارات ← تخصيص عميق
                  </p>
                </div>
                <ChevronRight className="w-6 h-6 text-stone-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex items-center gap-2 mt-3 ml-[4.5rem]">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-[11px] text-stone-500">
                  Recommended — produces a significantly more accurate roadmap
                </p>
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-stone-600 mt-8">
            No account required · All data stays on your device · Free forever
          </p>
        </div>
      </div>
    );
  }

  // ── Fast Start container ──
  if (mode === 'fast') {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 border border-stone-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-black text-stone-900">Fast Start</h1>
              <p className="text-[11px] text-stone-400">Set up in ~60 seconds</p>
            </div>
          </div>
          <FastStartFlow onComplete={handleFastComplete} onBack={() => setMode('choose')} />
        </div>
      </div>
    );
  }

  // ── Diagnostic container ──
  return (
    <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 border border-stone-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h1 className="text-sm font-black text-stone-900">Full Diagnostic</h1>
            <p className="text-[11px] text-stone-400">Placement test · ~15 minutes</p>
          </div>
        </div>
        <DiagnosticFlow onComplete={handleDiagnosticComplete} onBack={() => setMode('choose')} />
      </div>
    </div>
  );
};
