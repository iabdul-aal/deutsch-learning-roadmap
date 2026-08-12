import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { KNOWLEDGE_GRAPH, GrammarConcept as KGConcept } from '../data/knowledgeGraph';
import { ARABIC_ERRORS, ArabicError } from '../data/arabicErrors';
import {
  ArrowLeft, AlertTriangle, CheckCircle, Check, X, BookOpen,
  Search, Volume2, Sparkles, HelpCircle, ChevronRight, Award, Flame
} from 'lucide-react';

type CEFRFilter = 'All' | 'A1' | 'A2' | 'B1' | 'B2' | 'Weak';

const CEFR_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  A1: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  A2: { bg: 'bg-blue-500/15',    text: 'text-blue-400',    border: 'border-blue-500/30' },
  B1: { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/30' },
  B2: { bg: 'bg-violet-500/15',  text: 'text-violet-400',  border: 'border-violet-500/30' },
  C1: { bg: 'bg-rose-500/15',    text: 'text-rose-400',    border: 'border-rose-500/30' },
};

// Web Speech API helper for native German pronunciation
const speakGermanText = (text: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

export const GrammarView: React.FC = () => {
  const { currentTrackId, grammarStatus, toggleGrammarStatus, markConceptMastered } = useApp();
  
  const defaultFilter: CEFRFilter = currentTrackId.includes('a2') ? 'A2' : currentTrackId.includes('b1') ? 'B1' : 'A1';
  const [activeFilter, setActiveFilter] = useState<CEFRFilter>(defaultFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<Record<number, boolean>>({});

  const selectedConcept = useMemo(() => {
    return KNOWLEDGE_GRAPH.find(c => c.id === selectedConceptId) || null;
  }, [selectedConceptId]);

  // Find linked Arabic transfer errors for selected concept
  const linkedArabicErrors = useMemo(() => {
    if (!selectedConcept) return [];
    const ids = selectedConcept.arabicErrorIds || [];
    return ARABIC_ERRORS.filter(err => ids.includes(err.id) || err.conceptId === selectedConcept.id);
  }, [selectedConcept]);

  // Filter concepts based on tab & search query
  const filteredConcepts = useMemo(() => {
    return KNOWLEDGE_GRAPH.filter(concept => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        concept.titleDE.toLowerCase().includes(q) ||
        concept.titleAR.toLowerCase().includes(q) ||
        concept.description.toLowerCase().includes(q) ||
        concept.intuition.toLowerCase().includes(q)
      );

      if (!matchesSearch) return false;

      if (activeFilter === 'All') return true;
      if (activeFilter === 'Weak') return !grammarStatus[concept.id];
      return concept.cefr === activeFilter;
    });
  }, [activeFilter, searchQuery, grammarStatus]);

  const masteredCount = useMemo(() => {
    return KNOWLEDGE_GRAPH.filter(c => grammarStatus[c.id]).length;
  }, [grammarStatus]);

  const handleConceptSelect = (conceptId: string) => {
    setSelectedConceptId(conceptId);
    setQuizAnswers({});
    setShowResults({});
  };

  const handleQuizAnswer = (qIndex: number, optionIndex: number, correctIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
    setShowResults(prev => ({ ...prev, [qIndex]: true }));

    // If answered correctly and concept selected, calculate score and update mastery
    if (optionIndex === correctIndex && selectedConcept) {
      markConceptMastered(selectedConcept.id, 90);
    }
  };

  // ── Detail Concept View ─────────────────────────────────────────────
  if (selectedConcept) {
    const isLearned = !!grammarStatus[selectedConcept.id];
    const badgeStyle = CEFR_BADGES[selectedConcept.cefr] || CEFR_BADGES['A1'];

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-right-4 duration-300">
        <button
          onClick={() => setSelectedConceptId(null)}
          className="flex items-center gap-2 text-stone-600 hover:text-[#855f39] dark:text-stone-400 dark:hover:text-amber-400 font-semibold mb-6 transition-all text-sm active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Grammar Library</span>
        </button>

        <div className="bg-white dark:bg-[#141419] rounded-2xl p-6 md:p-8 border border-[#e5e1d8] dark:border-white/10 shadow-xl space-y-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e5e1d8] dark:border-white/10 pb-6">
            <div className="space-y-2 min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                  {selectedConcept.cefr} MODULE
                </span>
                {isLearned ? (
                  <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-1 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" /> Mastered
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[#855f39] dark:text-amber-400 text-xs font-bold bg-amber-50 dark:bg-amber-500/10 border border-[#e5e1d8] dark:border-amber-500/20 px-3 py-1 rounded-full">
                    <Flame className="w-3.5 h-3.5" /> In Progress
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-white">{selectedConcept.titleDE}</h1>
                <button
                  onClick={() => speakGermanText(selectedConcept.titleDE)}
                  className="p-2 rounded-xl bg-[#b68c61]/10 hover:bg-[#b68c61]/20 text-[#855f39] dark:text-amber-400 transition-all border border-[#b68c61]/30 active:scale-95 shadow-sm"
                  title="Listen to German Pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-sm font-semibold text-stone-500 dark:text-stone-400">{selectedConcept.titleAR}</h2>
            </div>

            <button
              onClick={() => toggleGrammarStatus(selectedConcept.id)}
              className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 ${
                isLearned
                  ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15 border border-stone-200 dark:border-white/10'
                  : 'bg-[#b68c61] hover:bg-[#855f39] text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 shadow-[#b68c61]/20'
              }`}
            >
              {isLearned ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Mark as Unmastered</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Mark as Mastered</span>
                </>
              )}
            </button>
          </div>

          {/* Description & Intuition */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> الفكرة والنطق النحوي (Intuition & Concept)
            </h3>
            <div className="bg-[#1c1c24] rounded-2xl p-5 border border-white/10 space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-mono">German Rule Description</span>
                <p className="text-sm text-stone-300 font-medium leading-relaxed">{selectedConcept.description}</p>
              </div>
              <div className="pt-3 border-t border-white/10 space-y-1" dir="rtl">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest font-mono">الشرح والفهم العربي:</span>
                <p className="font-cairo text-sm text-amber-200/90 leading-relaxed">{selectedConcept.intuitionAR}</p>
              </div>
            </div>
          </section>

          {/* Arabic Transfer Warnings */}
          {linkedArabicErrors.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> أخطاء متحدثي العربية الشائعة (Arabic Transfer Errors)
              </h3>
              <div className="space-y-3">
                {linkedArabicErrors.map((err) => (
                  <div key={err.id} className="bg-rose-500/10 border border-rose-500/25 rounded-2xl p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2" dir="rtl">
                      <span className="text-xs font-bold text-rose-400 font-cairo">مصدر الخطأ: {err.arabicSource}</span>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono uppercase">
                        {err.errorType}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                      <div className="bg-black/30 p-3 rounded-xl border border-rose-500/20 space-y-1">
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <X className="w-3.5 h-3.5" /> الخطأ الشائع (Mistake):
                        </span>
                        <p className="font-mono text-rose-200 line-through">{err.commonMistake}</p>
                      </div>
                      <div className="bg-black/30 p-3 rounded-xl border border-emerald-500/20 space-y-1">
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> الصياغة الصحيحة (Correct):
                        </span>
                        <p className="font-mono text-emerald-300 font-bold">{err.correction}</p>
                      </div>
                    </div>

                    <p className="font-cairo text-xs text-rose-100/90 text-right leading-relaxed pt-1" dir="rtl">
                      💡 {err.explanationAR}
                    </p>

                    {err.mnemonicAR && (
                      <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl text-[11px] text-amber-300 font-cairo text-right" dir="rtl">
                        🧠 مهارة التذكر: {err.mnemonicAR}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Prerequisites */}
          {selectedConcept.prerequisites && selectedConcept.prerequisites.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-widest">
                المتطلبات السابقة (Prerequisites)
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedConcept.prerequisites.map(preId => {
                  const pre = KNOWLEDGE_GRAPH.find(c => c.id === preId);
                  if (!pre) return null;
                  return (
                    <button
                      key={preId}
                      onClick={() => handleConceptSelect(preId)}
                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-amber-400 flex items-center gap-1.5 transition-all"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{pre.titleDE} ({pre.titleAR})</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Interactive Quiz */}
          {selectedConcept.masteryTest && selectedConcept.masteryTest.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> اختبار التمكن السريع (Quick Mastery Quiz)
              </h3>
              <div className="space-y-5">
                {selectedConcept.masteryTest.map((q, qIndex) => {
                  const answered = showResults[qIndex];
                  const isCorrect = quizAnswers[qIndex] === q.correctIndex;

                  return (
                    <div key={qIndex} className="bg-[#1a1a22] border border-white/10 rounded-2xl p-5 space-y-4">
                      <p className="font-bold text-sm text-white">{qIndex + 1}. {q.question}</p>
                      
                      <div className="grid gap-2">
                        {q.options.map((opt, optIdx) => {
                          let btnStyle = "w-full text-left px-4 py-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ";

                          if (!answered) {
                            btnStyle += "bg-white/5 border-white/10 text-stone-200 hover:border-amber-400/50 hover:bg-amber-500/10";
                          } else {
                            if (optIdx === q.correctIndex) {
                              btnStyle += "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold";
                            } else if (optIdx === quizAnswers[qIndex]) {
                              btnStyle += "bg-rose-500/20 border-rose-500/50 text-rose-300 line-through";
                            } else {
                              btnStyle += "bg-white/3 border-white/5 text-white/30";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              disabled={answered}
                              onClick={() => handleQuizAnswer(qIndex, optIdx, q.correctIndex)}
                              className={btnStyle}
                            >
                              <span>{opt}</span>
                              {answered && optIdx === q.correctIndex && (
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                              )}
                              {answered && optIdx === quizAnswers[qIndex] && optIdx !== q.correctIndex && (
                                <X className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {answered && (
                        <div className={`p-4 rounded-xl text-xs space-y-1 ${
                          isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border border-rose-500/20 text-rose-300'
                        }`}>
                          <div className="flex items-center gap-1.5 font-bold">
                            {isCorrect ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                            <span>{isCorrect ? 'إجابة صحيحة!' : 'توضيح الإجابة:'}</span>
                          </div>
                          <p className="text-white/80">{q.explanation}</p>
                          <p className="font-cairo text-white/90 pt-1" dir="rtl">{q.explanationAR}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // ── Grid Main Explorer View ─────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#141419] p-6 rounded-2xl border border-[#e5e1d8] dark:border-white/10 shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Grammar Knowledge Graph</span>
            <Sparkles className="w-6 h-6 text-[#b68c61] dark:text-amber-400" />
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Master German grammar structures step by step with clear rules, audio pronunciation, and exercise quizzes.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-[#b68c61]/10 dark:bg-amber-500/10 border border-[#b68c61]/30 dark:border-amber-500/20 px-4 py-2.5 rounded-xl text-center shadow-sm">
            <div className="text-xl font-black text-[#855f39] dark:text-amber-400 font-mono">{masteredCount} / {KNOWLEDGE_GRAPH.length}</div>
            <div className="text-[10px] text-stone-600 dark:text-white/50 uppercase tracking-widest font-bold">Concepts Mastered</div>
          </div>
        </div>
      </div>

      {/* Controls: Search & Level Tabs */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400 dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search grammar concepts by German or English title..."
            className="w-full bg-white dark:bg-[#141419] border border-[#e5e1d8] dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-white/40 focus:outline-none focus:border-[#b68c61] dark:focus:border-amber-400 transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(['All', 'A1', 'A2', 'B1', 'B2', 'Weak'] as CEFRFilter[]).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === filter
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'bg-[#141419] border border-white/10 text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter === 'Weak' ? (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>نقاط ضعفي ({KNOWLEDGE_GRAPH.filter(c => !grammarStatus[c.id]).length})</span>
                </>
              ) : (
                <span>{filter === 'All' ? 'جميع المستويات' : `مستوى ${filter}`}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Concept Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredConcepts.map(concept => {
          const isLearned = !!grammarStatus[concept.id];
          const badgeStyle = CEFR_BADGES[concept.cefr] || CEFR_BADGES['A1'];

          return (
            <div
              key={concept.id}
              onClick={() => handleConceptSelect(concept.id)}
              className="group cursor-pointer bg-[#141419] rounded-2xl p-5 border border-white/10 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border}`}>
                    {concept.cefr}
                  </span>
                  {isLearned ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" /> متمكن
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-white/30">
                      ~{concept.estimatedMinutes}m
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                    {concept.titleDE}
                  </h3>
                  <p className="font-cairo text-xs text-amber-300/80 font-semibold mt-0.5" dir="rtl">
                    {concept.titleAR}
                  </p>
                </div>

                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                  {concept.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-amber-400 font-medium relative z-10">
                <span>استكشف القاعدة</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}

        {filteredConcepts.length === 0 && (
          <div className="col-span-full py-16 text-center bg-[#141419] rounded-2xl border border-white/10 space-y-3">
            <BookOpen className="w-12 h-12 text-white/20 mx-auto" />
            <p className="text-sm font-bold text-white/60">لم يتم العثور على قواعد تطابق خيارات البحث.</p>
            <button
              onClick={() => { setActiveFilter('All'); setSearchQuery(''); }}
              className="text-xs text-amber-400 underline font-semibold hover:text-amber-300"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
