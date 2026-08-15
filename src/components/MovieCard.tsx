'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl, getBackdropUrl } from '@/lib/tmdb/api';
import { TMDBMedia } from '@/lib/tmdb/types';

interface MovieCardProps {
  media: TMDBMedia;
  size?: 'small' | 'medium' | 'large';
}

export default function MovieCard({ media, size = 'medium' }: MovieCardProps) {
  const title = media.title || media.name || 'Unknown';
  const releaseDate = media.release_date || media.first_air_date || 'N/A';
  const year = releaseDate.split('-')[0];
  const rating = media.vote_average?.toFixed(1) || 'N/A';
  const mediaType = media.media_type || 'movie';
  const posterPath = media.poster_path;

  const sizeClasses = {
    small: 'w-28 md:w-32',
    medium: 'w-36 md:w-44',
    large: 'w-48 md:w-56',
  };

  return (
    <Link
      href={`/${mediaType === 'tv' ? 'tv' : 'movie'}/${media.id}`}
      className={`${sizeClasses[size]} flex-shrink-0 group cursor-pointer`}
    >
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1f1f1f] card-hover">
        {posterPath ? (
          <Image
            src={getImageUrl(posterPath, 'w500')}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 128px, (max-width: 1024px) 176px, 224px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#2a2a2a]">
            <svg className="w-12 h-12 text-[#444]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
            </svg>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-2 left-2 rating-badge">
          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-white">{rating}</span>
        </div>

        {/* Media Type Badge */}
        {mediaType === 'tv' && (
          <div className="absolute top-2 right-2 bg-[#e50914] text-white text-xs px-2 py-1 rounded">
            TV
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
          <p className="text-white text-sm font-medium line-clamp-2">{title}</p>
          <p className="text-[#b3b3b3] text-xs">{year}</p>
        </div>
      </div>
      
      <div className="mt-2 px-1">
        <h3 className="text-white text-sm font-medium truncate group-hover:text-[#e50914] transition-colors">
          {title}
        </h3>
        <p className="text-[#666] text-xs">{year}</p>
      </div>
    </Link>
  );
}
