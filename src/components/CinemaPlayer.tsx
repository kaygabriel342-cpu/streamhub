'use client';

import { useEffect, useRef, useState } from 'react';

interface CinemaPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title?: string;
  onWatchParty?: () => void;
}

interface StreamingSource {
  id: string;
  name: string;
  getUrl: () => string;
}

export default function CinemaPlayer({
  tmdbId,
  mediaType,
  season = 1,
  episode = 1,
  title,
  onWatchParty,
}: CinemaPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [selectedSource, setSelectedSource] = useState('vidsrc');
  const [isLoading, setIsLoading] = useState(true);
  const [showSources, setShowSources] = useState(false);

  // Streaming sources - all without sandbox, compatible with Chrome extensions
  const sources: StreamingSource[] = [
    {
      id: 'vidsrc',
      name: 'VidSrc (No Ads)',
      getUrl: () => mediaType === 'movie'
        ? `https://vidsrc.sbs/embed/movie/${tmdbId}?autoplay=1`
        : `https://vidsrc.sbs/embed/tv/${tmdbId}/${season}/${episode}?autoplay=1`,
    },
    {
      id: 'vidcore',
      name: 'VidCore (4K)',
      getUrl: () => mediaType === 'movie'
        ? `https://www.vidcore.org/embed/movie/${tmdbId}`
        : `https://www.vidcore.org/embed/tv/${tmdbId}/${season}/${episode}`,
    },
    {
      id: '2embed',
      name: '2Embed',
      getUrl: () => mediaType === 'movie'
        ? `https://www.2embed.online/embed/movie/${tmdbId}`
        : `https://www.2embed.online/embed/tv/${tmdbId}/${season}/${episode}`,
    },
    {
      id: 'superembed',
      name: 'SuperEmbed',
      getUrl: () => mediaType === 'movie'
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
    },
  ];

  const currentSource = sources.find(s => s.id === selectedSource) || sources[0];
  const embedUrl = currentSource.getUrl();

  useEffect(() => {
    setIsLoading(true);
  }, [embedUrl]);

  const handleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
    if (!isTheaterMode && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black transition-all duration-500 ${
        isTheaterMode 
          ? 'fixed inset-0 z-[100] w-full h-full' 
          : 'relative w-full aspect-video'
      }`}
    >
      {/* Top Control Bar */}
      <div className={`absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent p-4 transition-opacity duration-300 ${
        isTheaterMode ? 'opacity-100' : 'opacity-0 hover:opacity-100'
      }`}>
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          {/* Title */}
          <div className="flex items-center gap-4">
            <h2 className="text-white text-lg font-semibold truncate max-w-md">
              {title || 'Now Playing'}
            </h2>
            {mediaType === 'tv' && (
              <span className="text-[#666] text-sm">
                S{season}:E{episode}
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Watch Party Button */}
            {onWatchParty && (
              <button
                onClick={onWatchParty}
                className="flex items-center gap-2 px-4 py-2 bg-[#e50914] hover:bg-[#f40612] text-white rounded-lg font-medium transition-colors"
                title="Start Watch Party"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                </svg>
                Watch Party
              </button>
            )}

            {/* Theater Mode */}
            <button
              onClick={handleTheaterMode}
              className="p-2 text-white hover:text-[#e50914] transition-colors"
              title={isTheaterMode ? 'Exit Theater Mode' : 'Theater Mode'}
            >
              {isTheaterMode ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="p-2 text-white hover:text-[#e50914] transition-colors"
              title="Fullscreen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>

            {/* Close button for theater mode */}
            {isTheaterMode && (
              <button
                onClick={handleTheaterMode}
                className="p-2 text-white hover:text-[#e50914] transition-colors"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Source Selector - Bottom Left */}
      <div className={`absolute bottom-0 left-0 z-50 p-4 transition-opacity duration-300 ${
        isTheaterMode ? 'opacity-100' : 'opacity-0 hover:opacity-100'
      }`}>
        <div className="relative">
          <button
            onClick={() => setShowSources(!showSources)}
            className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm text-white rounded-lg hover:bg-black/90 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {currentSource.name}
            <svg className={`w-4 h-4 transition-transform ${showSources ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Source Dropdown */}
          {showSources && (
            <div className="absolute bottom-full left-0 mb-2 bg-[#1a1a1a] rounded-lg shadow-xl overflow-hidden min-w-[200px]">
              {sources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => {
                    setSelectedSource(source.id);
                    setShowSources(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-[#2a2a2a] transition-colors flex items-center justify-between ${
                    selectedSource === source.id ? 'bg-[#e50914]/20 text-[#e50914]' : 'text-white'
                  }`}
                >
                  <span>{source.name}</span>
                  {selectedSource === source.id && (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-40">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#666]">Loading stream...</p>
            <p className="text-[#444] text-sm mt-2">{currentSource.name}</p>
          </div>
        </div>
      )}

      {/* Video Iframe - NO SANDBOX for Chrome extension compatibility */}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        className="w-full h-full"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
        title="Video Player"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}
