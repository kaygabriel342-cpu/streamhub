'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContentRow from '@/components/ContentRow';
import { TMDBMedia } from '@/lib/tmdb/types';

export default function TrendingPage() {
  const [trending, setTrending] = useState<TMDBMedia[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<TMDBMedia[]>([]);
  const [trendingTV, setTrendingTV] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [trendingRes, moviesRes, tvRes] = await Promise.all([
          fetch('/api/tmdb/trending?type=all&timeWindow=week'),
          fetch('/api/tmdb/trending?type=movie&timeWindow=week'),
          fetch('/api/tmdb/trending?type=tv&timeWindow=week'),
        ]);

        const trendingData = await trendingRes.json();
        const moviesData = await moviesRes.json();
        const tvData = await tvRes.json();

        setTrending(trendingData.results?.filter((m: TMDBMedia) => m.media_type === 'movie' || m.media_type === 'tv') || []);
        setTrendingMovies(moviesData.results || []);
        setTrendingTV(tvData.results || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trending:', error);
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Trending</h1>
          
          <ContentRow title="Trending This Week" items={trending} />
          <ContentRow title="Trending Movies" items={trendingMovies} />
          <ContentRow title="Trending TV Shows" items={trendingTV} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
