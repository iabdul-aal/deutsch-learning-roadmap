import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ASSESSMENTS_DATA } from '../data/tracks/german-a1-ar/assessments';
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';

export const WeeklyAssessmentsView = () => {
  const { addWeakTopic } = useApp();
  const tests = ASSESSMENTS_DATA?.assessments || [];
  const [selectedWeekNum, setSelectedWeekNum] = useState(1);
  const [userAnswers, setUserAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  const activeTest = tests.find((t) => t.weekNumber === selectedWeekNum) || tests[0];
  const questionsList = activeTest?.questions || [];

  const handleOptionSelect = (qIdx, optIdx) => {
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const evaluateTest = () => {
    let score = 0;
    const total = questionsList.length;
    const flaggedTopics = [];

    questionsList.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        score++;
      } else {
        if (q.topicTag) flaggedTopics.push(q.topicTag);
      }
    });

    const percent = Math.round((score / (total || 1)) * 100);
    setTestResult({ score, total, percent, flaggedTopics });

    flaggedTopics.forEach((tag) => addWeakTopic(tag));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="paper-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
            WEEKLY TEST ARENA
          </span>
          <h2 className="text-lg font-extrabold text-stone-900 mt-0.5">
            8 Weekly Comprehensive Assessments
          </h2>
          <p className="text-xs text-stone-600">
            Automated evaluation & weak topic detection. Flagged topics are pushed to your Targeted Review queue.
          </p>
        </div>
      </div>

      {/* Week Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        {tests.map((t) => (
          <button
            key={t.weekNumber}
            onClick={() => {
              setSelectedWeekNum(t.weekNumber);
              setTestResult(null);
              setUserAnswers({});
            }}
            className={`px-4 py-2 rounded border font-bold whitespace-nowrap transition-all ${
              selectedWeekNum === t.weekNumber
                ? 'bg-amber-500 text-stone-950 border-amber-500 font-extrabold shadow-sm'
                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            Week {t.weekNumber} Test
          </button>
        ))}
      </div>

      {/* Active Test Arena Card */}
      <div className="paper-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div>
            <span className="text-[10px] font-black text-amber-700 uppercase">WEEK {activeTest?.weekNumber} TEST</span>
            <h3 className="text-xl font-extrabold text-stone-900">{activeTest?.title}</h3>
          </div>

          {testResult && (
            <div className={`px-4 py-1.5 rounded font-black text-xs border ${
              testResult.percent >= 80 ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              Score: {testResult.score} / {testResult.total} ({testResult.percent}%)
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {questionsList.map((q, qIdx) => (
            <div key={q.id || qIdx} className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <p className="font-bold text-stone-900 text-sm">
                  {qIdx + 1}. {q.question}
                </p>
                {q.topicTitle && (
                  <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                    {q.topicTitle}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[qIdx] === optIdx;
                  const isCorrect = q.correctIndex === optIdx;

                  let style = 'bg-stone-50 border-stone-200 text-stone-700 hover:border-stone-400';
                  if (testResult) {
                    if (isCorrect) style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                    else if (isSelected && !isCorrect) style = 'bg-rose-100 border-rose-400 text-rose-950 font-bold';
                  } else if (isSelected) {
                    style = 'bg-amber-100 border-amber-400 text-amber-950 font-bold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(qIdx, optIdx)}
                      disabled={Boolean(testResult)}
                      className={`p-3 rounded border text-left text-xs transition-all ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {testResult && q.explanation && (
                <p className="text-[11px] text-stone-600 italic bg-stone-50 p-2 rounded border border-stone-200">
                  Note:  Explanation: {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        {!testResult ? (
          <button
            onClick={evaluateTest}
            className="w-full py-3 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs transition-all shadow-sm"
          >
            Submit Test & Grade Performance
          </button>
        ) : (
          <div className="p-4 rounded bg-stone-50 border border-stone-200 space-y-2 text-center">
            <h4 className="text-sm font-extrabold text-stone-900">Test Evaluation Complete!</h4>
            {testResult.flaggedTopics.length > 0 && (
              <p className="text-xs text-amber-800 font-bold">
                Alert:  Added weak topics to your Targeted Review queue: {testResult.flaggedTopics.join(', ')}
              </p>
            )}
            <button
              onClick={() => { setTestResult(null); setUserAnswers({}); }}
              className="px-4 py-1.5 rounded bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs"
            >
              Retake Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
