import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, RotateCcw, X, Volume2 } from 'lucide-react';

interface QuickTimerModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const QuickTimerModal: React.FC<QuickTimerModalProps> = ({ isOpen = true, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25 mins
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      alert("🎉 Pomodoro Study Sprint Completed! Take a 5-minute break.");
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const setPreset = (m) => {
    setIsRunning(false);
    setSecondsLeft(m * 60);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full space-y-6 shadow-2xl animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-extrabold text-white flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Study Session Timer</span>
          </h3>
          <p className="text-xs text-slate-400">Pomodoro focus sprint for intensive learning.</p>
        </div>

        {/* Big Digital Clock Display */}
        <div className="py-6 rounded-2xl bg-slate-950 border border-slate-800 text-center font-mono text-5xl font-black text-amber-400 tracking-wider shadow-inner">
          {formattedTime}
        </div>

        {/* Presets */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPreset(15)}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
          >
            15m
          </button>
          <button
            onClick={() => setPreset(25)}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
          >
            25m (Pomodoro)
          </button>
          <button
            onClick={() => setPreset(45)}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
          >
            45m Deep Work
          </button>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              isRunning ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isRunning ? <><Pause className="w-4 h-4" /> Pause Timer</> : <><Play className="w-4 h-4" /> Start Timer</>}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(1500);
            }}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset to 25m"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
