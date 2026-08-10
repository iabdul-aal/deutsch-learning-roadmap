import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, RotateCcw, X, Bell, CheckCircle2, Coffee, Flame } from 'lucide-react';

interface PomodoroTimerModalProps {
  onClose: () => void;
}

export const PomodoroTimerModal: React.FC<PomodoroTimerModalProps> = ({ onClose }) => {
  const { addListeningMinutes } = useApp();

  const [timerMode, setTimerMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Mode durations in seconds
  const modeDurations = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const handleModeChange = (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setTimerMode(mode);
    setSecondsLeft(modeDurations[mode]);
    setIsRunning(false);
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerMode === 'pomodoro') {
        const nextCompleted = completedSessions + 1;
        setCompletedSessions(nextCompleted);
        addListeningMinutes(25); // Log 25 mins of focused study
        alert("🎉 Pomodoro Session Complete! Take a 5-minute short break.");
        handleModeChange(nextCompleted % 4 === 0 ? 'longBreak' : 'shortBreak');
      } else {
        alert("☕ Break time is over! Ready for your next Pomodoro session?");
        handleModeChange('pomodoro');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, timerMode, completedSessions]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.round(
    ((modeDurations[timerMode] - secondsLeft) / modeDurations[timerMode]) * 100
  );

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-xl shadow-2xl w-full max-w-md p-6 space-y-6 relative">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-extrabold text-stone-900">Pomodoro Focus Timer</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timer Mode Selector Tabs */}
        <div className="bg-stone-100 p-1 rounded-lg border border-stone-300 flex items-center gap-1 text-xs font-bold">
          <button
            onClick={() => handleModeChange('pomodoro')}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              timerMode === 'pomodoro'
                ? 'bg-amber-500 text-stone-950 font-black shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🍅 Focus (25m)
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              timerMode === 'shortBreak'
                ? 'bg-emerald-600 text-white font-black shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            ☕ Short (5m)
          </button>
          <button
            onClick={() => handleModeChange('longBreak')}
            className={`flex-1 py-1.5 rounded transition-all text-center ${
              timerMode === 'longBreak'
                ? 'bg-indigo-600 text-white font-black shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🌴 Long (15m)
          </button>
        </div>

        {/* Large Countdown Display */}
        <div className="text-center space-y-3 py-4">
          <div className="text-6xl font-black text-stone-900 font-mono tracking-tight">
            {formatTime(secondsLeft)}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
            <div
              className={`h-full transition-all duration-300 ${
                timerMode === 'pomodoro' ? 'bg-amber-500' :
                timerMode === 'shortBreak' ? 'bg-emerald-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          <div className="text-xs font-bold text-stone-500 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Completed Today: <strong>{completedSessions} Pomodoros</strong> ({completedSessions * 25} mins focus)</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-3 rounded-lg font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xs ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Pause Timer
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> Start Focus Session
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsLeft(modeDurations[timerMode]);
            }}
            className="p-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 font-bold"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
