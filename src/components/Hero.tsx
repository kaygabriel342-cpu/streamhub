'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getBackdropUrl, getImageUrl } from '@/lib/tmdb/api';
import { TMDBMedia } from '@/lib/tmdb/types';

interface HeroProps {
  media: TMDBMedia;
}

export default function Hero({ media }: HeroProps) {
  const title = media.title || media.name || 'Unknown';
  const overview = media.overview || '';
  const releaseDate = media.release_date || media.first_air_date || 'N/A';
  const year = releaseDate.split('-')[0];
  const rating = media.vote_average?.toFixed(1) || 'N/A';
  const mediaType = media.media_type || 'movie';

  return (
    <section className="relative h-[70vh] md:h-[85vh] min-h-[500px]">
      {/* Backdrop Image */}
      <div className="absolute inset-0">
        {media.backdrop_path ? (
          <Image
            src={getBackdropUrl(media.backdrop_path, 'w1280')}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#2a2a2a]" />
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 gradient-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-2xl pt-20">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-lg">
            {title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="rating-badge">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-medium">{rating}</span>
            </div>
            <span className="text-[#b3b3b3]">{year}</span>
            {mediaType === 'tv' && (
              <span className="bg-[#e50914] text-white text-sm px-3 py-1 rounded">TV Series</span>
            )}
          </div>

          {/* Overview */}
          <p className="text-[#b3b3b3] text-base md:text-lg mb-8 line-clamp-3 md:line-clamp-4">
            {overview}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              href={`/${mediaType === 'tv' ? 'tv' : 'movie'}/${media.id}`}
              className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#e50914] hover:bg-[#f40612] text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </Link>
            <Link
              href={`/${mediaType === 'tv' ? 'tv' : 'movie'}/${media.id}`}
              className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-[#333]/80 hover:bg-[#444]/80 text-white font-semibold rounded-lg transition-colors backdrop-blur-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
