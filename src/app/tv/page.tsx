'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContentRow from '@/components/ContentRow';
import { TMDBMedia } from '@/lib/tmdb/types';

export default function TVPage() {
  const [popular, setPopular] = useState<TMDBMedia[]>([]);
  const [topRated, setTopRated] = useState<TMDBMedia[]>([]);
  const [onTheAir, setOnTheAir] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [popularRes, topRatedRes, onTheAirRes] = await Promise.all([
          fetch('/api/tmdb/trending?type=tv&timeWindow=week'),
          fetch('/api/tmdb/trending?type=tv&timeWindow=week'),
          fetch('/api/tmdb/trending?type=tv&timeWindow=day'),
        ]);

        const popularData = await popularRes.json();
        const topRatedData = await topRatedRes.json();
        const onTheAirData = await onTheAirRes.json();

        setPopular(popularData.results || []);
        setTopRated(topRatedData.results || []);
        setOnTheAir(onTheAirData.results || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching TV shows:', error);
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">TV Shows</h1>
          
          <ContentRow title="Popular TV Shows" items={popular} />
          <ContentRow title="Top Rated TV Shows" items={topRated} />
          <ContentRow title="Currently On Air" items={onTheAir} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
