import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, AlertTriangle, CheckCircle, Check, X, BookOpen, Lock } from 'lucide-react';

type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface GrammarConcept {
  id: string;
  titleDE: string;
  titleAR: string;
  cefr: CEFRLevel;
  intuitionEN: string;
  intuitionAR: string;
  ruleExplanation: string;
  arabicWarning?: {
    mistake: string;
    correct: string;
    explanation: string;
  };
  examples: Array<{
    de: string;
    en: string;
    ar: string;
  }>;
  quiz: QuizQuestion[];
  prerequisites?: string[];
}

const GRAMMAR_CONCEPTS: GrammarConcept[] = [
  {
    id: 'gender-a1',
    titleDE: 'German Gender (der/die/das)',
    titleAR: 'جنس الاسم (der/die/das)',
    cefr: 'A1',
    intuitionEN: 'In German, every noun has a grammatical gender: masculine, feminine, or neuter. This is often random and must be memorized with the word.',
    intuitionAR: 'في الألمانية، كل اسم له جنس نحوي: مذكر، مؤنث، أو محايد. هذا غالباً عشوائي ويجب حفظه مع الكلمة.',
    ruleExplanation: 'Always learn nouns with their definite article (der = masculine, die = feminine, das = neuter). Plural nouns always use "die".',
    arabicWarning: {
      mistake: 'Der Tisch, der Katze, der Mädchen',
      correct: 'Der Tisch (m), die Katze (f), das Mädchen (n)',
      explanation: 'Arabic has no grammatical gender system like German. Arabic speakers often use "der" for everything because Arabic definite article ال has no gender.'
    },
    examples: [
      { de: 'Der Apfel ist rot.', en: 'The apple is red.', ar: 'التفاحة حمراء.' },
      { de: 'Die Frau liest.', en: 'The woman is reading.', ar: 'المرأة تقرأ.' },
      { de: 'Das Haus ist groß.', en: 'The house is big.', ar: 'البيت كبير.' }
    ],
    quiz: [
      {
        question: 'Which article is used for all plural nouns?',
        options: ['der', 'die', 'das', 'den'],
        correctAnswer: 1,
        explanation: 'All plural nouns in the nominative and accusative cases use "die".'
      },
      {
        question: 'True or False: "Das Mädchen" is neuter.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. Nouns ending in -chen are always neuter in German.'
      }
    ]
  },
  {
    id: 'nominative-a1',
    titleDE: 'Nominative Case',
    titleAR: 'حالة الرفع (Nominativ)',
    cefr: 'A1',
    intuitionEN: 'The nominative case is used for the subject of the sentence-the person or thing doing the action.',
    intuitionAR: 'تُستخدم حالة الرفع لفاعل الجملة - الشخص أو الشيء الذي يقوم بالفعل.',
    ruleExplanation: 'Use the base form of the articles: der, die, das, die (plural).',
    examples: [
      { de: 'Der Hund bellt.', en: 'The dog barks.', ar: 'الكلب ينبح.' }
    ],
    quiz: [
      {
        question: 'Identify the nominative in: "Die Katze schläft."',
        options: ['schläft', 'Die Katze'],
        correctAnswer: 1,
        explanation: '"Die Katze" is the subject performing the action.'
      }
    ]
  },
  {
    id: 'accusative-a1',
    titleDE: 'Accusative Case',
    titleAR: 'حالة النصب (Akkusativ)',
    cefr: 'A1',
    intuitionEN: 'The accusative case is used for the direct object-the receiver of the action.',
    intuitionAR: 'تُستخدم حالة النصب للمفعول به المباشر - متلقي الفعل.',
    ruleExplanation: 'Only the masculine article changes: "der" becomes "den", and "ein" becomes "einen".',
    arabicWarning: {
      mistake: 'Ich habe der Hund.',
      correct: 'Ich habe den Hund.',
      explanation: 'Arabic has cases (مرفوع/منصوب/مجرور) but German case rules differ completely - especially the accusative article changes.'
    },
    examples: [
      { de: 'Ich sehe den Mann.', en: 'I see the man.', ar: 'أنا أرى الرجل.' }
    ],
    quiz: [
      {
        question: 'Fill in the blank: Ich kaufe ___ Apfel (masculine).',
        options: ['ein', 'einen', 'einem'],
        correctAnswer: 1,
        explanation: '"Apfel" is masculine, so it becomes "einen" in the accusative.'
      }
    ]
  },
  {
    id: 'verb-conj-a1',
    titleDE: 'Verb Conjugation Present',
    titleAR: 'تصريف الأفعال في المضارع',
    cefr: 'A1',
    intuitionEN: 'Verbs change their ending based on the subject (I, you, he, we, etc.).',
    intuitionAR: 'الأفعال تغير نهايتها بناءً على الفاعل (أنا، أنت، هو، نحن، إلخ).',
    ruleExplanation: 'Remove the -en ending and add: -e, -st, -t, -en, -t, -en.',
    arabicWarning: {
      mistake: 'Ich trinken Wasser. (Using infinitive)',
      correct: 'Ich trinke Wasser.',
      explanation: 'In Arabic, the verb form depends heavily on gender and number. In German, ensure you match the person correctly. Do not just use the infinitive.'
    },
    examples: [
      { de: 'Ich lerne Deutsch.', en: 'I am learning German.', ar: 'أنا أتعلم الألمانية.' }
    ],
    quiz: [
      {
        question: 'Conjugate "kommen" for "du" (you):',
        options: ['kommst', 'kommt', 'komme'],
        correctAnswer: 0,
        explanation: '"du" takes the "-st" ending.'
      }
    ]
  },
  {
    id: 'dative-a2',
    titleDE: 'Dative Case',
    titleAR: 'حالة الجر (Dativ)',
    cefr: 'A2',
    intuitionEN: 'The dative case is for the indirect object (who is receiving something) or follows certain prepositions.',
    intuitionAR: 'تُستخدم حالة الجر للمفعول به غير المباشر (من يتلقى شيئاً) أو بعد حروف جر معينة.',
    ruleExplanation: 'Articles change: der/das -> dem, die -> der, die(pl) -> den + n.',
    examples: [
      { de: 'Ich gebe dem Mann das Buch.', en: 'I give the book to the man.', ar: 'أعطي الكتاب للرجل.' }
    ],
    quiz: [
      {
        question: 'Which article is dative for a feminine noun?',
        options: ['dem', 'den', 'der'],
        correctAnswer: 2,
        explanation: 'Feminine "die" changes to "der" in the dative case.'
      }
    ]
  },
  {
    id: 'adj-endings-a2',
    titleDE: 'Adjective Endings',
    titleAR: 'نهايات الصفات',
    cefr: 'A2',
    intuitionEN: 'Adjectives change their endings based on gender, case, and whether they follow an article.',
    intuitionAR: 'تتغير نهايات الصفات بناءً على الجنس والحالة وما إذا كانت تتبع أداة.',
    ruleExplanation: 'It depends heavily on the article before it. With definite articles, endings are mostly -e or -en.',
    examples: [
      { de: 'Der gute Mann', en: 'The good man', ar: 'الرجل الطيب' }
    ],
    quiz: [
      {
        question: 'Mit einem _____ Auto (das).',
        options: ['schnelles', 'schnellen', 'schnelle'],
        correctAnswer: 1,
        explanation: 'Dative neuter with indefinite article takes "-en".'
      }
    ]
  },
  {
    id: 'perfekt-a2',
    titleDE: 'Perfekt Tense',
    titleAR: 'الماضي التام (Perfekt)',
    cefr: 'A2',
    intuitionEN: 'This is the most common spoken past tense in German. Formed with haben/sein + past participle.',
    intuitionAR: 'هذا هو زمن الماضي الأكثر شيوعاً في المحادثة بالألمانية.',
    ruleExplanation: 'Use "haben" for most verbs. Use "sein" for verbs involving movement or change of state.',
    examples: [
      { de: 'Ich habe gegessen.', en: 'I have eaten.', ar: 'لقد أكلت.' },
      { de: 'Ich bin gegangen.', en: 'I went.', ar: 'لقد ذهبت.' }
    ],
    quiz: [
      {
        question: 'Which auxiliary verb is used with "fliegen" (to fly)?',
        options: ['haben', 'sein'],
        correctAnswer: 1,
        explanation: '"fliegen" involves movement from A to B, so it takes "sein".'
      }
    ]
  },
  {
    id: 'sub-clauses-b1',
    titleDE: 'Subordinate Clauses',
    titleAR: 'الجمل الجانبية (Nebensätze)',
    cefr: 'B1',
    intuitionEN: 'When joining sentences with connectors like "weil" or "dass", the conjugated verb goes to the very end.',
    intuitionAR: 'عند ربط الجمل بروابط مثل "weil" أو "dass"، يذهب الفعل المصرف إلى نهاية الجملة.',
    ruleExplanation: 'In a subordinate clause, the conjugated verb is pushed to the final position.',
    arabicWarning: {
      mistake: 'Ich lerne Deutsch, weil ich will arbeiten in Deutschland.',
      correct: 'Ich lerne Deutsch, weil ich in Deutschland arbeiten will.',
      explanation: 'In Arabic, the verb can come first (VSO order) or follow the subject. In German subordinate clauses, the verb MUST be in the absolute final position.'
    },
    examples: [
      { de: 'Ich bleibe zu Hause, weil ich krank bin.', en: 'I am staying home because I am sick.', ar: 'سأبقى في المنزل لأنني مريض.' }
    ],
    quiz: [
      {
        question: 'Where does the verb go after "dass"?',
        options: ['Position 2', 'The end'],
        correctAnswer: 1,
        explanation: '"dass" introduces a subordinate clause, sending the verb to the end.'
      }
    ]
  }
];

const CEFR_COLORS = {
  A1: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  A2: 'bg-blue-100 text-blue-800 border-blue-200',
  B1: 'bg-amber-100 text-amber-800 border-amber-200',
  B2: 'bg-violet-100 text-violet-800 border-violet-200'
};

export const GrammarView: React.FC = () => {
  const { grammarStatus, toggleGrammarStatus } = useApp();
  const [activeFilter, setActiveFilter] = useState<'All' | 'A1' | 'A2' | 'B1' | 'Weak'>('All');
  const [selectedConcept, setSelectedConcept] = useState<GrammarConcept | null>(null);

  // Quick Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const filteredConcepts = GRAMMAR_CONCEPTS.filter(concept => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Weak') return !grammarStatus[concept.id];
    return concept.cefr === activeFilter;
  });

  const handleConceptSelect = (concept: GrammarConcept) => {
    setSelectedConcept(concept);
    setQuizAnswers({});
    setShowResults({});
  };

  const handleQuizAnswer = (qIndex: number, optionIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
    setShowResults(prev => ({ ...prev, [qIndex]: true }));
  };

  if (selectedConcept) {
    const isLearned = grammarStatus[selectedConcept.id];
    
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <button 
          onClick={() => setSelectedConcept(null)}
          className="flex items-center text-text-muted hover:text-text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Concepts
        </button>

        <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${CEFR_COLORS[selectedConcept.cefr]}`}>
                  {selectedConcept.cefr}
                </span>
                {isLearned && (
                  <span className="flex items-center text-success text-sm font-medium bg-success-bg px-2.5 py-0.5 rounded-full">
                    <CheckCircle className="w-4 h-4 mr-1" /> Mastered
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-black text-text-primary mb-1">{selectedConcept.titleDE}</h1>
              <h2 className="text-xl font-cairo text-text-muted" dir="rtl">{selectedConcept.titleAR}</h2>
            </div>
            
            <button
              onClick={() => toggleGrammarStatus(selectedConcept.id)}
              className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
                isLearned 
                  ? 'bg-border text-text-secondary hover:bg-border-subtle'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
              }`}
            >
              {isLearned ? 'Mark as Unlearned' : 'Mark as Mastered'}
            </button>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-amber-500" /> Intuition
              </h3>
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <p className="text-text-secondary mb-3">{selectedConcept.intuitionEN}</p>
                <p className="font-cairo text-text-secondary text-right" dir="rtl">{selectedConcept.intuitionAR}</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">The Rule</h3>
              <div className="bg-surface rounded-xl p-5 border border-border shadow-sm">
                <p className="text-text-secondary">{selectedConcept.ruleExplanation}</p>
              </div>
            </section>

            {selectedConcept.arabicWarning && (
              <section>
                <div className="bg-danger-bg rounded-xl p-5 border border-danger/20">
                  <h3 className="text-danger font-bold mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" /> Common Arabic Speaker Mistake
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <X className="w-5 h-5 text-danger mr-2 shrink-0 mt-0.5" />
                      <p className="text-danger line-through opacity-80">{selectedConcept.arabicWarning.mistake}</p>
                    </div>
                    <div className="flex items-start">
                      <Check className="w-5 h-5 text-success mr-2 shrink-0 mt-0.5" />
                      <p className="text-success font-medium">{selectedConcept.arabicWarning.correct}</p>
                    </div>
                    <div className="pt-2 border-t border-danger/10 mt-2">
                      <p className="font-cairo text-sm text-danger/90 text-right" dir="rtl">
                        {selectedConcept.arabicWarning.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section>
              <h3 className="text-lg font-bold mb-3">Examples</h3>
              <div className="grid gap-3">
                {selectedConcept.examples.map((ex, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-bg hover:border-amber-200 transition-colors">
                    <p className="font-bold text-lg mb-1">{ex.de}</p>
                    <div className="flex justify-between items-center text-sm">
                      <p className="text-text-muted">{ex.en}</p>
                      <p className="font-cairo text-text-secondary" dir="rtl">{ex.ar}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-3">Quick Quiz</h3>
              <div className="space-y-6">
                {selectedConcept.quiz.map((q, qIndex) => {
                  const answered = showResults[qIndex];
                  const isCorrect = quizAnswers[qIndex] === q.correctAnswer;
                  
                  return (
                    <div key={qIndex} className="bg-surface border border-border rounded-xl p-5">
                      <p className="font-medium mb-4">{q.question}</p>
                      <div className="grid gap-2">
                        {q.options.map((opt, optIdx) => {
                          let btnClass = "text-left px-4 py-3 rounded-lg border transition-all ";
                          
                          if (!answered) {
                            btnClass += "border-border hover:border-amber-400 hover:bg-amber-50";
                          } else {
                            if (optIdx === q.correctAnswer) {
                              btnClass += "border-success bg-success-bg text-success font-medium";
                            } else if (optIdx === quizAnswers[qIndex]) {
                              btnClass += "border-danger bg-danger-bg text-danger line-through opacity-70";
                            } else {
                              btnClass += "border-border opacity-50";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={answered}
                              onClick={() => handleQuizAnswer(qIndex, optIdx)}
                              className={btnClass}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      
                      {answered && (
                        <div className={`mt-4 p-3 rounded-lg text-sm flex items-start ${isCorrect ? 'bg-success-bg text-success' : 'bg-danger-bg text-danger'}`}>
                          {isCorrect ? <CheckCircle className="w-5 h-5 mr-2 shrink-0" /> : <AlertTriangle className="w-5 h-5 mr-2 shrink-0" />}
                          <p>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">Grammar Explorer</h1>
        <p className="text-text-muted">Master German grammar with Arabic context and intuition.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {['All', 'A1', 'A2', 'B1', 'Weak'].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter 
                ? 'bg-amber-500 text-white shadow-sm' 
                : 'bg-surface border border-border text-text-secondary hover:bg-border-subtle'
            }`}
          >
            {filter === 'Weak' ? 'My Weak Points' : filter}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredConcepts.map(concept => {
          const isLearned = grammarStatus[concept.id];
          return (
            <button
              key={concept.id}
              onClick={() => handleConceptSelect(concept)}
              className="group text-left bg-surface rounded-2xl p-5 border border-border hover:border-amber-400 hover:shadow-md transition-all relative overflow-hidden"
            >
              {isLearned && (
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CheckCircle className="w-16 h-16" />
                </div>
              )}
              
              <div className="flex items-center justify-between mb-3 relative z-10">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${CEFR_COLORS[concept.cefr]}`}>
                  {concept.cefr}
                </span>
                {isLearned && <CheckCircle className="w-5 h-5 text-success" />}
              </div>
              
              <h3 className="font-bold text-lg mb-1 relative z-10 group-hover:text-amber-600 transition-colors">
                {concept.titleDE}
              </h3>
              <p className="font-cairo text-text-muted text-sm relative z-10" dir="rtl">
                {concept.titleAR}
              </p>
            </button>
          );
        })}
        {filteredConcepts.length === 0 && (
          <div className="col-span-full py-12 text-center text-text-muted">
            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No concepts found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
