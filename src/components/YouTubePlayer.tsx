import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, ExternalLink, Maximize2, X, Volume2, CheckCircle2 } from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeWatchUrl } from '../data/contentRanking';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  onComplete?: () => void;
  className?: string;
  autoplay?: boolean;
}

/**
 * Embedded YouTube player component.
 * Uses the YouTube iframe embed API - no external redirect needed.
 * Tracks watch completion via YouTube postMessage API.
 */
export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  title,
  onComplete,
  className = '',
  autoplay = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasWatched, setHasWatched] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for YouTube player state messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      try {
        const data = JSON.parse(event.data);
        // YT player state 0 = ended
        if (data.event === 'onStateChange' && data.info === 0) {
          setHasWatched(true);
          onComplete?.();
        }
      } catch {
        // non-JSON messages from YT
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  const embedUrl = getYouTubeEmbedUrl(videoId, autoplay);

  const player = (
    <div className={`relative w-full bg-black rounded-xl overflow-hidden ${className}`} style={{ aspectRatio: '16/9' }}>
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={title || 'German Lesson Video'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
      {/* Completion badge overlay */}
      {hasWatched && (
        <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <CheckCircle2 className="w-3 h-3" /> Watched
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col">
        <div className="flex items-center justify-between p-3 bg-black/80">
          <span className="text-white text-sm font-bold truncate">{title}</span>
          <button
            onClick={() => setIsFullscreen(false)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          {player}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {player}
      <div className="flex items-center justify-between">
        {title && <span className="text-xs text-stone-600 font-medium truncate flex-1">{title}</span>}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <a
            href={getYouTubeWatchUrl(videoId)}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
            title="Open in YouTube"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
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

/**
 * Embeds a full YouTube playlist.
 */
export const YouTubePlaylist: React.FC<PlaylistEmbedProps> = ({ playlistId, title, className = '' }) => {
  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&rel=0 and modestbranding=1`;
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <iframe
          src={embedUrl}
          title={title || 'German Lesson Playlist'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
      {title && <p className="text-xs text-stone-600 font-medium">{title}</p>}
    </div>
  );
};
