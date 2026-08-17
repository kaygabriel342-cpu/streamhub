'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CinemaPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title?: string;
  posterPath?: string | null;
  autoPlay?: boolean;
}

export default function CinemaPlayer({
  tmdbId,
  mediaType,
  season = 1,
  episode = 1,
  title,
  autoPlay = false,
}: CinemaPlayerProps) {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  const embedUrl = useMemo(() => {
    const params = new URLSearchParams({
      color: 'e50914',
      autoPlay: String(autoPlay),
    });

    if (mediaType === 'tv') {
      params.set('nextEpisode', 'true');
      params.set('episodeSelector', 'true');
      return `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}?${params.toString()}`;
    }

    return `https://www.vidking.net/embed/movie/${tmdbId}?${params.toString()}`;
  }, [tmdbId, mediaType, season, episode, autoPlay]);

  useEffect(() => {
    setIsLoading(true);
  }, [embedUrl]);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
    };

    const node = containerRef.current;
    node?.addEventListener('mousemove', handleMouseMove);
    return () => {
      if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
      node?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleTheaterMode = () => {
    setIsTheaterMode((value) => !value);
    if (!isTheaterMode && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleFullscreen = () => {
    iframeRef.current?.requestFullscreen?.();
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-black transition-all duration-500 ${
        isTheaterMode ? 'fixed inset-0 z-[100] h-full w-full' : 'w-full rounded-2xl border border-white/10 aspect-video'
      }`}
    >
      <div className={`absolute left-0 right-0 top-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button onClick={() => router.back()} className="rounded-full p-2 text-white transition-colors hover:bg-white/10" aria-label="Go back">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-white">{title || 'Now playing'}</h2>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#e50914]">VidKing Player</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleTheaterMode} className="rounded-lg p-2 text-white transition-colors hover:bg-white/10" aria-label="Theater mode">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            </button>
            <button onClick={handleFullscreen} className="rounded-lg p-2 text-white transition-colors hover:bg-white/10" aria-label="Fullscreen">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3M3 16v3a2 2 0 002 2h3m8 0h3a2 2 0 002-2v-3" /></svg>
            </button>
            {isTheaterMode && (
              <button onClick={handleTheaterMode} className="rounded-lg p-2 text-white transition-colors hover:bg-red-500/20" aria-label="Close theater mode">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#e50914] border-t-transparent" />
            <p className="text-sm text-[#aaa]">Loading VidKing...</p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="h-full w-full"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
        title="VidKing player"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
