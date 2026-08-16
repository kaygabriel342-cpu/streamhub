'use client';

import Hls from 'hls.js';
import { useEffect, useRef, useState } from 'react';

interface HLSPlayerProps {
  src: string;
  title: string;
  poster?: string;
  autoPlay?: boolean;
}

export default function HLSPlayer({ src, title, poster, autoPlay = true }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let hls: Hls | null = null;
    setError(null);
    setIsLoading(true);

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        if (autoPlay) video.play().catch(() => undefined);
      });
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (autoPlay) video.play().catch(() => undefined);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError('This stream could not be loaded. Try another channel.');
          setIsLoading(false);
          hls?.destroy();
        }
      });
    } else {
      setError('Your browser does not support HLS playback.');
      setIsLoading(false);
    }

    return () => {
      if (hls) hls.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [src, autoPlay]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl">
      <video
        ref={videoRef}
        className="h-full w-full bg-black object-contain"
        controls
        playsInline
        autoPlay={autoPlay}
        muted={autoPlay}
        poster={poster}
        title={title}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#e50914] border-t-transparent" />
            <p className="text-sm text-[#b3b3b3]">Loading live stream...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#101010] p-8 text-center">
          <div>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#444] text-3xl text-[#b3b3b3]">!</div>
            <h3 className="mb-2 text-xl font-bold text-white">Stream unavailable</h3>
            <p className="max-w-md text-sm text-[#b3b3b3]">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
