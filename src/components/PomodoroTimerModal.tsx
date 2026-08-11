import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Play, Pause, RotateCcw, Coffee, Brain, CheckCircle2, Flame, Settings } from 'lucide-react';

interface PomodoroTimerModalProps {
  onClose: () => void;
  initialTask?: string;
  onSessionComplete?: (minutes: number, type: 'focus' | 'break') => void;
}

type TimerPhase = 'focus' | 'short_break' | 'long_break';

const PHASE_CONFIG: Record<TimerPhase, { label: string; minutes: number; color: string; bg: string; icon: React.ElementType }> = {
  focus:       { label: 'Focus Sprint',  minutes: 25, color: 'text-amber-400',  bg: 'bg-amber-500',  icon: Brain },
  short_break: { label: 'Short Break',   minutes: 5,  color: 'text-emerald-400', bg: 'bg-emerald-500', icon: Coffee },
  long_break:  { label: 'Long Break',    minutes: 15, color: 'text-indigo-400',  bg: 'bg-indigo-500',  icon: Coffee },
};

export const PomodoroTimerModal: React.FC<PomodoroTimerModalProps> = ({ onClose, initialTask, onSessionComplete }) => {
  const [phase, setPhase] = useState<TimerPhase>('focus');
  const [customMinutes, setCustomMinutes] = useState<Record<TimerPhase, number>>({
    focus: 25, short_break: 5, long_break: 15
  });
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = customMinutes[phase] * 60;
  const percent = Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100);
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const startNext = useCallback((currentPhase: TimerPhase, currentCount: number) => {
    if (currentPhase === 'focus') {
      const next = currentCount > 0 && currentCount % 4 === 0 ? 'long_break' : 'short_break';
      setPhase(next);
      setSecondsLeft(customMinutes[next] * 60);
    } else {
      setPhase('focus');
      setSecondsLeft(customMinutes.focus * 60);
    }
    setIsRunning(false);
  }, [customMinutes]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            if (phase === 'focus') {
              const next = completedPomodoros + 1;
              setCompletedPomodoros(next);
              onSessionComplete?.(customMinutes.focus, 'focus');
              startNext('focus', next);
            } else {
              onSessionComplete?.(customMinutes[phase], 'break');
              startNext(phase, completedPomodoros);
            }
            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(phase === 'focus' ? '🎉 Focus sprint complete!' : '⚡ Break over, time to focus!');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, phase, completedPomodoros, customMinutes, startNext, onSessionComplete]);

  const switchPhase = (p: TimerPhase) => {
    setPhase(p);
    setSecondsLeft(customMinutes[p] * 60);
    setIsRunning(false);
  };

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft(customMinutes[phase] * 60);
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) Notification.requestPermission();
  };

  const PhaseIcon = PHASE_CONFIG[phase].icon;

  // SVG circle progress
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-sm bg-[#111115] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Top stripe */}
        <div className="german-flag-stripe" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white">Pomodoro Timer</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(s => !s)}
              className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showSettings ? (
          /* Settings Panel */
          <div className="p-5 space-y-4">
            <h4 className="text-sm font-bold text-white/80">Customize Intervals</h4>
            {(Object.entries(customMinutes) as [TimerPhase, number][]).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-xs text-white/60 capitalize">{PHASE_CONFIG[key].label}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCustomMinutes(p => ({ ...p, [key]: Math.max(1, p[key] - 1) }))}
                    className="w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 text-sm font-bold flex items-center justify-center"
                  >−</button>
                  <span className="text-sm font-mono text-white w-8 text-center">{val}m</span>
                  <button
                    onClick={() => setCustomMinutes(p => ({ ...p, [key]: Math.min(120, p[key] + 1) }))}
                    className="w-7 h-7 rounded-lg bg-white/10 text-white hover:bg-white/20 text-sm font-bold flex items-center justify-center"
                  >+</button>
                </div>
              </div>
            ))}
            <button
              onClick={() => { setSecondsLeft(customMinutes[phase] * 60); setShowSettings(false); }}
              className="w-full py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-sm hover:bg-amber-400 transition-colors"
            >
              Apply & Close
            </button>
          </div>
        ) : (
          <>
            {/* Phase Tabs */}
            <div className="flex gap-1 p-3 bg-white/5">
              {(Object.entries(PHASE_CONFIG) as [TimerPhase, typeof PHASE_CONFIG[TimerPhase]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => switchPhase(key)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                    phase === key ? `${cfg.bg} text-stone-950` : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
            </div>

            {/* Timer Ring */}
            <div className="flex flex-col items-center py-6 space-y-4">
              {initialTask && (
                <div className="px-3 py-1.5 rounded-lg bg-white/10 text-white/70 text-[11px] text-center max-w-[85%] leading-snug">
                  📚 {initialTask}
                </div>
              )}

              <div className="relative">
                <svg width={200} height={200} className="-rotate-90">
                  <circle cx={100} cy={100} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
                  <circle
                    cx={100} cy={100} r={radius}
                    fill="none"
                    stroke={phase === 'focus' ? '#f59e0b' : phase === 'short_break' ? '#10b981' : '#6366f1'}
                    strokeWidth={10}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-mono text-4xl font-black text-white tracking-wider">{formatted}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${PHASE_CONFIG[phase].color}`}>
                    {PHASE_CONFIG[phase].label}
                  </span>
                </div>
              </div>

              {/* Pomodoro dots */}
              <div className="flex items-center gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i < (completedPomodoros % 4)
                        ? 'bg-amber-400 scale-110'
                        : 'bg-white/15'
                    }`}
                  />
                ))}
                <span className="text-[10px] text-white/40 ml-1 font-mono">{completedPomodoros} done</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 px-5 pb-5">
              <button
                onClick={() => setIsRunning(r => !r)}
                className={`flex-1 py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isRunning
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                }`}
              >
                {isRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4 fill-stone-950" /> Start</>}
              </button>
              <button
                onClick={reset}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={requestNotificationPermission}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Enable notifications"
              >
                🔔
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
