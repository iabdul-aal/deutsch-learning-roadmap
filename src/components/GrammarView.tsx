import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GRAMMAR_DATA } from '../data/tracks/german-a1-ar/grammar';
import { 
  FileText, CheckCircle2, ChevronRight, HelpCircle
} from 'lucide-react';

export const GrammarView = () => {
  const { grammarStatus, toggleGrammarStatus, addWeakTopic } = useApp();
  const modules = GRAMMAR_DATA?.modules || [];
  const [selectedModuleId, setSelectedModuleId] = useState(modules[0]?.id || 'g1_sentence_v2');

  const [activeQuizAnswers, setActiveQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const activeModule = modules.find((m) => m.id === selectedModuleId) || modules[0];
  const isModuleMastered = Boolean(grammarStatus[activeModule?.id]);

  const handleQuizAnswer = (qIdx, optIdx) => {
    setActiveQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    let wrongCount = 0;
    activeModule?.miniQuiz?.questions?.forEach((q, idx) => {
      if (activeQuizAnswers[idx] !== q.correct) {
        wrongCount++;
      }
    });

    if (wrongCount > 0) {
      addWeakTopic(activeModule.id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="paper-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
            18 CORE A1 GRAMMAR MODULES
          </span>
          <h2 className="text-lg font-extrabold text-stone-900 mt-0.5">
            German Grammar Rulebook & Interactive Quiz Arena
          </h2>
          <p className="text-xs text-stone-600">
            Formulas, Arabic explanations, side-by-side examples, and automated weak topic tagging.
          </p>
        </div>

        <span className="px-3 py-1 rounded bg-stone-100 border border-stone-300 text-amber-900 font-mono text-xs font-bold">
          Mastered: {Object.values(grammarStatus).filter(Boolean).length} / 18 Modules
        </span>
      </div>

      {/* 2-Column Split Pane */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: 18 Modules List */}
        <div className="md:col-span-4 space-y-1.5">
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider px-1 mb-2">
            A1 Grammar Modules
          </div>

          <div className="space-y-1">
            {modules.map((mod, idx) => {
              const isSelected = mod.id === selectedModuleId;
              const isMastered = Boolean(grammarStatus[mod.id]);

              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setSelectedModuleId(mod.id);
                    setQuizSubmitted(false);
                    setActiveQuizAnswers({});
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded border text-xs text-left font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-100/80 border-amber-400 text-amber-950 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-400 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-stone-500">#{idx + 1}</span>
                    <span className="line-clamp-1">{mod.title}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isMastered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-700' : 'text-stone-400'}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Module Rulebook & Quiz Arena */}
        <div className="md:col-span-8 space-y-5">
          
          {/* Module Rulebook Card */}
          <div className="paper-card p-6 space-y-4">
            
            {/* Title & Mastery Toggle */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-700">GRAMMAR MODULE</span>
                <h3 className="text-xl font-extrabold text-stone-900">{activeModule?.title}</h3>
              </div>

              <button
                onClick={() => toggleGrammarStatus(activeModule.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all border ${
                  isModuleMastered
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-stone-100 text-stone-700 border-stone-300 hover:border-amber-500'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isModuleMastered ? 'Mastered [Done]' : 'Mark Mastered'}</span>
              </button>
            </div>

            {/* Formula Box */}
            {activeModule?.formula && (
              <div className="p-3.5 rounded bg-amber-50 border border-amber-300 text-amber-950 font-mono text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">Standard Formula Rule:</span>
                <p className="font-extrabold text-sm">{activeModule.formula}</p>
              </div>
            )}

            {/* Arabic Explanation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Arabic Conceptual Explanation</h4>
              <div className="p-4 rounded bg-stone-50 border border-stone-200 font-arabic text-sm text-stone-800 leading-relaxed text-right dir-rtl">
                {activeModule?.explanation}
              </div>
            </div>

            {/* Side-by-Side Examples */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider">German vs Arabic Examples</h4>
              <div className="space-y-2">
                {activeModule?.examples?.map((ex, i) => (
                  <div key={i} className="p-3 rounded bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-stone-900 text-sm">{ex.german}</span>
                    <span className="font-arabic text-amber-900 font-bold dir-rtl">{ex.arabic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mini-Quiz Arena */}
          {activeModule?.miniQuiz && (
            <div className="paper-card p-6 space-y-4">
              <div className="flex items-center gap-2 text-indigo-700 border-b border-stone-200 pb-3">
                <HelpCircle className="w-5 h-5" />
                <h4 className="text-sm font-extrabold text-stone-900 uppercase tracking-wider">
                  Mini-Quiz Arena: Test Your Understanding
                </h4>
              </div>

              <div className="space-y-4">
                {activeModule.miniQuiz.questions.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-2 text-xs">
                    <p className="font-bold text-stone-800">
                      {qIdx + 1}. {q.prompt}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = activeQuizAnswers[qIdx] === optIdx;
                        const isCorrect = q.correct === optIdx;

                        let style = 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400';
                        if (quizSubmitted) {
                          if (isCorrect) style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                          else if (isSelected && !isCorrect) style = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                        } else if (isSelected) {
                          style = 'bg-indigo-100 border-indigo-400 text-indigo-950 font-bold';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleQuizAnswer(qIdx, optIdx)}
                            disabled={quizSubmitted}
                            className={`p-2.5 rounded border text-left text-xs transition-all ${style}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={submitQuiz}
                  className="w-full py-2.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all mt-4"
                >
                  Submit Answers & Evaluate
                </button>
              ) : (
                <div className="p-3 rounded bg-stone-50 border border-stone-200 text-xs text-center space-y-2">
                  <span className="font-bold text-emerald-700">Quiz Completed!</span>
                  <button
                    onClick={() => { setQuizSubmitted(false); setActiveQuizAnswers({}); }}
                    className="block mx-auto px-4 py-1 rounded bg-stone-200 text-stone-800 hover:bg-stone-300 font-bold text-xs"
                  >
                    Retake Quiz
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
