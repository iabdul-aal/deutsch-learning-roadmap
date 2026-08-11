import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ASSESSMENTS_DATA } from '../data/tracks/german-a1-ar/assessments';
import { ASSESSMENTS_DATA_A2 } from '../data/tracks/german-a2-ar/assessments';
import { ASSESSMENTS_DATA_B1 } from '../data/tracks/german-b1-ar/assessments';
import { CheckCircle2, AlertTriangle, HelpCircle, Trophy } from 'lucide-react';

// Dynamically resolve assessments data based on active track
function getAssessmentsForTrack(trackId: string) {
  if (trackId === 'german-a2-ar') return ASSESSMENTS_DATA_A2;
  if (trackId === 'german-b1-ar') return ASSESSMENTS_DATA_B1;
  return ASSESSMENTS_DATA;
}

export const WeeklyAssessmentsView: React.FC = () => {
  const { addWeakTopic, currentTrackId, setActiveView } = useApp();
  const trackAssessments = getAssessmentsForTrack(currentTrackId);
  const tests = trackAssessments?.assessments || [];
  const [selectedWeekNum, setSelectedWeekNum] = useState(1);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [testResult, setTestResult] = useState<{ score: number; total: number; percent: number; flaggedTopics: string[] } | null>(null);

  const activeTest = tests.find((t) => t.weekNumber === selectedWeekNum) || tests[0];
  const questionsList = activeTest?.questions || [];

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const evaluateTest = () => {
    let score = 0;
    const total = questionsList.length;
    const flaggedTopics: string[] = [];

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
      <div className="paper-card p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="w-full min-w-0">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
            WEEKLY TEST ARENA
          </span>
          <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-tight">
            8 Weekly Comprehensive Assessments
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Automated evaluation and weak topic detection. Flagged topics are pushed to your Targeted Review queue.
          </p>
        </div>
      </div>

      {/* Week Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none w-full min-w-0">
        {tests.map((t) => (
          <button
            key={t.weekNumber}
            onClick={() => {
              setSelectedWeekNum(t.weekNumber);
              setTestResult(null);
              setUserAnswers({});
            }}
            className={`px-3.5 sm:px-4 py-2 rounded border font-bold whitespace-nowrap transition-all shrink-0 ${
              selectedWeekNum === t.weekNumber
                ? 'bg-amber-500 text-stone-950 border-amber-500 font-extrabold shadow-xs'
                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
          >
            Week {t.weekNumber} Test
          </button>
        ))}
      </div>

      {/* Active Test Arena Card - Full Mobile Width Title Header */}
      <div className="paper-card p-4 sm:p-6 space-y-6 w-full min-w-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200 pb-4 w-full min-w-0">
          <div className="w-full min-w-0 space-y-1">
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">
              WEEK {activeTest?.weekNumber} TEST
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900 leading-tight w-full break-words">
              {activeTest?.title}
            </h3>
          </div>

          {testResult && (
            <div className={`px-4 py-1.5 rounded font-black text-xs border shrink-0 w-full sm:w-auto text-center ${
              testResult.percent >= 80 ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              Score: {testResult.score} / {testResult.total} ({testResult.percent}%)
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-6 w-full min-w-0">
          {questionsList.map((q, qIdx) => (
            <div key={q.id || qIdx} className="space-y-2 text-xs w-full min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 w-full min-w-0">
                <p className="font-bold text-stone-900 text-sm leading-snug w-full min-w-0 break-words">
                  {qIdx + 1}. {q.question}
                </p>
                {q.topicTitle && (
                  <span className="text-[10px] font-mono font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 shrink-0">
                    {q.topicTitle}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full min-w-0">
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
                      className={`p-3 rounded border text-left text-xs transition-all w-full min-w-0 break-words ${style}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {testResult && q.explanation && (
                <p className="text-[11px] text-stone-600 italic bg-stone-50 p-2.5 rounded border border-stone-200 w-full min-w-0 break-words">
                  Note: Explanation: {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        {!testResult ? (
          <button
            onClick={evaluateTest}
            className="w-full py-3 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs transition-all shadow-xs active:scale-[0.99]"
          >
            Submit Test and Grade Performance
          </button>
        ) : (
          <div className={`p-4 rounded-xl border space-y-3 text-center w-full min-w-0 ${
            testResult.percent >= 80
              ? 'bg-emerald-50 border-emerald-300'
              : testResult.percent >= 60
              ? 'bg-amber-50 border-amber-300'
              : 'bg-rose-50 border-rose-200'
          }`}>
            <div className="text-2xl">{testResult.percent >= 80 ? '' : testResult.percent >= 60 ? '' : ''}</div>
            <h4 className="text-sm font-extrabold text-stone-900">
              Score: {testResult.score}/{testResult.total} ({testResult.percent}%)
            </h4>
            <p className="text-xs text-stone-600">
              {testResult.percent >= 80
                ? 'Excellent! You have mastered this week\'s material.'
                : testResult.percent >= 60
                ? 'Good effort! Review the flagged topics below.'
                : 'Keep practicing - focus on the grammar concepts below.'}
            </p>
            {testResult.flaggedTopics.length > 0 && (
              <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-left space-y-1">
                <p className="font-bold">️ Weak topics flagged for review:</p>
                <p className="text-stone-700">{testResult.flaggedTopics.join(' · ')}</p>
              </div>
            )}
            <div className="flex gap-2 justify-center flex-wrap">
              <button
                onClick={() => { setTestResult(null); setUserAnswers({}); }}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-all"
              >
                Retake Test
              </button>
              {testResult.flaggedTopics.length > 0 && (
                <button
                  onClick={() => setActiveView('grammar')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-all"
                >
                  Review Grammar Now →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
