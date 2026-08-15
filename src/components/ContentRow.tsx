'use client';

import { useRef } from 'react';
import MovieCard from './MovieCard';
import { TMDBMedia } from '@/lib/tmdb/types';

interface ContentRowProps {
  title: string;
  items: TMDBMedia[];
  viewAllHref?: string;
}

export default function ContentRow({ title, items, viewAllHref }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          {viewAllHref && (
            <a
              href={viewAllHref}
              className="text-[#e50914] hover:text-[#f40612] text-sm font-medium transition-colors"
            >
              View All →
            </a>
          )}
        </div>
        
        <div className="relative group">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-r from-[#141414] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Content Row */}
          <div
            ref={rowRef}
            className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {items.map((item) => (
              <MovieCard key={`${item.id}-${item.media_type}`} media={item} />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-full bg-gradient-to-l from-[#141414] to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
