import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { A1_VOCABULARY, VocabWord } from '../data/vocabulary/a1-core';
import {
  Search, Brain, Check, X, RotateCcw, ChevronRight, Volume2,
  Star, BookOpen, TrendingUp, Flame, Clock, Trophy, Layers, Filter
} from 'lucide-react';

// Article colour coding (pedagogical best practice)
const ARTICLE_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  der: { text: 'text-blue-400',   bg: 'bg-blue-500/15',   border: 'border-blue-500/30' },
  die: { text: 'text-rose-400',   bg: 'bg-rose-500/15',   border: 'border-rose-500/30' },
  das: { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/30' },
};

// Web Speech API for native German TTS pronunciation
const speakGermanWord = (text: string) => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }
};

const QUALITY_BUTTONS = [
  { quality: 1 as const, label: 'Again',  color: 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm', icon: X },
  { quality: 2 as const, label: 'Hard',   color: 'bg-orange-600 hover:bg-orange-500 text-white shadow-sm', icon: RotateCcw },
  { quality: 4 as const, label: 'Good',   color: 'bg-[#b68c61] hover:bg-[#855f39] text-white shadow-sm', icon: Check },
  { quality: 5 as const, label: 'Easy',   color: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm', icon: Star },
] as const;

// ── Interactive Flashcard Component ─────────────────────────────────
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
      aria-label={`Flashcard: ${word.german}. Click to flip.`}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onFlip(); }}
    >
      <div
        className="relative w-full transition-transform duration-500 ease-in-out min-h-[300px]"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front Side: German */}
        <div
          className="absolute inset-0 rounded-2xl border border-white/10 bg-[#18181f] shadow-2xl p-6 flex flex-col items-center justify-between gap-3 text-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-full flex items-center justify-between">
            {word.article && ac ? (
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${ac.bg} ${ac.text} ${ac.border}`}>
                {word.article}
              </span>
            ) : (
              <span className="text-[10px] font-mono text-white/40 uppercase">
                {word.wordType}
              </span>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                speakGermanWord(word.german);
              }}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all"
              title="استمع للنطق"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {word.german}
            </p>
            {word.plural && (
              <p className="text-xs text-white/40 font-mono">
                Plural: die {word.plural}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-stone-300 italic max-w-md">
              "{word.exampleDE}"
            </p>
            <p className="text-[10px] text-amber-400/80 font-mono animate-pulse">
              اضغط لقلب بطاقة المفردات ↓ (Tap to reveal translation)
            </p>
          </div>
        </div>

        {/* Back Side: Arabic & English */}
        <div
          className="absolute inset-0 rounded-2xl border border-amber-500/30 bg-[#1c1a24] shadow-2xl p-6 flex flex-col items-center justify-between gap-3 text-center"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-full flex items-center justify-between">
            <span className="text-[10px] font-mono text-amber-400 uppercase">
              المجال: {word.semanticField}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                speakGermanWord(word.exampleDE);
              }}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all text-xs flex items-center gap-1"
              title="نطق المثال الكامل"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>نطق الجملة</span>
            </button>
          </div>

          <div className="space-y-2" dir="rtl">
            <p className="text-3xl font-black text-amber-400 font-cairo">
              {word.arabic}
            </p>
            <p className="text-xs text-stone-300 font-sans">{word.english}</p>
          </div>

          <div className="space-y-2 w-full text-xs" dir="rtl">
            <p className="text-amber-200/90 font-cairo italic">"{word.exampleAR}"</p>
            {word.nounGenderHint && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-1.5 text-[11px] text-amber-300 font-cairo">
                💡 {word.nounGenderHint}
              </div>
            )}
            {word.commonMistakeAR && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-1.5 text-[11px] text-rose-300 font-cairo">
                ⚠️ {word.commonMistakeAR}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Vocabulary View ─────────────────────────────────────────────
export const VocabularyView: React.FC = () => {
  const { currentTrackId, learnerModel, reviewSRSCard, addSRSWord } = useApp();
  const [activeTab, setActiveTab] = useState<'study' | 'browse'>('study');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCEFR, setSelectedCEFR] = useState<string>('All');
  const [selectedField, setSelectedField] = useState<string>('All');
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Determine CEFR ceiling based on active track
  const maxAllowedCEFRs = useMemo(() => {
    if (currentTrackId.includes('a1')) return ['A1'];
    if (currentTrackId.includes('a2')) return ['A1', 'A2'];
    if (currentTrackId.includes('b1')) return ['A1', 'A2', 'B1'];
    return ['A1', 'A2', 'B1', 'B2'];
  }, [currentTrackId]);

  // SRS Cards from Learner Model
  const srsCards = learnerModel.srsDeck || [];

  // Filter vocabulary pool by active track CEFR ceiling
  const filteredWords = useMemo(() => {
    return A1_VOCABULARY.filter(word => {
      // 1. Strict CEFR track ceiling block
      if (word.cefr && !maxAllowedCEFRs.includes(word.cefr)) return false;

      // 2. Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        word.german.toLowerCase().includes(q) ||
        word.arabic.toLowerCase().includes(q) ||
        word.english.toLowerCase().includes(q)
      );

      if (!matchesSearch) return false;
      if (selectedCEFR !== 'All' && word.cefr !== selectedCEFR) return false;
      if (selectedField !== 'All' && word.semanticField !== selectedField) return false;
      return true;
    });
  }, [maxAllowedCEFRs, searchQuery, selectedCEFR, selectedField]);

  // Extract unique semantic fields
  const semanticFields = useMemo(() => {
    const trackVocabulary = A1_VOCABULARY.filter(w => !w.cefr || maxAllowedCEFRs.includes(w.cefr));
    const fields = new Set(trackVocabulary.map(w => w.semanticField));
    return ['All', ...Array.from(fields)];
  }, [maxAllowedCEFRs]);

  const currentWord = filteredWords[currentIndex] || filteredWords[0];

  const handleRating = (quality: 1 | 2 | 4 | 5) => {
    if (!currentWord) return;
    reviewSRSCard(currentWord.id, quality);
    setIsFlipped(false);
    if (currentIndex < filteredWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#141419] p-6 rounded-2xl border border-[#e5e1d8] dark:border-white/10 shadow-lg">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Vocabulary Spaced Repetition (SM-2)</span>
            <Brain className="w-6 h-6 text-[#b68c61] dark:text-amber-400" />
          </h1>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            Build long-term German vocabulary memory with spaced review algorithms and audio pronunciation.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-black/40 p-1.5 rounded-xl border border-[#e5e1d8] dark:border-white/10 shrink-0">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'study'
                ? 'bg-[#b68c61] text-white dark:bg-amber-500 dark:text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-white/60 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Study Session
          </button>
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${
              activeTab === 'browse'
                ? 'bg-[#b68c61] text-white dark:bg-amber-500 dark:text-stone-950 shadow-md'
                : 'text-stone-600 dark:text-white/60 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Word Dictionary ({filteredWords.length})
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400 dark:text-white/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search German words or translations..."
            className="w-full bg-white dark:bg-[#141419] border border-[#e5e1d8] dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-white/40 focus:outline-none focus:border-[#b68c61] dark:focus:border-amber-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 dark:text-white/40 font-mono shrink-0">Level:</span>
          {(['All', ...maxAllowedCEFRs]).map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedCEFR(lvl)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                selectedCEFR === lvl
                  ? 'bg-[#b68c61]/20 border-[#b68c61] text-[#855f39] dark:bg-amber-500/20 dark:border-amber-500 dark:text-amber-300'
                  : 'bg-white dark:bg-[#141419] border-[#e5e1d8] dark:border-white/10 text-stone-600 dark:text-white/50 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-mono shrink-0">Category:</span>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="w-full bg-[#141419] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-all font-cairo"
          >
            {semanticFields.map(f => (
              <option key={f} value={f} className="bg-[#141419] text-white">
                {f === 'All' ? 'جميع المجالات' : f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode 1: Interactive Flashcards */}
      {activeTab === 'study' && currentWord && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-xs text-white/50 px-2 font-mono">
            <span>بطاقة {currentIndex + 1} من {filteredWords.length}</span>
            <span className="text-amber-400 font-bold">{currentWord.semanticField}</span>
          </div>

          <FlashCard
            word={currentWord}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(f => !f)}
          />

          {/* Rating Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            {QUALITY_BUTTONS.map(({ quality, label, labelAR, color, icon: Icon }) => (
              <button
                key={quality}
                onClick={() => handleRating(quality)}
                className={`py-3 px-2 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all shadow-md ${color}`}
              >
                <Icon className="w-4 h-4" />
                <span>{labelAR}</span>
                <span className="text-[9px] opacity-70 font-mono">({label})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mode 2: Browse Dictionary Table */}
      {activeTab === 'browse' && (
        <div className="bg-[#141419] rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <div className="divide-y divide-white/5">
            {filteredWords.map((word) => {
              const ac = word.article ? ARTICLE_COLORS[word.article] : null;

              return (
                <div
                  key={word.id}
                  className="p-4 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => speakGermanWord(word.german)}
                      className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 shrink-0 transition-all"
                      title="استمع للنطق"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {word.article && ac ? (
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-black border ${ac.bg} ${ac.text} ${ac.border} shrink-0`}>
                        {word.article}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-white/5 text-white/40 shrink-0">
                        {word.wordType}
                      </span>
                    )}

                    <div className="min-w-0">
                      <p className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{word.german}</span>
                        {word.plural && <span className="text-xs text-white/40 font-mono">(Pl: {word.plural})</span>}
                      </p>
                      <p className="text-white/40 italic text-xs">{word.exampleDE}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0" dir="rtl">
                    <p className="font-bold text-amber-400 font-cairo text-sm">{word.arabic}</p>
                    <p className="text-[11px] text-stone-400 font-sans">{word.english}</p>
                  </div>
                </div>
              );
            })}

            {filteredWords.length === 0 && (
              <div className="py-12 text-center text-white/40 space-y-2">
                <BookOpen className="w-10 h-10 mx-auto opacity-30" />
                <p>لم يتم العثور على كلمات بهذه الفلاتر.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
