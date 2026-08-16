'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { getBackdropUrl } from '@/lib/tmdb/api';
import { TMDBMedia } from '@/lib/tmdb/types';

interface HeroProps {
  media?: TMDBMedia;
  items?: TMDBMedia[];
}

export default function Hero({ media, items = [] }: HeroProps) {
  const slides = useMemo(() => {
    const list = items.length > 0 ? items : media ? [media] : [];
    return list.filter((item) => item.backdrop_path).slice(0, 8);
  }, [items, media]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const active = slides[activeIndex];
  const title = active.title || active.name || 'Unknown';
  const overview = active.overview || '';
  const releaseDate = active.release_date || active.first_air_date || 'N/A';
  const year = releaseDate.split('-')[0];
  const rating = active.vote_average?.toFixed(1) || 'N/A';
  const mediaType = active.media_type || 'movie';
  const detailsHref = `/${mediaType === 'tv' ? 'tv' : 'movie'}/${active.id}`;
  const watchHref = mediaType === 'tv' ? `/watch/tv/${active.id}?season=1&episode=1` : `/watch/${active.id}`;

  return (
    <section className="relative h-[72vh] min-h-[560px] overflow-hidden md:h-[88vh]">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={`${slide.id}-${index}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === activeIndex ? 'opacity-100' : 'opacity-0'}`}
          >
            <Image
              src={getBackdropUrl(slide.backdrop_path, 'w1280')}
              alt={slide.title || slide.name || 'Featured title'}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-black/40" />
      </div>

      <div className="relative mx-auto flex h-full max-w-[1920px] items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl pt-20">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.35em] text-[#e50914]">Featured on Marqueeflix</p>
          <h1 className="mb-5 text-5xl font-black leading-none text-white drop-shadow-2xl md:text-7xl lg:text-8xl">
            {title}
          </h1>

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-1 rounded-md bg-black/70 px-3 py-1.5 text-white backdrop-blur-sm">
              <svg className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold">{rating}</span>
            </div>
            <span className="text-[#d0d0d0]">{year}</span>
            <span className="rounded bg-[#e50914] px-3 py-1 text-sm font-bold text-white">{mediaType === 'tv' ? 'Series' : 'Movie'}</span>
          </div>

          <p className="mb-8 max-w-2xl text-base leading-7 text-[#d0d0d0] md:text-lg line-clamp-4">
            {overview}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={watchHref}
              className="flex items-center gap-3 rounded-xl bg-[#e50914] px-8 py-4 text-lg font-black text-white shadow-lg shadow-[#e50914]/30 transition-all hover:scale-105 hover:bg-[#f40612]"
            >
              <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </Link>
            <Link
              href={detailsHref}
              className="flex items-center gap-3 rounded-xl bg-white/15 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-colors hover:bg-white/25"
            >
              More Info
            </Link>
          </div>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={`dot-${slide.id}-${index}`}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-10 bg-[#e50914]' : 'w-5 bg-white/40 hover:bg-white/70'}`}
              aria-label={`Show featured title ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
