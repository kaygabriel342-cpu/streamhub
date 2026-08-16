'use client';

import { use, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import CinemaPlayer from '@/components/CinemaPlayer';
import { TMDBTVDetails } from '@/lib/tmdb/types';

export default function WatchTVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const season = Number(searchParams.get('season') || '1');
  const episode = Number(searchParams.get('episode') || '1');
  const [show, setShow] = useState<TMDBTVDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShow() {
      try {
        const response = await fetch(`/api/tmdb/tv/${id}`);
        const data = await response.json();
        setShow(data);
      } catch (error) {
        console.error('Failed to load TV show:', error);
      } finally {
        setLoading(false);
      }
    }

    loadShow();
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
            mediaType="tv"
            season={season}
            episode={episode}
            title={show?.name || 'TV Show'}
            posterPath={show?.poster_path}
            autoPlay
          />
          <div className="mt-6">
            <h1 className="text-2xl font-bold text-white md:text-3xl">{show?.name || 'TV Show'}</h1>
            <p className="mt-2 text-[#b3b3b3]">Season {season}, Episode {episode}</p>
            {show?.overview && <p className="mt-3 max-w-4xl text-[#b3b3b3]">{show.overview}</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
