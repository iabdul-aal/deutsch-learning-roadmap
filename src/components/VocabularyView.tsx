import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { A1_VOCABULARY } from '../data/vocabulary/a1-core';
import type { VocabWord } from '../data/vocabulary/a1-core';
import {
  Search, Brain, Check, X, RotateCcw, ChevronRight,
  Star, BookOpen, TrendingUp, Flame, Clock, Trophy, Layers,
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
          {word.nounGenderHint && (
            <div className="bg-amber-100 border border-amber-200 rounded-xl px-3 py-1.5 text-[11px] text-amber-800 text-center" dir="rtl">
              💡 {word.nounGenderHint}
            </div>
          )}
          {word.commonMistakeAR && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl px-3 py-1.5 text-[11px] text-rose-700 text-center" dir="rtl">
              ⚠️ {word.commonMistakeAR}
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
        <div className="px-3 pb-3 pt-1 border-t border-stone-100 space-y-2 bg-stone-50 text-xs">
          <div className="flex flex-wrap gap-2 text-[11px] text-stone-500">
            {word.plural && <span>Plural: <strong>{word.plural}</strong></span>}
            <span>English: <strong>{word.english}</strong></span>
          </div>
          <p className="text-stone-700 italic bg-white p-2 rounded border border-stone-200">
            "{word.exampleDE}"
          </p>
          {word.exampleAR && (
            <p className="text-stone-600 text-right font-cairo" dir="rtl">
              "{word.exampleAR}"
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main Vocabulary View ──────────────────────────────────────────
export const VocabularyView: React.FC = () => {
  const { currentTrackId, addSRSWord, reviewSRSCard, learnerModel, srsStats } = useApp();

  // Track Level Default: A1 for german-a1-ar, A2 for german-a2-ar, B1 for german-b1-ar
  const currentTrackLevel = currentTrackId.includes('a2') ? 'A2' : currentTrackId.includes('b1') ? 'B1' : 'A1';
  const [levelFilter, setLevelFilter] = useState<'A1' | 'A2' | 'B1' | 'ALL'>(currentTrackLevel);

  const [activeTab, setActiveTab] = useState<'review' | 'browse' | 'stats'>('review');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterField, setFilterField] = useState<string>('all');

  // Filter words by active track level
  const trackWords = useMemo(() => {
    if (levelFilter === 'ALL') return A1_VOCABULARY;
    return A1_VOCABULARY.filter(w => (w.cefr || 'A1') === levelFilter);
  }, [levelFilter]);

  // ── SRS Review State ──
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);

  // Build today's review queue
  const reviewQueue = useMemo<VocabWord[]>(() => {
    const today = new Date().toISOString().split('T')[0];
    const srsCards = learnerModel.srsCards;

    const due: VocabWord[] = [];
    const newWords: VocabWord[] = [];

    for (const word of trackWords) {
      const card = srsCards[word.id];
      if (card) {
        if (card.nextReviewDate <= today && card.state !== 'SUSPENDED') {
          due.push(word);
        }
      } else {
        newWords.push(word);
      }
    }

    due.sort((a, b) => {
      const stateOrder = { LEARNING: 0, REVIEW: 1, MATURE: 2, NEW: 3, SUSPENDED: 4 };
      return (stateOrder[srsCards[a.id]?.state ?? 'NEW'] ?? 3) -
             (stateOrder[srsCards[b.id]?.state ?? 'NEW'] ?? 3);
    });

    const todayReviewed = Object.values(srsCards).filter(
      c => c.lastReviewDate === today
    ).length;
    const newBudget = Math.max(0, MAX_DAILY_NEW - todayReviewed);
    const newToAdd = newWords.slice(0, newBudget);

    return [...due, ...newToAdd];
  }, [trackWords, learnerModel.srsCards]);

  const currentWord = reviewQueue[cardIndex];

  const handleRate = useCallback((quality: QualityValue) => {
    if (!currentWord) return;
    reviewSRSCard(currentWord.id, quality);
    setSessionReviewed(r => r + 1);
    if (quality >= 4) setSessionCorrect(c => c + 1);

    setIsFlipped(false);
    if (cardIndex + 1 >= reviewQueue.length) {
      setSessionDone(true);
    } else {
      setCardIndex(i => i + 1);
    }
  }, [currentWord, cardIndex, reviewQueue.length, reviewSRSCard]);

  // Keyboard shortcuts
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

  // Browse filtering
  const semanticFields = useMemo(() => {
    const fields = new Set(trackWords.map(w => w.semanticField));
    return ['all', ...Array.from(fields)];
  }, [trackWords]);

  const filteredWords = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return trackWords.filter(w => {
      const matchField = filterField === 'all' || w.semanticField === filterField;
      const matchSearch = !q ||
        w.german.toLowerCase().includes(q) ||
        w.arabic.includes(q) ||
        w.english.toLowerCase().includes(q);
      return matchField && matchSearch;
    });
  }, [trackWords, searchTerm, filterField]);

  const TABS = [
    { id: 'review' as const, label: 'Review',  labelAR: 'مراجعة', icon: Brain },
    { id: 'browse' as const, label: 'Browse',  labelAR: 'تصفح',   icon: BookOpen },
    { id: 'stats' as const,  label: 'Stats',   labelAR: 'إحصائيات', icon: TrendingUp },
  ];

  return (
    <div className="space-y-5 animate-fadeIn max-w-2xl mx-auto" id="main-content">

      {/* Header with Track Level Switcher */}
      <div className="paper-card p-5 space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">
              {levelFilter} WORTSCHATZ · {trackWords.length} WORDS
            </p>
            <h2 className="text-xl font-black text-stone-900">Spaced Repetition System</h2>
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
              <div className="text-[10px] text-stone-400">Deck</div>
            </div>
          </div>
        </div>

        {/* Level Switcher Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mr-1">Level:</span>
          {(['A1', 'A2', 'B1', 'ALL'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => { setLevelFilter(lvl); setCardIndex(0); setSessionDone(false); }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                levelFilter === lvl
                  ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-xs'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
              }`}
            >
              {lvl === 'ALL' ? 'All Levels' : `${lvl} Deck`}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Nav */}
      <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
        {TABS.map(t => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                active
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
              <span className="text-[10px] font-cairo opacity-70 hidden sm:inline" dir="rtl">
                ({t.labelAR})
              </span>
            </button>
          );
        })}
      </div>

      {/* ── REVIEW TAB ── */}
      {activeTab === 'review' && (
        <div className="space-y-4">
          {sessionDone || reviewQueue.length === 0 || !currentWord ? (
            <div className="paper-card p-8 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-black">
                🎉
              </div>
              <h3 className="text-lg font-black text-stone-900">
                {reviewQueue.length === 0 ? 'No Reviews Due Today!' : 'Session Complete!'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                {sessionReviewed > 0
                  ? `You reviewed ${sessionReviewed} cards with ${Math.round((sessionCorrect / Math.max(sessionReviewed, 1)) * 100)}% accuracy.`
                  : 'All catch-up reviews are completed. Great work keeping your SRS deck updated!'}
              </p>
              <button
                onClick={() => { setSessionDone(false); setCardIndex(0); setSessionReviewed(0); setSessionCorrect(0); }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black transition-all shadow-xs"
              >
                Review Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-400 font-bold">
                <span>Card {cardIndex + 1} of {reviewQueue.length}</span>
                <span>{Math.round(((cardIndex) / reviewQueue.length) * 100)}% Complete</span>
              </div>

              <FlashCard
                word={currentWord}
                isFlipped={isFlipped}
                onFlip={() => setIsFlipped(f => !f)}
              />

              {isFlipped && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 animate-fadeIn">
                  {QUALITY_BUTTONS.map(q => {
                    const Icon = q.icon;
                    return (
                      <button
                        key={q.quality}
                        onClick={() => handleRate(q.quality)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl font-bold transition-all shadow-xs gap-0.5 ${q.color}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-xs">{q.label}</span>
                        <span className="text-[10px] opacity-80 font-cairo" dir="rtl">{q.labelAR}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── BROWSE TAB ── */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search German, Arabic, or English..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <select
              value={filterField}
              onChange={e => setFilterField(e.target.value)}
              className="px-3 py-2 text-xs border border-stone-200 rounded-xl bg-white focus:outline-none focus:border-amber-500 capitalize"
            >
              {semanticFields.map(f => (
                <option key={f} value={f}>{f === 'all' ? 'All Fields' : f}</option>
              ))}
            </select>
          </div>

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
        <div className="paper-card p-6 space-y-4">
          <h3 className="text-sm font-black text-stone-900">SRS Mastery Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-lg font-black text-stone-400">{srsStats.new}</div>
              <div className="text-[10px] text-stone-500 font-bold">New</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <div className="text-lg font-black text-blue-700">{srsStats.learning}</div>
              <div className="text-[10px] text-blue-600 font-bold">Learning</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <div className="text-lg font-black text-amber-700">{srsStats.review}</div>
              <div className="text-[10px] text-amber-600 font-bold">Review</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-lg font-black text-emerald-700">{srsStats.mature}</div>
              <div className="text-[10px] text-emerald-600 font-bold">Mature</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
