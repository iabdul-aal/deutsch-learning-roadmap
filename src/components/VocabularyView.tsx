import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { A1_VOCABULARY } from '../data/vocabulary/a1-core';
import type { VocabWord } from '../data/vocabulary/a1-core';
import {
  Search, Brain, Check, X, RotateCcw, ChevronRight,
  Star, BookOpen, TrendingUp, Flame, Clock, Trophy,
} from 'lucide-react';

// ── Article colour coding (pedagogical best practice) ────────────
const ARTICLE_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  der: { text: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  die: { text: 'text-rose-700',   bg: 'bg-rose-50',   border: 'border-rose-200' },
  das: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
};

// ── SRS quality labels ────────────────────────────────────────────
const QUALITY_BUTTONS = [
  { quality: 1 as const, label: 'Again',  labelAR: 'مجدداً',  color: 'bg-rose-500 hover:bg-rose-600 text-white', icon: X },
  { quality: 2 as const, label: 'Hard',   labelAR: 'صعب',     color: 'bg-orange-400 hover:bg-orange-500 text-white', icon: RotateCcw },
  { quality: 4 as const, label: 'Good',   labelAR: 'جيد',     color: 'bg-amber-500 hover:bg-amber-600 text-stone-900', icon: Check },
  { quality: 5 as const, label: 'Easy',   labelAR: 'سهل',     color: 'bg-emerald-500 hover:bg-emerald-600 text-white', icon: Star },
] as const;

type QualityValue = 1 | 2 | 4 | 5;

const MAX_DAILY_NEW = 20;
const MAX_SESSION_CARDS = 30;

// ── Flashcard ────────────────────────────────────────────────────
const FlashCard: React.FC<{
  word: VocabWord;
  isFlipped: boolean;
  onFlip: () => void;
}> = ({ word, isFlipped, onFlip }) => {
  const ac = word.article ? ARTICLE_COLORS[word.article] : null;

  return (
    <div
      className="relative w-full cursor-pointer select-none"
      style={{ perspective: '1200px' }}
      onClick={onFlip}
      role="button"
      aria-label={`Flashcard: ${word.german}. Press to reveal Arabic translation.`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onFlip(); }}
    >
      {/* Card container with flip animation */}
      <div
        className="relative w-full transition-transform duration-500 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          minHeight: '260px',
        }}
      >
        {/* Front - German */}
        <div
          className="absolute inset-0 rounded-2xl border border-stone-200 bg-white shadow-sm p-6 flex flex-col items-center justify-center gap-3"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {word.article && ac && (
            <span className={`text-xs font-black px-3 py-1 rounded-full border ${ac.bg} ${ac.text} ${ac.border}`}>
              {word.article}
            </span>
          )}
          <p className="text-4xl font-black text-stone-900 text-center leading-tight">
            {word.german}
          </p>
          {word.plural && (
            <p className="text-xs text-stone-400">
              Pl: {word.plural}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold text-stone-300 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-100 uppercase">
              {word.wordType}
            </span>
            <span className="text-[10px] font-bold text-stone-300 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-100">
              {word.semanticField}
            </span>
          </div>
          <p className="text-xs text-stone-400 text-center mt-2 italic">
            {word.exampleDE}
          </p>
          <p className="text-[11px] text-stone-300 mt-1 animate-pulse-soft">
            Tap to reveal ↓
          </p>
        </div>

        {/* Back - Arabic + English */}
        <div
          className="absolute inset-0 rounded-2xl border border-amber-200 bg-amber-50 shadow-sm p-6 flex flex-col items-center justify-center gap-3"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <p className="text-3xl font-black text-amber-900 text-center leading-tight" dir="rtl">
            {word.arabic}
          </p>
          <p className="text-sm text-stone-600 font-medium">{word.english}</p>
          <p className="text-xs text-stone-500 text-center italic">{word.exampleDE}</p>
          <p className="text-[11px] text-stone-400 text-center" dir="rtl">
            {word.exampleAR}
          </p>
          {word.nounGenderHint && (
            <div className="bg-white border border-amber-200 rounded-xl px-3 py-2 text-[11px] text-amber-800 text-center mt-1" dir="rtl">
               {word.nounGenderHint}
            </div>
          )}
          {word.commonMistakeAR && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl px-3 py-1.5 text-[11px] text-rose-700 text-center" dir="rtl">
              ️ {word.commonMistakeAR}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Browse Card ───────────────────────────────────────────────────
const BrowseCard: React.FC<{ word: VocabWord; srsState?: string }> = ({ word, srsState }) => {
  const ac = word.article ? ARTICLE_COLORS[word.article] : null;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
      <button
        className="w-full flex items-center gap-3 p-3 text-left"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        {word.article && ac ? (
          <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border ${ac.bg} ${ac.text} ${ac.border}`}>
            {word.article}
          </span>
        ) : (
          <span className="w-10 h-10 rounded-lg bg-stone-50 flex items-center justify-center text-xs font-bold text-stone-400 shrink-0 border border-stone-100">
            {word.wordType.slice(0, 3).toUpperCase()}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-stone-900">{word.german}</p>
          <p className="text-xs text-stone-500" dir="rtl">{word.arabic}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {srsState && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              srsState === 'MATURE' ? 'bg-emerald-100 text-emerald-700' :
              srsState === 'REVIEW' ? 'bg-amber-100 text-amber-700' :
              srsState === 'LEARNING' ? 'bg-blue-100 text-blue-700' :
              'bg-stone-100 text-stone-500'
            }`}>
              {srsState}
            </span>
          )}
          <ChevronRight className={`w-4 h-4 text-stone-300 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-stone-100 p-3 space-y-2 bg-stone-50 animate-fadeIn">
          <p className="text-xs font-medium text-stone-700">{word.english}</p>
          <p className="text-xs text-stone-500 italic">{word.exampleDE}</p>
          <p className="text-[11px] text-stone-400" dir="rtl">{word.exampleAR}</p>
          {word.verbInfo && (
            <div className="bg-white rounded-lg p-2 text-[11px] text-stone-600 border border-stone-100">
              <span className="font-bold">PP:</span> {word.verbInfo.pastParticiple} ·{' '}
              <span className="font-bold">Aux:</span> {word.verbInfo.auxiliaryVerb}
              {word.verbInfo.isIrregular && <span className="ml-2 text-rose-600 font-bold">irregular</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
export const VocabularyView: React.FC = () => {
  const { addSRSWord, reviewSRSCard, learnerModel, srsStats } = useApp();
  const [activeTab, setActiveTab] = useState<'review' | 'browse' | 'stats'>('review');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState<string>('all');

  // ── SRS Review State ──
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);

  // Build today's review queue: due cards first, then new cards up to daily limit
  const reviewQueue = useMemo<VocabWord[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    const srsCards = learnerModel.srsCards;

    // Words already in SRS that are due today
    const due: VocabWord[] = [];
    const newWords: VocabWord[] = [];

    for (const word of A1_VOCABULARY) {
      const card = srsCards[word.id];
      if (card) {
        if (card.nextReviewDate <= today && card.state !== 'SUSPENDED') {
          due.push(word);
        }
      } else {
        newWords.push(word);
      }
    }

    // Sort due cards: LEARNING first (most urgent), then REVIEW, then MATURE
    due.sort((a, b) => {
      const stateOrder = { LEARNING: 0, REVIEW: 1, MATURE: 2, NEW: 3, SUSPENDED: 4 };
      return (stateOrder[srsCards[a.id]?.state ?? 'NEW'] ?? 3) -
             (stateOrder[srsCards[b.id]?.state ?? 'NEW'] ?? 3);
    });

    // New words: limit by daily budget minus already reviewed today
    const todayReviewed = Object.values(srsCards).filter(
      c => c.lastReviewDate === today
    ).length;
    const newBudget = Math.max(0, MAX_DAILY_NEW - todayReviewed);
    const newBatch = newWords.slice(0, newBudget);

    // Add new words to SRS on queue creation (idempotent)
    newBatch.forEach(w => addSRSWord(w.id));

    return [...due, ...newBatch].slice(0, MAX_SESSION_CARDS);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [learnerModel.srsCards]);

  const [cardIndex, setCardIndex] = useState(0);
  const currentWord = reviewQueue[cardIndex] ?? null;

  const handleRate = useCallback((quality: QualityValue) => {
    if (!currentWord) return;
    reviewSRSCard(currentWord.id, quality);
    setSessionReviewed(n => n + 1);
    if (quality >= 4) setSessionCorrect(n => n + 1);
    setIsFlipped(false);

    if (cardIndex + 1 >= reviewQueue.length) {
      setSessionDone(true);
    } else {
      setCardIndex(i => i + 1);
    }
  }, [currentWord, cardIndex, reviewQueue.length, reviewSRSCard]);

  // Keyboard shortcuts for review
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (activeTab !== 'review' || !isFlipped || sessionDone) return;
      if (e.key === '1') handleRate(1);
      if (e.key === '2') handleRate(2);
      if (e.key === '3') handleRate(4);
      if (e.key === '4') handleRate(5);
      if (e.key === ' ') { e.preventDefault(); setIsFlipped(f => !f); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, isFlipped, sessionDone, handleRate]);

  // ── Browse filtering ──
  const semanticFields = useMemo(() => {
    const fields = new Set(A1_VOCABULARY.map(w => w.semanticField));
    return ['all', ...Array.from(fields)];
  }, []);

  const filteredWords = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return A1_VOCABULARY.filter(w => {
      const matchField = filterField === 'all' || w.semanticField === filterField;
      const matchSearch = !q ||
        w.german.toLowerCase().includes(q) ||
        w.arabic.includes(q) ||
        w.english.toLowerCase().includes(q);
      return matchField && matchSearch;
    });
  }, [searchTerm, filterField]);

  const TABS = [
    { id: 'review' as const, label: 'Review',  labelAR: 'مراجعة', icon: Brain },
    { id: 'browse' as const, label: 'Browse',  labelAR: 'تصفح',   icon: BookOpen },
    { id: 'stats' as const,  label: 'Stats',   labelAR: 'إحصائيات', icon: TrendingUp },
  ];

  return (
    <div className="space-y-5 animate-fadeIn max-w-2xl mx-auto" id="main-content">

      {/* Header */}
      <div className="paper-card p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">
              SM-2 SPACED REPETITION · {A1_VOCABULARY.length} WORDS
            </p>
            <h2 className="text-xl font-black text-stone-900">Wortschatz</h2>
            
          </div>
          <div className="flex items-center gap-4 text-center shrink-0">
            <div>
              <div className="text-xl font-black text-rose-600">{srsStats.due}</div>
              <div className="text-[10px] text-stone-400">Due</div>
            </div>
            <div>
              <div className="text-xl font-black text-emerald-600">{srsStats.mature}</div>
              <div className="text-[10px] text-stone-400">Mature</div>
            </div>
            <div>
              <div className="text-xl font-black text-stone-800">{srsStats.total}</div>
              <div className="text-[10px] text-stone-400">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl" role="tablist">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-[10px]" dir="rtl">{tab.labelAR}</span>
            </button>
          );
        })}
      </div>

      {/* ── REVIEW TAB ── */}
      {activeTab === 'review' && (
        <div id="panel-review" role="tabpanel">
          {reviewQueue.length === 0 ? (
            <div className="paper-card p-8 text-center space-y-3">
              <div className="text-4xl"></div>
              <h3 className="text-lg font-black text-stone-900">All caught up!</h3>
              <p className="text-sm text-stone-500">No cards due today. Come back tomorrow.</p>
              
              <button
                onClick={() => setActiveTab('browse')}
                className="btn-amber mt-2"
              >
                Browse Vocabulary
              </button>
            </div>
          ) : sessionDone ? (
            <div className="paper-card p-8 text-center space-y-4">
              <div className="text-5xl"></div>
              <h3 className="text-xl font-black text-stone-900">Session Complete!</h3>
              <div className="flex justify-center gap-6">
                <div>
                  <div className="text-2xl font-black text-stone-800">{sessionReviewed}</div>
                  <div className="text-xs text-stone-400">Reviewed</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-700">{sessionCorrect}</div>
                  <div className="text-xs text-stone-400">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-amber-700">
                    {sessionReviewed > 0 ? Math.round((sessionCorrect / sessionReviewed) * 100) : 0}%
                  </div>
                  <div className="text-xs text-stone-400">Accuracy</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setCardIndex(0);
                  setSessionDone(false);
                  setSessionReviewed(0);
                  setSessionCorrect(0);
                  setIsFlipped(false);
                }}
                className="btn-amber"
              >
                Review Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Progress */}
              <div className="flex items-center gap-3 px-1">
                <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                    style={{ width: `${(cardIndex / reviewQueue.length) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-black text-stone-400 shrink-0">
                  {cardIndex + 1}/{reviewQueue.length}
                </span>
              </div>

              {/* Flashcard */}
              {currentWord && (
                <FlashCard
                  word={currentWord}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(f => !f)}
                />
              )}

              {/* Rating buttons - only shown after flip */}
              {isFlipped && (
                <div className="grid grid-cols-4 gap-2 animate-fadeIn">
                  {QUALITY_BUTTONS.map(({ quality, label, labelAR, color, icon: Icon }) => (
                    <button
                      key={quality}
                      onClick={() => handleRate(quality)}
                      className={`flex flex-col items-center gap-1 py-3 rounded-xl font-bold text-xs transition-all active:scale-95 ${color}`}
                      aria-label={`Rate as ${label}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                      <span className="text-[10px] opacity-75" dir="rtl">{labelAR}</span>
                      <span className="text-[9px] opacity-50 font-mono">[{quality === 4 ? '3' : quality}]</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Keyboard hint */}
              {isFlipped && (
                <p className="text-center text-[10px] text-stone-300">
                  Keyboard: Space to flip · 1 Again · 2 Hard · 3 Good · 4 Easy
                </p>
              )}

              {!isFlipped && (
                <button
                  onClick={() => setIsFlipped(true)}
                  className="w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm transition-colors"
                >
                  Reveal Answer
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── BROWSE TAB ── */}
      {activeTab === 'browse' && (
        <div id="panel-browse" role="tabpanel" className="space-y-3">
          {/* Search + filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="search"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search German, Arabic, English..."
                aria-label="Search vocabulary"
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <select
              value={filterField}
              onChange={e => setFilterField(e.target.value)}
              aria-label="Filter by semantic field"
              className="px-3 py-2 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-amber-400"
            >
              {semanticFields.map(f => (
                <option key={f} value={f}>{f === 'all' ? 'All fields' : f}</option>
              ))}
            </select>
          </div>

          <p className="text-[11px] text-stone-400 px-1">
            {filteredWords.length} words · {learnerModel.srsCards ? Object.keys(learnerModel.srsCards).length : 0} in SRS
          </p>

          <div className="space-y-2">
            {filteredWords.map(word => (
              <BrowseCard
                key={word.id}
                word={word}
                srsState={learnerModel.srsCards[word.id]?.state}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── STATS TAB ── */}
      {activeTab === 'stats' && (
        <div id="panel-stats" role="tabpanel" className="space-y-4">
          {/* SRS breakdown */}
          <div className="paper-card p-5">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">SRS Deck Status</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'New',      labelAR: 'جديدة',       value: srsStats.new,      color: 'bg-stone-100 text-stone-700' },
                { label: 'Learning', labelAR: 'تعلّم',        value: srsStats.learning, color: 'bg-blue-100 text-blue-700'   },
                { label: 'Review',   labelAR: 'مراجعة',      value: srsStats.review,   color: 'bg-amber-100 text-amber-700' },
                { label: 'Mature',   labelAR: 'راسخة',       value: srsStats.mature,   color: 'bg-emerald-100 text-emerald-700' },
              ].map(stat => (
                <div key={stat.label} className={`rounded-xl p-4 ${stat.color}`}>
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="text-xs font-bold">{stat.label}</div>
                  <div className="text-[11px] opacity-70" dir="rtl">{stat.labelAR}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Vocab database breakdown */}
          <div className="paper-card p-5 space-y-3">
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              Vocabulary Database
            </p>
            {['greetings', 'time', 'family', 'food', 'home', 'transport', 'work', 'body', 'adjectives', 'verbs'].map(field => {
              const fieldWords = A1_VOCABULARY.filter(w => w.semanticField === field);
              const learned = fieldWords.filter(w => learnerModel.srsCards[w.id]?.state === 'MATURE' || learnerModel.srsCards[w.id]?.state === 'REVIEW').length;
              return (
                <div key={field}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-stone-700 capitalize">{field}</span>
                    <span className="text-stone-400">{learned}/{fieldWords.length}</span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-700"
                      style={{ width: fieldWords.length > 0 ? `${(learned / fieldWords.length) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="paper-card p-4 grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-2xl font-black text-stone-900">{learnerModel.totalWordsLearned}</div>
              <div className="text-xs text-stone-400">Total Learned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-700">{learnerModel.activeVocabularySize}</div>
              <div className="text-xs text-stone-400">Active Vocab</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
