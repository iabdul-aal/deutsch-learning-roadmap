import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Play, Pause, RotateCcw, X, CheckCircle2 } from 'lucide-react';

interface QuickTimerModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

function playTimerChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio Context fallback
  }
}

export const QuickTimerModal: React.FC<QuickTimerModalProps> = ({ isOpen = true, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(1500); // 25 mins
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
      playTimerChime();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  if (!isOpen) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const setPreset = (m: number) => {
    setIsRunning(false);
    setIsCompleted(false);
    setSecondsLeft(m * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setSecondsLeft(1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-sm w-full space-y-6 shadow-2xl animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          aria-label="Close timer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-black text-white flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>Study Session Timer</span>
          </h3>
          <p className="text-xs text-stone-400">Pomodoro focus sprint for intensive study.</p>
        </div>

        {/* Digital Clock Display */}
        <div className="py-6 rounded-2xl bg-stone-950 border border-stone-800 text-center font-mono text-5xl font-black text-amber-400 tracking-wider shadow-inner relative">
          {formattedTime}
          {isCompleted && (
            <div className="absolute inset-0 bg-stone-950/90 rounded-2xl flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Sprint Completed!</span>
            </div>
          )}
        </div>

        {/* Presets */}
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { mins: 15, label: '15 min' },
            { mins: 25, label: '25 min' },
            { mins: 45, label: '45 min' },
          ].map(p => (
            <button
              key={p.mins}
              onClick={() => setPreset(p.mins)}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-bold text-stone-300 transition-colors border border-stone-700"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (isCompleted) setIsCompleted(false);
              setIsRunning(!isRunning);
            }}
            className={`flex-1 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              isRunning ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Timer</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start Timer</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
            title="Reset to 25m"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickTimerModal;
