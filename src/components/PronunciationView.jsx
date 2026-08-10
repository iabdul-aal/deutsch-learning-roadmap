import React from 'react';
import { PRONUNCIATION_DATA } from '../data/tracks/german-a1-ar/pronunciation';
import { playGermanTTS } from '../utils/audio';
import { Volume2, AlertTriangle, Type, HelpCircle } from 'lucide-react';

export const PronunciationView = () => {
  const traps = PRONUNCIATION_DATA?.arabicTraps || [];
  const vowels = PRONUNCIATION_DATA?.sounds || [];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="paper-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
            PHONETICS & ARABIC TRAPS LAB
          </span>
          <h2 className="text-lg font-extrabold text-stone-900 mt-0.5">
            German Phonetics & Arabic Speaker Traps
          </h2>
          <p className="text-xs text-stone-600">
            Master P vs B, V vs F, CH sound (Ich vs Ach), Vocalic R, and Auslautverhärtung with audio TTS.
          </p>
        </div>
      </div>

      {/* Top 5 Arabic Speaker Traps */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold text-stone-700 uppercase tracking-wider px-1 flex items-center gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Top 5 Pronunciation Traps for Arabic Speakers</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {traps.map((trap, idx) => (
            <div key={trap.id} className="paper-card p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-stone-200 pb-2.5">
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 text-[10px] font-black">
                  TRAP #{idx + 1}
                </span>
                <h4 className="text-sm font-extrabold text-stone-900">{trap.sound}</h4>
              </div>

              <div className="dir-rtl text-right font-arabic text-amber-900 font-bold text-xs bg-amber-50/60 p-2.5 rounded border border-amber-200" dir="rtl">
                {trap.problem}
              </div>

              <p className="text-xs text-stone-700 leading-relaxed flex items-start gap-1">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span><strong className="text-amber-800">Phonetic Fix:</strong> {trap.fix}</span>
              </p>

              {/* Example Words with Audio */}
              <div className="p-3 rounded bg-stone-50 border border-stone-200 space-y-2 pt-2">
                <span className="text-[10px] font-bold text-stone-500 uppercase block">Practice Words:</span>
                <div className="flex flex-wrap items-center gap-2">
                  {trap.examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => playGermanTTS(ex.replace(/\s*\[.*\]/, ''))}
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-amber-500 hover:text-stone-950 text-amber-900 text-xs font-bold border border-stone-300 transition-all shadow-xs"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-stone-500" />
                      <span>{ex}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Umlauts & Vowel Combinations */}
      <div className="space-y-3 pt-4">
        <h3 className="text-xs font-extrabold text-stone-700 uppercase tracking-wider px-1 flex items-center gap-1.5">
          <Type className="w-4 h-4 text-indigo-600" />
          <span>Umlauts & Vowel Combinations Guide (Ä, Ö, Ü, ß, EI, IE, EU)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {vowels.map((v, idx) => (
            <div key={idx} className="paper-card p-4 space-y-2">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xl font-black text-amber-800">{v.sound}</span>
                <span className="text-xs text-stone-500 font-mono">{v.phonetic}</span>
              </div>
              <p className="text-xs text-stone-800 font-arabic text-right dir-rtl" dir="rtl">{v.arabic}</p>

              <div className="pt-2 space-y-1">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Examples:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {v.examples.map((ex, i) => (
                    <button
                      key={i}
                      onClick={() => playGermanTTS(ex)}
                      className="px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-500 hover:text-stone-950 text-stone-800 text-xs font-bold border border-stone-300 flex items-center gap-1 transition-all"
                    >
                      <span>{ex}</span>
                      <Volume2 className="w-3 h-3 text-stone-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
