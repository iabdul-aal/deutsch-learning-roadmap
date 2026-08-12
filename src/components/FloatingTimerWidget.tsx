import React from 'react';
import { Clock } from 'lucide-react';

interface FloatingTimerWidgetProps {
  onOpenModal: () => void;
}

/**
 * Floating Fixed Timer Widget that moves with scroll size across all pages.
 * Ensures the learner can launch or view their timer anywhere on screen.
 */
export const FloatingTimerWidget: React.FC<FloatingTimerWidgetProps> = ({ onOpenModal }) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 animate-fadeIn">
      <button
        onClick={onOpenModal}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 text-white hover:bg-amber-500 hover:text-stone-950 font-bold text-xs shadow-2xl border border-stone-700 transition-all transform hover:scale-105 active:scale-95 group"
        title="Open Study Session Timer (Floating)"
      >
        <Clock className="w-4 h-4 text-amber-400 group-hover:text-stone-950 transition-colors shrink-0" />
        <span className="tracking-wide">Study Timer</span>
      </button>
    </div>
  );
};
