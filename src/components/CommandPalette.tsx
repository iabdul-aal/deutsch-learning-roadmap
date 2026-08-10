import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CURRICULUM_DATA } from '../data/tracks/german-a1-ar/curriculum';
import { VOCABULARY_DATA } from '../data/tracks/german-a1-ar/vocabulary';
import { GRAMMAR_DATA } from '../data/tracks/german-a1-ar/grammar';
import { SURVIVAL_DATA } from '../data/tracks/german-a1-ar/survival';
import { 
  Search, BookOpen, PenTool, Compass, Calendar, 
  ArrowRight, X, Sparkles, Command
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const { setActiveView } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open palette
          const event = new CustomEvent('open-command-palette');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search items across datasets
  const matchedCurriculum = (CURRICULUM_DATA?.weeks || [])
    .flatMap(w => w.days)
    .filter(d => query && (d.title.toLowerCase().includes(query.toLowerCase()) || d.objective.toLowerCase().includes(query.toLowerCase())))
    .slice(0, 4);

  const matchedVocab = (VOCABULARY_DATA?.words || [])
    .filter(w => query && (w.german.toLowerCase().includes(query.toLowerCase()) || w.arabic.includes(query) || w.english.toLowerCase().includes(query.toLowerCase())))
    .slice(0, 4);

  const matchedGrammar = (GRAMMAR_DATA?.modules || [])
    .filter(m => query && (m.title.toLowerCase().includes(query.toLowerCase()) || m.arabicTitle.includes(query)))
    .slice(0, 4);

  const matchedSurvival = (SURVIVAL_DATA?.domains || [])
    .flatMap(d => d.phrases)
    .filter(p => query && (p.german.toLowerCase().includes(query.toLowerCase()) || p.arabic.includes(query)))
    .slice(0, 4);

  const handleNavigate = (viewName: any) => {
    setActiveView(viewName);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 animate-fadeIn">
      <div className="bg-white border border-stone-200 w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-stone-200 flex items-center gap-3 bg-stone-50">
          <Search className="w-4 h-4 text-amber-700 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search curriculum, vocab, grammar..."
            className="w-full bg-transparent text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-700 text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="p-2 overflow-y-auto space-y-3 divide-y divide-stone-100 text-xs">
          
          {/* Quick Nav Section */}
          {!query && (
            <div className="space-y-1 p-1">
              <div className="px-2 py-1 text-[10px] font-black uppercase text-stone-400 tracking-wider">
                Quick Navigation
              </div>
              <button
                onClick={() => handleNavigate('dashboard')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-stone-800 font-bold group"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  <span>Daily Command Center</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleNavigate('curriculum')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-stone-800 font-bold group"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>56-Day Master Roadmap</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleNavigate('vocabulary')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-stone-800 font-bold group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Vocabulary SRS Flashcards</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleNavigate('grammar')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-stone-800 font-bold group"
              >
                <div className="flex items-center gap-2">
                  <PenTool className="w-3.5 h-3.5 text-amber-600" />
                  <span>18 Core Grammar Modules</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleNavigate('survival')}
                className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 text-stone-800 font-bold group"
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5 text-amber-600" />
                  <span>Germany Survival Phrasebook</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {/* Curriculum Results */}
          {matchedCurriculum.length > 0 && (
            <div className="pt-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-black uppercase text-amber-700 tracking-wider">
                Curriculum Days
              </div>
              {matchedCurriculum.map(d => (
                <div
                  key={`curr-${d.dayNumber}`}
                  onClick={() => handleNavigate('curriculum')}
                  className="p-2 rounded hover:bg-amber-50 cursor-pointer flex items-center justify-between"
                >
                  <span className="font-bold text-stone-800">Day {d.dayNumber}: {d.title}</span>
                  <span className="text-[10px] text-stone-400 font-mono">Week {d.weekNumber}</span>
                </div>
              ))}
            </div>
          )}

          {/* Vocabulary Results */}
          {matchedVocab.length > 0 && (
            <div className="pt-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                Vocabulary Words
              </div>
              {matchedVocab.map(v => (
                <div
                  key={`vocab-${v.id}`}
                  onClick={() => handleNavigate('vocabulary')}
                  className="p-2 rounded hover:bg-emerald-50 cursor-pointer flex items-center justify-between"
                >
                  <span className="font-bold text-stone-900">{v.article ? `${v.article} ` : ''}{v.german}</span>
                  <span className="font-arabic text-stone-600 font-bold">{v.arabic}</span>
                </div>
              ))}
            </div>
          )}

          {/* Grammar Results */}
          {matchedGrammar.length > 0 && (
            <div className="pt-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                Grammar Modules
              </div>
              {matchedGrammar.map(g => (
                <div
                  key={`gram-${g.id}`}
                  onClick={() => handleNavigate('grammar')}
                  className="p-2 rounded hover:bg-indigo-50 cursor-pointer flex items-center justify-between"
                >
                  <span className="font-bold text-stone-900">Module #{g.id}: {g.title}</span>
                  <span className="font-arabic text-stone-600">{g.arabicTitle}</span>
                </div>
              ))}
            </div>
          )}

          {/* Survival Results */}
          {matchedSurvival.length > 0 && (
            <div className="pt-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-black uppercase text-rose-700 tracking-wider">
                Survival Phrases
              </div>
              {matchedSurvival.map(s => (
                <div
                  key={`surv-${s.id}`}
                  onClick={() => handleNavigate('survival')}
                  className="p-2 rounded hover:bg-rose-50 cursor-pointer flex items-center justify-between"
                >
                  <span className="font-bold text-stone-900">{s.german}</span>
                  <span className="font-arabic text-stone-600">{s.arabic}</span>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Shortcut Legend */}
        <div className="p-2.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-mono">
          <div className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            <span>+ K to toggle palette</span>
          </div>
          <span>Press ESC to close</span>
        </div>

      </div>
    </div>
  );
};
