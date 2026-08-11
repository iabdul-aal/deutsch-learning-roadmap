/**
 * OnboardingFlow.tsx
 *
 * Two modes:
 *   FAST START  - 4 card-selection steps, ~60 seconds, instant roadmap
 *   DIAGNOSTIC  - placement test + skills self-assessment, ~15 minutes
 *
 * Both modes seed the learner model with a GoalProfile and initial
 * skill mastery estimates, then set hasSeenWelcome to enter the app.
 */

import React, { useState, useCallback } from 'react';
import {
  ArrowRight, ArrowLeft, Zap, ClipboardList, Check, ChevronRight,
  GraduationCap, Briefcase, Globe, Flag, Star, Clock, BookOpen,
  Mic, Headphones, PenLine, Brain, Trophy, AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { GoalTrack, CEFRLevel, SkillKey } from '../types/learner';
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
  targetLevel: CEFRLevel;
  selfRating: Partial<Record<SkillKey, number>>;
  quizAnswers: number[];
}

// ── Placement Test (A1-B1) ────────────────────────────────────────

interface QuizQuestion {
  id: number;
  level: 'A1' | 'A2' | 'B1';
  question: string;
  hint: string;
  options: string[];
  correct: number;
  explanation: string;
}

const PLACEMENT_QUIZ: QuizQuestion[] = [
  {
    id: 1, level: 'A1',
    question: 'Choose the correct article for Tisch (table)',
    hint: 'der / die / das',
    options: ['der', 'die', 'das', 'den'],
    correct: 0,
    explanation: 'Der Tisch - masculine noun. Most furniture is masculine.',
  },
  {
    id: 2, level: 'A1',
    question: 'Conjugate the verb: "Ich ___ aus Agypten." (to come)',
    hint: 'kommen conjugated for ich',
    options: ['komme', 'kommen', 'kommt', 'kommst'],
    correct: 0,
    explanation: 'Ich komme - first person singular conjugation of kommen.',
  },
  {
    id: 3, level: 'A1',
    question: 'Which sentence has correct German word order?',
    hint: 'Verb must be in position 2',
    options: [
      'Ich heute gehe ins Kino.',
      'Ich gehe heute ins Kino.',
      'Heute ich gehe ins Kino.',
      'Gehe ich heute ins Kino.',
    ],
    correct: 1,
    explanation: 'German verb-second rule: the verb must always be in position 2.',
  },
  {
    id: 4, level: 'A1',
    question: '"Ich habe ___ Bruder." - Which accusative article is correct?',
    hint: 'Masculine noun in accusative case',
    options: ['ein', 'einen', 'einem', 'einer'],
    correct: 1,
    explanation: 'Masculine noun in accusative: ein becomes einen.',
  },
  {
    id: 5, level: 'A2',
    question: '"Er ___ gestern ins Kino gegangen." - Which auxiliary verb?',
    hint: 'Perfekt tense with a motion verb',
    options: ['hat', 'ist', 'war', 'hatte'],
    correct: 1,
    explanation: 'Motion verbs like "gehen" use "sein" as auxiliary in Perfekt: ist gegangen.',
  },
  {
    id: 6, level: 'A2',
    question: 'Which preposition ALWAYS takes the dative case?',
    hint: 'One of these is never two-way',
    options: ['in', 'an', 'mit', 'auf'],
    correct: 2,
    explanation: '"mit" always takes dative. "in, an, auf" are two-way prepositions.',
  },
  {
    id: 7, level: 'A2',
    question: 'Complete the subordinate clause: "Weil ich mude ___"',
    hint: 'Verb position in subordinate clauses',
    options: [
      'bin, bleibe ich zu Hause.',
      'bleibe ich zu Hause.',
      'ich bleibe zu Hause.',
      'bin ich zu Hause.',
    ],
    correct: 0,
    explanation: 'In subordinate clauses starting with weil or dass, the verb moves to the end.',
  },
  {
    id: 8, level: 'B1',
    question: '"Sie bat mich, ___ zu helfen." - Which pronoun form?',
    hint: 'helfen governs dative case',
    options: ['ihr', 'ihn', 'ihm', 'sie'],
    correct: 2,
    explanation: '"helfen" takes dative: jemandem helfen. "ihr" is feminine dative.',
  },
  {
    id: 9, level: 'B1',
    question: 'Konjunktiv II: "Wenn ich Zeit ___, wurde ich lernen."',
    hint: 'Unreal conditional - haben in Konjunktiv II',
    options: ['habe', 'hatte', 'hatten', 'hatte'],
    correct: 0,
    explanation: 'Konjunktiv II of "haben" is "hatte" - used for unreal conditions.',
  },
  {
    id: 10, level: 'B1',
    question: '"Trotzdem ___ er nicht aufgehort." - Which word order?',
    hint: 'trotzdem is a coordinating adverb',
    options: ['hat', 'hatte', 'ist', 'hatte'],
    correct: 0,
    explanation: '"trotzdem" triggers verb-second order - verb stays in position 2.',
  },
];

// ── Score mapping ─────────────────────────────────────────────────

function quizScoreToCEFR(correct: number, total: number): CEFRLevel {
  if (total === 0) return 'A1';
  const pct = correct / total;
  if (pct >= 0.85) return 'B1';
  if (pct >= 0.60) return 'A2';
  return 'A1';
}

// ── Shared components ─────────────────────────────────────────────

const StepIndicator: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-2 mb-6">
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current  ? 'bg-amber-500 w-6' :
            i === current ? 'bg-amber-300 w-4' :
                            'bg-stone-200 w-4'
          }`}
        />
      ))}
    </div>
    <span className="text-xs text-stone-400 font-medium">{current + 1} / {total}</span>
  </div>
);

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  sublabel?: string;
  badge?: string;
}

const OptionCard: React.FC<OptionCardProps> = ({ selected, onClick, icon, label, sublabel, badge }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-150 flex items-center gap-3 ${
      selected
        ? 'border-amber-500 bg-amber-50 shadow-sm'
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
        {badge && (
          <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {badge}
          </span>
        )}
      </div>
      {sublabel && <p className="text-[11px] text-stone-400 mt-0.5">{sublabel}</p>}
    </div>
    {selected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
  </button>
);

const NavRow: React.FC<{
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  isLast?: boolean;
}> = ({ canProceed, onBack, onNext, isLast }) => (
  <div className="flex gap-3 pt-2">
    <button
      onClick={onBack}
      className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-sm font-bold hover:bg-stone-50 transition-colors"
    >
      Back
    </button>
    <button
      onClick={onNext}
      disabled={!canProceed}
      className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
        canProceed
          ? 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-sm'
          : 'bg-stone-100 text-stone-400 cursor-not-allowed'
      }`}
    >
      {isLast ? 'Build My Roadmap' : 'Continue'}
    </button>
  </div>
);

// ── Level options (unique id prevents dual-selection on shared CEFR) ────

const LEVEL_OPTIONS: { id: string; level: CEFRLevel; label: string; sublabel: string }[] = [
  { id: 'a1_zero',  level: 'A1', label: 'Complete beginner',           sublabel: 'I know zero or almost no German' },
  { id: 'a1_basic', level: 'A1', label: 'I know a few basics',         sublabel: 'Numbers, greetings, a few phrases' },
  { id: 'a2',       level: 'A2', label: 'Elementary - A1 complete',    sublabel: 'I can introduce myself and handle simple situations' },
  { id: 'b1',       level: 'B1', label: 'Pre-intermediate - A2 done',  sublabel: 'I can handle most everyday conversations' },
];

// ── Fast Start Flow ───────────────────────────────────────────────

const FastStartFlow: React.FC<{
  onComplete: (data: FastStartData) => void;
  onBack: () => void;
}> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<FastStartData> & { levelId?: string }>({});

  const steps = [
    {
      title: "What's your name?",
      content: (
        <input
          type="text"
          value={data.name ?? ''}
          onChange={e => setData(d => ({ ...d, name: e.target.value.trimStart() }))}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-amber-500 focus:outline-none text-base font-medium"
          autoFocus
          maxLength={60}
        />
      ),
      canProceed: (data.name?.trim().length ?? 0) >= 1,
    },
    {
      title: 'What is your main goal?',
      content: (
        <div className="space-y-2">
          {([
            { goal: 'TRAVEL',          icon: <Globe className="w-5 h-5" />,         label: 'Travel to German-speaking countries',  sublabel: 'Survival, navigation, conversations' },
            { goal: 'LIFE_IN_GERMANY', icon: <Flag className="w-5 h-5" />,          label: 'Live and integrate in Germany',         sublabel: 'Daily life, bureaucracy, social integration', badge: 'Most common' },
            { goal: 'STUDY',           icon: <GraduationCap className="w-5 h-5" />, label: 'Study at a German university',          sublabel: 'Academic German, Goethe B1/B2, DSH, TestDaF' },
            { goal: 'CAREER',          icon: <Briefcase className="w-5 h-5" />,     label: 'Work professionally in German',         sublabel: 'Meetings, emails, technical communication' },
          ] as const).map(opt => (
            <OptionCard
              key={opt.goal}
              selected={data.goal === opt.goal}
              onClick={() => setData(d => ({ ...d, goal: opt.goal as GoalTrack }))}
              icon={opt.icon}
              label={opt.label}
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
      content: (
        <div className="space-y-2">
          {LEVEL_OPTIONS.map(opt => (
            <OptionCard
              key={opt.id}
              selected={data.levelId === opt.id}
              onClick={() => setData(d => ({ ...d, levelId: opt.id, currentLevel: opt.level }))}
              label={`${opt.level} - ${opt.label}`}
              sublabel={opt.sublabel}
            />
          ))}
        </div>
      ),
      canProceed: !!data.levelId,
    },
    {
      title: 'How much time can you study each day?',
      content: (
        <div className="space-y-2">
          {([
            { min: 15,  label: '15 to 20 minutes', sublabel: 'Casual pace - great for building a daily habit',       icon: <Clock className="w-5 h-5" /> },
            { min: 30,  label: '30 to 40 minutes', sublabel: 'Regular pace - solid, consistent progress',             icon: <Star className="w-5 h-5" />, badge: 'Recommended' },
            { min: 60,  label: '60 minutes',        sublabel: 'Intensive - noticeably faster progress',               icon: <Zap className="w-5 h-5" /> },
            { min: 120, label: '2 or more hours',   sublabel: 'Immersive - fastest possible results',                 icon: <Trophy className="w-5 h-5" /> },
          ] as const).map(opt => (
            <OptionCard
              key={opt.min}
              selected={data.dailyMinutes === opt.min}
              onClick={() => setData(d => ({ ...d, dailyMinutes: opt.min }))}
              icon={opt.icon}
              label={opt.label}
              sublabel={opt.sublabel}
              badge={'badge' in opt ? (opt as any).badge : undefined}
            />
          ))}
        </div>
      ),
      canProceed: !!data.dailyMinutes,
    },
  ];

  const current  = steps[step];
  const isLast   = step === steps.length - 1;

  const handleNext = () => {
    if (isLast && current.canProceed) {
      onComplete({
        name:         data.name ?? 'Learner',
        goal:         data.goal ?? 'LIFE_IN_GERMANY',
        currentLevel: data.currentLevel ?? 'A1',
        dailyMinutes: data.dailyMinutes ?? 30,
        skillFocus:   'balanced',
      });
    } else if (current.canProceed) {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="space-y-6">
      <StepIndicator current={step} total={steps.length} />
      <div>
        <h2 className="text-xl font-black text-stone-900 mb-5">{current.title}</h2>
        {current.content}
      </div>
      <NavRow
        canProceed={current.canProceed}
        onBack={step === 0 ? onBack : () => setStep(s => s - 1)}
        onNext={handleNext}
        isLast={isLast}
      />
    </div>
  );
};

// ── Diagnostic Flow ───────────────────────────────────────────────

const DiagnosticFlow: React.FC<{
  onComplete: (data: DiagnosticData) => void;
  onBack: () => void;
}> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Partial<DiagnosticData>>({
    selfRating:  {},
    quizAnswers: Array(PLACEMENT_QUIZ.length).fill(-1),
  });
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);

  const SKILLS_TO_RATE: { key: SkillKey; label: string; icon: React.ReactNode }[] = [
    { key: 'HOEREN',    label: 'Listening',     icon: <Headphones className="w-4 h-4" /> },
    { key: 'SPRECHEN',  label: 'Speaking',      icon: <Mic className="w-4 h-4" /> },
    { key: 'LESEN',     label: 'Reading',       icon: <BookOpen className="w-4 h-4" /> },
    { key: 'SCHREIBEN', label: 'Writing',        icon: <PenLine className="w-4 h-4" /> },
    { key: 'GRAMMATIK', label: 'Grammar',       icon: <Brain className="w-4 h-4" /> },
  ];

  // Step keys: name_goal | habits | self_rate | quiz_0..9 | results
  const STEP_KEYS = [
    'name_goal',
    'habits',
    'self_rate',
    ...PLACEMENT_QUIZ.map((_, i) => `quiz_${i}`),
    'results',
  ];

  const totalSteps     = STEP_KEYS.length;
  const stepKey        = STEP_KEYS[step];
  const quizIdx        = stepKey.startsWith('quiz_') ? parseInt(stepKey.replace('quiz_', ''), 10) : -1;
  const currentQuestion = quizIdx >= 0 ? PLACEMENT_QUIZ[quizIdx] : null;

  const correctCount = (data.quizAnswers ?? [])
    .filter((ans, i) => ans === PLACEMENT_QUIZ[i]?.correct).length;

  const canProceed = (() => {
    if (stepKey === 'name_goal')   return !!(data.name?.trim() && data.goal);
    if (stepKey === 'habits')      return !!(data.dailyMinutes);
    if (stepKey === 'self_rate')   return true;
    if (stepKey.startsWith('quiz_')) return selectedAnswer >= 0;
    return true;
  })();

  const handleNext = () => {
    if (stepKey.startsWith('quiz_') && quizIdx >= 0) {
      const updated = [...(data.quizAnswers ?? [])];
      updated[quizIdx] = selectedAnswer;
      setData(d => ({ ...d, quizAnswers: updated }));
      setSelectedAnswer(-1);
    }

    if (step >= totalSteps - 1) {
      const detectedLevel = quizScoreToCEFR(correctCount, PLACEMENT_QUIZ.length);
      const targetLevels: Record<GoalTrack, CEFRLevel> = {
        TRAVEL: 'A2', LIFE_IN_GERMANY: 'B1', STUDY: 'B2', CAREER: 'B1', PROFESSIONAL: 'B2',
      };
      const goal = data.goal ?? 'LIFE_IN_GERMANY';
      onComplete({
        name:          data.name ?? 'Learner',
        goal,
        currentLevel:  detectedLevel,
        targetLevel:   targetLevels[goal],
        dailyMinutes:  data.dailyMinutes ?? 30,
        skillFocus:    'balanced',
        englishLevel:  data.englishLevel ?? 'fluent',
        selfRating:    data.selfRating ?? {},
        quizAnswers:   data.quizAnswers ?? [],
      });
      return;
    }

    setStep(s => s + 1);
  };

  const handleBack = () => {
    setSelectedAnswer(-1);
    if (step === 0) onBack();
    else setStep(s => s - 1);
  };

  return (
    <div className="space-y-5">
      <StepIndicator current={step} total={totalSteps} />

      {/* Name + Goal */}
      {stepKey === 'name_goal' && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-stone-900">Build your profile</h2>
          <input
            type="text"
            value={data.name ?? ''}
            onChange={e => setData(d => ({ ...d, name: e.target.value.trimStart() }))}
            placeholder="Your name"
            className="w-full px-4 py-3 rounded-xl border-2 border-stone-200 focus:border-amber-500 focus:outline-none text-base font-medium"
            autoFocus
            maxLength={60}
          />
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Your main goal</p>
            {([
              { goal: 'TRAVEL',          label: 'Travel' },
              { goal: 'LIFE_IN_GERMANY', label: 'Live in Germany' },
              { goal: 'STUDY',           label: 'University study' },
              { goal: 'CAREER',          label: 'Professional work' },
            ] as const).map(opt => (
              <OptionCard
                key={opt.goal}
                selected={data.goal === opt.goal}
                onClick={() => setData(d => ({ ...d, goal: opt.goal as GoalTrack }))}
                label={opt.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* Study habits */}
      {stepKey === 'habits' && (
        <div className="space-y-4">
          <h2 className="text-xl font-black text-stone-900">Study habits</h2>
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Daily study time</p>
            {([
              { min: 15,  label: '15 min per day',       badge: undefined },
              { min: 30,  label: '30 min per day',       badge: 'Optimal' },
              { min: 60,  label: '60 min per day',       badge: undefined },
              { min: 120, label: '2 or more hours',      badge: undefined },
            ] as const).map(opt => (
              <OptionCard
                key={opt.min}
                selected={data.dailyMinutes === opt.min}
                onClick={() => setData(d => ({ ...d, dailyMinutes: opt.min }))}
                label={opt.label}
                badge={opt.badge}
              />
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Your English level</p>
            {([
              { val: 'basic',        label: 'Basic' },
              { val: 'intermediate', label: 'Intermediate' },
              { val: 'fluent',       label: 'Fluent or advanced' },
            ] as const).map(opt => (
              <OptionCard
                key={opt.val}
                selected={data.englishLevel === opt.val}
                onClick={() => setData(d => ({ ...d, englishLevel: opt.val }))}
                label={opt.label}
              />
            ))}
          </div>
        </div>
      )}

      {/* Self-assessment */}
      {stepKey === 'self_rate' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black text-stone-900">Rate your skills</h2>
            <p className="text-sm text-stone-400 mt-1">0 = none, 5 = advanced</p>
          </div>
          <div className="space-y-5">
            {SKILLS_TO_RATE.map(skill => (
              <div key={skill.key} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">{skill.icon}</span>
                  <span className="text-sm font-bold text-stone-700">{skill.label}</span>
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
                          ? 'bg-amber-500 text-white'
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

      {/* Quiz question */}
      {currentQuestion && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              currentQuestion.level === 'A1' ? 'bg-emerald-100 text-emerald-800' :
              currentQuestion.level === 'A2' ? 'bg-blue-100 text-blue-800' :
                                               'bg-purple-100 text-purple-800'
            }`}>{currentQuestion.level}</span>
            <span className="text-xs text-stone-400">
              Question {quizIdx + 1} of {PLACEMENT_QUIZ.length}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-black text-stone-900 leading-snug">
              {currentQuestion.question}
            </h2>
            <p className="text-xs text-stone-400 mt-1">{currentQuestion.hint}</p>
          </div>
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
                <span className="font-mono text-stone-400 mr-2">
                  {['A', 'B', 'C', 'D'][i]}.
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {stepKey === 'results' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-stone-900 text-center">Diagnostic Results</h2>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-700">Quiz score</span>
              <span className="text-xl font-black text-amber-700">
                {correctCount} / {PLACEMENT_QUIZ.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-stone-700">Detected level</span>
              <span className="text-2xl font-black text-stone-900">
                {quizScoreToCEFR(correctCount, PLACEMENT_QUIZ.length)}
              </span>
            </div>
            <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: `${(correctCount / PLACEMENT_QUIZ.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              This is an initial estimate. Your roadmap will adapt as you study and take assessments.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wide">Self-rated skills</p>
            {SKILLS_TO_RATE.map(skill => {
              const rating = data.selfRating?.[skill.key] ?? 0;
              return (
                <div key={skill.key} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-bold text-stone-600">{skill.label}</span>
                  <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(rating / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-stone-400 w-6 text-right">{rating}/5</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <NavRow
        canProceed={canProceed}
        onBack={handleBack}
        onNext={handleNext}
        isLast={step >= totalSteps - 1}
      />
    </div>
  );
};

// ── Main Onboarding ───────────────────────────────────────────────

export const OnboardingFlow: React.FC = () => {
  const { setUserName, setHasSeenWelcome, setGoalProfile, updateSkillScore } = useApp();
  const [mode, setMode] = useState<OnboardingMode>('choose');

  const applyAndFinish = useCallback((
    name: string,
    goal: GoalTrack,
    currentLevel: CEFRLevel,
    dailyMinutes: number,
    selfRating?: Partial<Record<SkillKey, number>>,
  ) => {
    setUserName(name.trim() || 'Learner');

    const targetLevels: Record<GoalTrack, CEFRLevel> = {
      TRAVEL: 'A2', LIFE_IN_GERMANY: 'B1', STUDY: 'B2', CAREER: 'B1', PROFESSIONAL: 'B2',
    };

    setGoalProfile({
      track:       goal,
      targetCEFR:  targetLevels[goal],
      weeklyHours: Math.round((dailyMinutes * 7) / 60),
    });

    // Seed mastery: A1=5, A2=25, B1=45, B2=65
    const levelBase: Record<CEFRLevel, number> = {
      A1: 5, A2: 25, B1: 45, B2: 65, C1: 80, C2: 95,
    };
    const base = levelBase[currentLevel] ?? 5;
    const coreSkills: SkillKey[] = ['HOEREN', 'SPRECHEN', 'LESEN', 'SCHREIBEN', 'GRAMMATIK', 'WORTSCHATZ'];

    if (selfRating && Object.keys(selfRating).length > 0) {
      coreSkills.forEach(skill => {
        const rating  = selfRating[skill] ?? 2;
        const mastery = Math.min(base * 1.4, (rating / 5) * 60 + base * 0.3);
        updateSkillScore(skill, Math.round(mastery));
      });
    } else {
      coreSkills.forEach(skill => updateSkillScore(skill, base));
    }

    // Call directly - React batches this with the previous state updates
    setHasSeenWelcome(true);
  }, [setUserName, setHasSeenWelcome, setGoalProfile, updateSkillScore]);

  const handleFastComplete = useCallback((d: FastStartData) => {
    applyAndFinish(d.name, d.goal, d.currentLevel, d.dailyMinutes);
  }, [applyAndFinish]);

  const handleDiagnosticComplete = useCallback((d: DiagnosticData) => {
    applyAndFinish(d.name, d.goal, d.currentLevel, d.dailyMinutes, d.selfRating);
  }, [applyAndFinish]);

  // Mode chooser screen
  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-amber-900/30">
              <span className="text-2xl font-black text-stone-950">DE</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-2">German Learning OS</h1>
            <p className="text-stone-400 text-sm leading-relaxed">
              Method - Roadmap - Best Resources - Practice - Progress
            </p>
          </div>

          <div className="space-y-4">
            {/* Fast Start */}
            <button
              onClick={() => setMode('fast')}
              className="w-full p-6 rounded-3xl bg-amber-500 hover:bg-amber-400 transition-all shadow-xl shadow-amber-900/30 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/50 flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-lg font-black text-stone-950">Fast Start</h3>
                    <span className="text-xs bg-stone-950/20 text-stone-950 px-2 py-0.5 rounded-full font-bold">60 seconds</span>
                  </div>
                  <p className="text-sm text-amber-900 font-medium">
                    Choose your goal and level - get an instant roadmap
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-amber-800 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Full Diagnostic */}
            <button
              onClick={() => setMode('diagnostic')}
              className="w-full p-6 rounded-3xl bg-stone-800 hover:bg-stone-700 transition-all shadow-xl border border-stone-700 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-stone-700 flex items-center justify-center shrink-0">
                  <ClipboardList className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-lg font-black text-white">Full Diagnostic</h3>
                    <span className="text-xs bg-stone-700 text-stone-300 px-2 py-0.5 rounded-full font-bold">15 min</span>
                  </div>
                  <p className="text-sm text-stone-400 font-medium">
                    Placement test + skill assessment - deep personalization
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-500 group-hover:translate-x-1 transition-transform" />
              </div>
              <div className="flex items-center gap-2 mt-3 ml-16">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <p className="text-[11px] text-stone-500">
                  Recommended - produces a significantly more accurate roadmap
                </p>
              </div>
            </button>
          </div>

          <p className="text-center text-xs text-stone-600 mt-8">
            No account required - all data stays on your device - free forever
          </p>
        </div>
      </div>
    );
  }

  // Fast Start container
  if (mode === 'fast') {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 border border-stone-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-black text-stone-900">Fast Start</p>
              <p className="text-[11px] text-stone-400">Set up in about 60 seconds</p>
            </div>
          </div>
          <FastStartFlow onComplete={handleFastComplete} onBack={() => setMode('choose')} />
        </div>
      </div>
    );
  }

  // Diagnostic container
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 border border-stone-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center">
            <ClipboardList className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-black text-stone-900">Full Diagnostic</p>
            <p className="text-[11px] text-stone-400">Placement test - about 15 minutes</p>
          </div>
        </div>
        <DiagnosticFlow onComplete={handleDiagnosticComplete} onBack={() => setMode('choose')} />
      </div>
    </div>
  );
};
