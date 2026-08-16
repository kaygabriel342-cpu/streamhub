'use client';

import { use, useEffect, useState } from 'react';
import Header from '@/components/Header';
import CinemaPlayer from '@/components/CinemaPlayer';
import { TMDBMovieDetails } from '@/lib/tmdb/types';

export default function WatchMoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [movie, setMovie] = useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovie() {
      try {
        const response = await fetch(`/api/tmdb/movie/${id}`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Failed to load movie:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#e50914] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-20">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <CinemaPlayer
            tmdbId={Number(id)}
            mediaType="movie"
            title={movie?.title || 'Movie'}
            posterPath={movie?.poster_path}
            autoPlay
          />
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-white md:text-3xl">{movie?.title || 'Movie'}</h1>
            {movie?.overview && <p className="mt-3 max-w-4xl text-[#b3b3b3]">{movie.overview}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
