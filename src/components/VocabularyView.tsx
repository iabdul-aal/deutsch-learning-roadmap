import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VOCABULARY_DATA } from '../data/tracks/german-a1-ar/vocabulary';
import { playGermanTTS } from '../utils/audio';
import { 
  BookOpen, Volume2, Search, ChevronRight, ChevronLeft, 
  CheckCircle2, RotateCcw, Snail, Gauge
} from 'lucide-react';

export const VocabularyView: React.FC = () => {
  const { vocabStatus, updateVocabStatus } = useApp();
  const words = VOCABULARY_DATA?.words || [];
  const categories = (VOCABULARY_DATA?.categories || []).filter(c => c !== 'All');

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'flashcards' | 'list'>('flashcards');
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [audioSpeed, setAudioSpeed] = useState<number>(0.85); // 0.85 = normal, 0.6 = slow

  const filteredWords = words.filter((w) => {
    const matchesCat = selectedCategory === 'All' || w.category === selectedCategory;
    const matchesQuery = !searchQuery || 
      w.german.toLowerCase().includes(searchQuery.toLowerCase()) || 
      w.arabic.includes(searchQuery) || 
      w.english.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const currentCard = filteredWords[cardIndex] || filteredWords[0];

  const getArticleColor = (art?: string) => {
    if (art === 'der') return 'text-sky-900 border-sky-300 bg-sky-100';
    if (art === 'die') return 'text-rose-900 border-rose-300 bg-rose-100';
    if (art === 'das') return 'text-emerald-900 border-emerald-300 bg-emerald-100';
    return 'text-stone-700 border-stone-300 bg-stone-100';
  };

  const isCurrentMastered = currentCard ? vocabStatus[currentCard.id] === 'mastered' : false;

  const toggleMastery = (wordId: string) => {
    const current = vocabStatus[wordId];
    const nextStatus = current === 'mastered' ? 'learning' : 'mastered';
    updateVocabStatus(wordId, nextStatus);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="paper-card p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block mb-1">
            VOCABULARY SRS WORKSPACE
          </span>
          <h2 className="text-xl font-black text-stone-900">
            High-Frequency A1 Vocabulary & Article Color Coding
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Article Legend: <strong className="text-sky-700">Der = Blue</strong>  |  <strong className="text-rose-700">Die = Red</strong>  |  <strong className="text-emerald-700">Das = Green</strong>
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-stone-100 p-1 rounded-md border border-stone-300 flex items-center text-xs font-bold">
            <button
              onClick={() => setViewMode('flashcards')}
              className={`px-3 py-1 rounded transition-all ${viewMode === 'flashcards' ? 'bg-white text-stone-900 border border-stone-300 font-black shadow-xs' : 'text-stone-600'}`}
            >
              Flashcards Deck
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded transition-all ${viewMode === 'list' ? 'bg-white text-stone-900 border border-stone-300 font-black shadow-xs' : 'text-stone-600'}`}
            >
              Table View
            </button>
          </div>

          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search words..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>
      </div>

      {/* Split Pane: Left Category Sidebar vs Right SRS Flashcards/Table */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Categories List */}
        <div className="md:col-span-4 space-y-3">
          <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
            Vocabulary Categories
          </div>

          <div className="space-y-1.5">
            <button
              onClick={() => { setSelectedCategory('All'); setCardIndex(0); setIsFlipped(false); }}
              className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all ${
                selectedCategory === 'All'
                  ? 'bg-amber-500 text-stone-950 border-amber-500 font-extrabold shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 font-bold hover:bg-stone-50'
              }`}
            >
              <span className="text-xs">All Vocabulary Words</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                selectedCategory === 'All' ? 'bg-amber-600 text-stone-950' : 'bg-stone-100 text-stone-500'
              }`}>
                {words.length}
              </span>
            </button>

            {categories.map((cat) => {
              const catCount = words.filter(w => w.category === cat).length;
              const isActive = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCardIndex(0); setIsFlipped(false); }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 border-amber-500 font-extrabold shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 font-bold hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs">{cat}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-amber-600 text-stone-950' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {catCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Flashcards Deck or Table View */}
        <div className="md:col-span-8 space-y-4">
          
          {/* View Mode: Flashcards */}
          {viewMode === 'flashcards' && (
            <div className="space-y-4">
              {currentCard ? (
                <div className="paper-card p-6 sm:p-8 space-y-6 text-center relative min-h-[340px] flex flex-col justify-between shadow-xs">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between text-xs border-b border-stone-200 pb-3">
                    <span className="text-stone-500 font-mono font-bold">
                      Card {cardIndex + 1} of {filteredWords.length}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMastery(currentCard.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all border ${
                          isCurrentMastered 
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                            : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isCurrentMastered ? 'Mastered' : 'Mark Mastered'}</span>
                      </button>

                      <span className={`px-3 py-1 rounded border text-xs font-black uppercase tracking-wider ${getArticleColor(currentCard.article)}`}>
                        {currentCard.article || 'noun'}
                      </span>
                    </div>
                  </div>

                  {/* Main Interactive Card Surface */}
                  <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="cursor-pointer space-y-4 py-8 select-none"
                  >
                    {!isFlipped ? (
                      <div className="space-y-3 animate-fadeIn">
                        <h3 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                          {currentCard.article ? `${currentCard.article} ` : ''}{currentCard.german}
                        </h3>
                        {currentCard.plural && (
                          <p className="text-xs text-stone-500 font-mono font-bold">Plural: {currentCard.plural}</p>
                        )}
                        <p className="text-[11px] text-amber-700 font-extrabold uppercase tracking-widest pt-4">
                          Click to Flip Card (German / Arabic)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 font-arabic animate-fadeIn" dir="rtl">
                        <h3 className="text-3xl sm:text-4xl font-black text-stone-900 leading-snug">
                          {currentCard.arabic}
                        </h3>
                        <p className="text-sm text-stone-600 font-sans">{currentCard.english}</p>
                        {currentCard.example && (
                          <p className="text-xs text-stone-500 italic pt-2">"{currentCard.example}"</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Navigation & Audio Speed Footer */}
                  <div className="flex flex-col sm:flex-row items-center justify-between border-t border-stone-200 pt-4 gap-3 text-xs">
                    
                    {/* Audio Controls with Speed Toggle */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => playGermanTTS(`${currentCard.article || ''} ${currentCard.german}`, audioSpeed)}
                        className="px-4 py-2 rounded-md bg-stone-900 hover:bg-amber-600 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-xs min-h-[38px]"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Listen Audio
                      </button>

                      <button
                        onClick={() => setAudioSpeed(prev => prev === 0.85 ? 0.6 : 0.85)}
                        className={`px-2.5 py-2 rounded-md border text-xs font-bold flex items-center gap-1 min-h-[38px] transition-all ${
                          audioSpeed === 0.6 
                            ? 'bg-amber-100 text-amber-900 border-amber-400' 
                            : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                        }`}
                        title="Toggle audio playback speed"
                      >
                        {audioSpeed === 0.6 ? <Snail className="w-3.5 h-3.5 text-amber-700" /> : <Gauge className="w-3.5 h-3.5" />}
                        <span>{audioSpeed === 0.6 ? '0.6x Slow' : '1.0x'}</span>
                      </button>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                      <button
                        onClick={() => {
                          setCardIndex((prev) => (prev > 0 ? prev - 1 : filteredWords.length - 1));
                          setIsFlipped(false);
                        }}
                        className="px-3.5 py-2 rounded-md bg-stone-100 text-stone-800 hover:bg-stone-200 font-bold border border-stone-300 flex items-center gap-1 min-h-[38px]"
                      >
                        <ChevronLeft className="w-4 h-4" /> Prev
                      </button>
                      <button
                        onClick={() => {
                          setCardIndex((prev) => (prev < filteredWords.length - 1 ? prev + 1 : 0));
                          setIsFlipped(false);
                        }}
                        className="px-4 py-2 rounded-md bg-amber-500 text-stone-950 font-black hover:bg-amber-400 flex items-center gap-1 shadow-xs min-h-[38px]"
                      >
                        <span>Next</span> <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center paper-card text-stone-500">No words match search query.</div>
              )}
            </div>
          )}

          {/* View Mode: Table List */}
          {viewMode === 'list' && (
            <div className="paper-card overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-extrabold border-b border-stone-200 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Status</th>
                    <th className="p-3">Article</th>
                    <th className="p-3">German Word</th>
                    <th className="p-3">Plural</th>
                    <th className="p-3 text-right">Arabic</th>
                    <th className="p-3">English</th>
                    <th className="p-3 text-right">Audio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-medium">
                  {filteredWords.map((item) => {
                    const isMastered = vocabStatus[item.id] === 'mastered';
                    return (
                      <tr key={item.id} className="hover:bg-stone-50/70">
                        <td className="p-3 whitespace-nowrap">
                          <button
                            onClick={() => toggleMastery(item.id)}
                            className={`p-1 rounded transition-colors ${isMastered ? 'text-emerald-600' : 'text-stone-300 hover:text-stone-500'}`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded border text-[10px] font-black uppercase ${getArticleColor(item.article)}`}>
                            {item.article || '-'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-stone-900 text-sm whitespace-nowrap">{item.german}</td>
                        <td className="p-3 text-stone-500 font-mono whitespace-nowrap">{item.plural || '-'}</td>
                        <td className="p-3 text-right font-arabic text-stone-900 font-bold text-base whitespace-nowrap" dir="rtl">
                          {item.arabic}
                        </td>
                        <td className="p-3 text-stone-700">{item.english}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => playGermanTTS(`${item.article || ''} ${item.german}`, audioSpeed)}
                            className="px-2.5 py-1 rounded bg-stone-100 hover:bg-amber-500 hover:text-stone-950 font-bold border border-stone-300 transition-all inline-flex items-center gap-1 text-[11px]"
                          >
                            <Volume2 className="w-3 h-3 text-stone-600" /> Listen
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
