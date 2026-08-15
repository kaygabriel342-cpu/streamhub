'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContentRow from '@/components/ContentRow';
import { TMDBMedia } from '@/lib/tmdb/types';

export default function MoviesPage() {
  const [popular, setPopular] = useState<TMDBMedia[]>([]);
  const [topRated, setTopRated] = useState<TMDBMedia[]>([]);
  const [upcoming, setUpcoming] = useState<TMDBMedia[]>([]);
  const [nowPlaying, setNowPlaying] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [popularRes, topRatedRes, upcomingRes, nowPlayingRes] = await Promise.all([
          fetch('/api/tmdb/trending?type=movie&timeWindow=week'),
          fetch('/api/tmdb/trending?type=movie&timeWindow=week'),
          fetch('/api/tmdb/trending?type=movie&timeWindow=day'),
          fetch('/api/tmdb/trending?type=movie&timeWindow=day'),
        ]);

        const popularData = await popularRes.json();
        const topRatedData = await topRatedRes.json();
        const upcomingData = await upcomingRes.json();
        const nowPlayingData = await nowPlayingRes.json();

        setPopular(popularData.results || []);
        setTopRated(topRatedData.results || []);
        setUpcoming(upcomingData.results || []);
        setNowPlaying(nowPlayingData.results || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-pulse text-[#666]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Movies</h1>
          
          <ContentRow title="Popular Movies" items={popular} />
          <ContentRow title="Top Rated Movies" items={topRated} />
          <ContentRow title="Now Playing" items={nowPlaying} />
          <ContentRow title="Coming Soon" items={upcoming} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
