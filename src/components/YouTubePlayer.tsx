import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ExternalLink, Maximize2, X, CheckCircle2, Play, Timer, Pause, RotateCcw, Flame } from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeWatchUrl } from '../data/contentRanking';
import { useApp } from '../context/AppContext';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  onComplete?: () => void;
  className?: string;
  autoplay?: boolean;
  dayNumber?: number;         // curriculum context — used in watch record
  taskTitle?: string;         // curriculum context — used in watch record
  startTimeSeconds?: number;  // timestamp crop start
  endTimeSeconds?: number;    // timestamp crop end
  estimatedMinutes?: number;  // estimated target task duration
}

function formatSecondsToMMSS(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatSecondsToTimestamp(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/**
 * Embedded YouTube player with timestamp cropping and integrated 25-min Pomodoro timer.
 */
export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title,
  onComplete,
  className = '',
  autoplay = false,
  dayNumber,
  taskTitle,
  startTimeSeconds,
  endTimeSeconds,
  estimatedMinutes = 25,
}) => {
  const { isVideoWatched, markVideoWatched } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const watched = isVideoWatched(videoId);

  // ── Pomodoro Timer State ──────────────────────────────────────────
  const targetPomodoroSec = Math.max(5, estimatedMinutes) * 60;
  const [pomodoroLeft, setPomodoroLeft] = useState<number>(targetPomodoroSec);
  const [isPomodoroRunning, setIsPomodoroRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPomodoroRunning && pomodoroLeft > 0) {
      interval = setInterval(() => {
        setPomodoroLeft(prev => {
          if (prev <= 1) {
            setIsPomodoroRunning(false);
            handleWatched();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPomodoroRunning, pomodoroLeft]);

  const togglePomodoro = () => {
    if (pomodoroLeft === 0) {
      setPomodoroLeft(targetPomodoroSec);
    }
    setIsPomodoroRunning(r => !r);
  };

  const resetPomodoro = () => {
    setIsPomodoroRunning(false);
    setPomodoroLeft(targetPomodoroSec);
  };

  const handleWatched = useCallback(() => {
    markVideoWatched(videoId, { dayNumber, taskTitle });
    onComplete?.();
  }, [videoId, dayNumber, taskTitle, markVideoWatched, onComplete]);

  // Listen for YouTube postMessage events (state 0 = ended)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      try {
        const data = JSON.parse(event.data as string);
        if (data.event === 'onStateChange' && data.info === 0) {
          handleWatched();
        }
      } catch {
        // non-JSON messages from YT — ignore
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [handleWatched]);

  const embedUrl = getYouTubeEmbedUrl(videoId, autoplay, startTimeSeconds, endTimeSeconds);
  const watchUrl = getYouTubeWatchUrl(videoId);

  const player = (
    <div
      className={`relative w-full bg-stone-950 rounded-2xl overflow-hidden shadow-md border border-stone-800 ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      <iframe
        src={embedUrl}
        title={title || 'German Lesson Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />

      {/* Persistent watched badge */}
      {watched && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg animate-fadeIn z-10">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Watched
        </div>
      )}

      {/* Segment Crop Badge (if cropped) */}
      {startTimeSeconds !== undefined && startTimeSeconds > 0 && (
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-stone-900/90 backdrop-blur-sm text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg border border-amber-500/30 z-10">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Lesson Segment: {formatSecondsToTimestamp(startTimeSeconds)} – {formatSecondsToTimestamp(endTimeSeconds || startTimeSeconds + 1500)}</span>
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-stone-950/95 backdrop-blur-md flex flex-col p-4">
        <div className="flex items-center justify-between p-3 bg-stone-900 border border-stone-800 rounded-xl mb-3">
          <span className="text-white text-sm font-bold truncate">{title}</span>
          <div className="flex items-center gap-2">
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-black transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Watch on YouTube</span>
            </a>
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          {player}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {player}

      {/* Control Bar & Integrated Pomodoro Timer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 rounded-xl bg-stone-900 text-white border border-stone-800 gap-2.5">
        
        {/* Left: Pomodoro Timer Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-bold text-xs">
            <Timer className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{formatSecondsToMMSS(pomodoroLeft)}</span>
            <span className="text-[10px] text-amber-500 font-sans font-bold uppercase ml-1">Focus</span>
          </div>

          <button
            onClick={togglePomodoro}
            className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 ${
              isPomodoroRunning
                ? 'bg-amber-500 text-stone-950 hover:bg-amber-400'
                : 'bg-stone-800 text-stone-200 hover:bg-stone-700'
            }`}
          >
            {isPomodoroRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
            <span>{isPomodoroRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={resetPomodoro}
            className="p-1 text-stone-400 hover:text-white transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {watched && (
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Watched
            </span>
          )}
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-black transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Open YouTube</span>
          </a>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface PlaylistEmbedProps {
  playlistId: string;
  title?: string;
  className?: string;
}

export const YouTubePlaylist: React.FC<PlaylistEmbedProps> = ({ playlistId, title, className = '' }) => {
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`;
  const watchUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="relative w-full bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 shadow-md" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={embedUrl}
          title={title || 'German Lesson Playlist'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
        {title && <span className="text-xs font-bold text-stone-800 truncate flex-1 pr-2">{title}</span>}
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shrink-0 shadow-xs"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Open Full Playlist</span>
        </a>
      </div>
    </div>
  );
};

export default YouTubePlayer;
