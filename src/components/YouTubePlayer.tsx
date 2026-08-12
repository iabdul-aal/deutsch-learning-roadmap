import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ExternalLink, Maximize2, X, CheckCircle2, Play } from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeWatchUrl } from '../data/contentRanking';
import { useApp } from '../context/AppContext';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  onComplete?: () => void;
  className?: string;
  autoplay?: boolean;
  dayNumber?: number;   // curriculum context — used in watch record
  taskTitle?: string;   // curriculum context — used in watch record
}

/**
 * Embedded YouTube player with persistent watch progress saved to localStorage.
 * A green "Watched" badge appears immediately after the video ends, and reappears
 * on every future visit to the page.
 */
export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title,
  onComplete,
  className = '',
  autoplay = false,
  dayNumber,
  taskTitle,
}) => {
  const { isVideoWatched, markVideoWatched } = useApp();
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Derive watched state from persistent store so badge survives page reload
  const watched = isVideoWatched(videoId);

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
        // info === 0 means video ended; info === 1 means playing (started)
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

  const embedUrl = getYouTubeEmbedUrl(videoId, autoplay);
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
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Watched
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
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
        {title && <span className="text-xs font-bold text-stone-800 truncate flex-1 pr-2">{title}</span>}
        <div className="flex items-center gap-2 shrink-0">
          {watched && (
            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" /> Watched
            </span>
          )}
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{videoId.startsWith('PL') || videoId.includes('playlist') ? 'Open Full Playlist' : 'Watch on YouTube'}</span>
          </a>
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-200 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Playlist embed (unchanged) ────────────────────────────────────

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
