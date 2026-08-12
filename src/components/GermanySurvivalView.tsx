import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SURVIVAL_DATA } from '../data/tracks/german-a1-ar/survival';
import { SURVIVAL_DATA_A2 } from '../data/tracks/german-a2-ar/survival';
import { SURVIVAL_DATA_B1 } from '../data/tracks/german-b1-ar/survival';
import { playGermanTTS } from '../utils/audio';
import { 
  Volume2, MessageSquare, Search, ChevronDown, ChevronUp, Mic, HelpCircle 
} from 'lucide-react';

export const GermanySurvivalView: React.FC = () => {
  const { currentTrackId } = useApp();

  const getSurvivalDataset = () => {
    if (currentTrackId === 'german-a2-ar') return SURVIVAL_DATA_A2;
    if (currentTrackId === 'german-b1-ar') return SURVIVAL_DATA_B1;
    return SURVIVAL_DATA;
  };

  const survivalDataset = getSurvivalDataset();
  const categories = (survivalDataset as any)?.categories || (survivalDataset as any)?.domains || [];
  const defaultCatId = categories[0]?.id || 'arrival';
  const [activeCategory, setActiveCategory] = useState(defaultCatId);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleplay, setActiveRoleplay] = useState<string | null>(null);

  const selectedCategoryObj = categories.find((c: any) => c.id === activeCategory) || categories[0];
  const phrases = selectedCategoryObj?.phrases || [];

  const filteredPhrases = phrases.filter(
    (p: any) =>
      p.german.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.arabic.includes(searchQuery) ||
      (p.phonetic || p.pronunciation || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="paper-card p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest block mb-1">
            GERMANY SURVIVAL WORKBENCH
          </span>
          <h2 className="text-xl font-black text-stone-900">
            {survivalDataset?.title || 'Real-World Phrasebook and Scenario Roleplays'}
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            {survivalDataset?.description || 'Practical German needed immediately after landing in Germany.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search German, Arabic, or topic..."
            className="w-full pl-10 pr-3.5 py-2 rounded-lg bg-stone-50 border border-stone-300 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 transition-colors"
          />
        </div>
      </div>

      {/* Split Pane: Left Domains vs Right Phrases */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Domains Navigation */}
        <div className="md:col-span-4 space-y-3">
          <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">
            Survival Domains ({categories.length})
          </div>

          <div className="space-y-2">
            {categories.map((cat: any) => {
              const isActive = cat.id === activeCategory;

              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-lg border text-left transition-all ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 border-amber-500 font-extrabold shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700 font-bold hover:bg-stone-50'
                  }`}
                >
                  <span className="text-xs truncate pr-2">{cat.title || cat.name}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded shrink-0 ${
                    isActive ? 'bg-amber-600 text-stone-950' : 'bg-stone-100 text-stone-500'
                  }`}>
                    {cat.phrases?.length || cat.count || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Premium Phrase Cards */}
        <div className="md:col-span-8 space-y-4 min-w-0">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-extrabold text-stone-900 truncate">
              {selectedCategoryObj?.title || selectedCategoryObj?.name} Phrasebook
            </span>
            <span className="text-stone-500 font-mono text-[11px] shrink-0">
              Showing {filteredPhrases.length} phrases
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 min-w-0">
            {filteredPhrases.map((item: any) => {
              const isOpen = activeRoleplay === item.id;

              return (
                <div
                  key={item.id}
                  className="paper-card p-4 sm:p-6 space-y-4 hover:border-stone-300 transition-all shadow-xs min-w-0"
                >
                  {/* German Header and Audio Pill */}
                  <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4 min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-stone-900 leading-snug tracking-tight min-w-0 break-words">
                      {item.german}
                    </h3>
                    
                    <button
                      onClick={() => playGermanTTS(item.german)}
                      className="px-3.5 py-1.5 rounded-md bg-stone-900 hover:bg-amber-600 text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
                      title="Listen Native Audio (TTS)"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-white" />
                      <span>Listen</span>
                    </button>
                  </div>

                  {/* High-Contrast Arabic Translation */}
                  <div className="dir-rtl text-right font-arabic" dir="rtl">
                    <p className="text-base sm:text-lg font-bold text-stone-900 leading-relaxed">
                      {item.arabic}
                    </p>
                  </div>

                  {/* Phonetics and Context Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs pt-1 min-w-0">
                    
                    {/* Arabic Phonetics Badge */}
                    {(item.phonetic || item.pronunciation) && (
                      <div 
                        className="dir-rtl text-right font-arabic bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-md text-amber-950 font-bold text-xs flex items-center gap-1.5 min-w-0"
                        dir="rtl"
                      >
                        <Mic className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                        <span className="text-amber-800 text-[11px] shrink-0 font-sans">Pronunciation:</span>
                        <span className="truncate">{item.phonetic || item.pronunciation}</span>
                      </div>
                    )}

                    {/* Usage Context Tip */}
                    {(item.example || item.context) && (
                      <div className="text-stone-600 text-[11px] italic bg-stone-50 border border-stone-200 px-3 py-2 rounded-md flex items-center gap-1.5 sm:max-w-xs min-w-0">
                        <HelpCircle className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        <span className="truncate">Context: {item.example || item.context}</span>
                      </div>
                    )}
                  </div>

                  {/* Scenario Roleplay Drawer Toggle */}
                  {item.roleplay && (
                    <div className="pt-2">
                      <button
                        onClick={() => setActiveRoleplay(isOpen ? null : item.id)}
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all border border-stone-200"
                      >
                        <span className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-stone-600" />
                          <span>Interactive Scenario Roleplay</span>
                        </span>
                        <span className="flex items-center gap-1 text-stone-600 text-[11px]">
                          <span>{isOpen ? 'Close Scenario' : 'Open Scenario'}</span>
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </button>

                      {/* Roleplay Dialogue Box */}
                      {isOpen && (
                        <div className="mt-3 p-4 rounded-md bg-stone-50 border border-stone-300 text-xs space-y-3 animate-fadeIn">
                          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                            <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">
                              SCENARIO DIALOGUE SCRIPT
                            </span>
                            <button
                              onClick={() => playGermanTTS(item.roleplay)}
                              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-[11px] flex items-center gap-1"
                            >
                              <Volume2 className="w-3 h-3" /> Listen Dialogue
                            </button>
                          </div>

                          <p className="text-stone-800 font-mono text-xs leading-relaxed">
                            {item.roleplay}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
