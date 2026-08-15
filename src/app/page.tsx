'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import { TMDBMedia } from '@/lib/tmdb/types';

export default function Home() {
  const router = useRouter();
  const [trending, setTrending] = useState<TMDBMedia[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<TMDBMedia[]>([]);
  const [trendingTV, setTrendingTV] = useState<TMDBMedia[]>([]);
  const [popularMovies, setPopularMovies] = useState<TMDBMedia[]>([]);
  const [popularTV, setPopularTV] = useState<TMDBMedia[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<TMDBMedia[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroMedia, setHeroMedia] = useState<TMDBMedia | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [
          trendingRes,
          trendingMoviesRes,
          trendingTVRes,
          popularMoviesRes,
          popularTVRes,
          topRatedMoviesRes,
          topRatedTVRes,
        ] = await Promise.all([
          fetch('/api/tmdb/trending?type=all&timeWindow=week'),
          fetch('/api/tmdb/trending?type=movie&timeWindow=week'),
          fetch('/api/tmdb/trending?type=tv&timeWindow=week'),
          fetch('/api/tmdb/trending?type=movie&timeWindow=day'),
          fetch('/api/tmdb/trending?type=tv&timeWindow=day'),
          fetch('/api/tmdb/trending?type=movie&timeWindow=week'),
          fetch('/api/tmdb/trending?type=tv&timeWindow=week'),
        ]);

        const trendingData = await trendingRes.json();
        const trendingMoviesData = await trendingMoviesRes.json();
        const trendingTVData = await trendingTVRes.json();
        const popularMoviesData = await popularMoviesRes.json();
        const popularTVData = await popularTVRes.json();
        const topRatedMoviesData = await topRatedMoviesRes.json();
        const topRatedTVData = await topRatedTVRes.json();

        setTrending(trendingData.results?.filter((m: TMDBMedia) => m.media_type === 'movie' || m.media_type === 'tv') || []);
        setTrendingMovies(trendingMoviesData.results || []);
        setTrendingTV(trendingTVData.results || []);
        setPopularMovies(popularMoviesData.results || []);
        setPopularTV(popularTVData.results || []);
        setTopRatedMovies(topRatedMoviesData.results || []);
        setTopRatedTV(topRatedTVData.results || []);

        // Set hero media from trending
        if (trendingData.results && trendingData.results.length > 0) {
          const hero = trendingData.results.find((m: TMDBMedia) => m.backdrop_path) || trendingData.results[0];
          setHeroMedia(hero);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-[#e50914] mb-4">StreamHub</div>
          <div className="animate-pulse text-[#666]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header onSearch={handleSearch} />
      
      <main>
        {/* Hero Section */}
        {heroMedia && <Hero media={heroMedia} />}

        {/* Content Rows */}
        <div className="-mt-20 relative z-10">
          <ContentRow
            title="Trending Now"
            items={trending.slice(0, 12)}
            viewAllHref="/trending"
          />
          
          <ContentRow
            title="Popular Movies"
            items={popularMovies.slice(0, 12)}
            viewAllHref="/movies/popular"
          />
          
          <ContentRow
            title="Popular TV Shows"
            items={popularTV.slice(0, 12)}
            viewAllHref="/tv/popular"
          />
          
          <ContentRow
            title="Top Rated Movies"
            items={topRatedMovies.slice(0, 12)}
            viewAllHref="/movies/top-rated"
          />
          
          <ContentRow
            title="Top Rated TV Shows"
            items={topRatedTV.slice(0, 12)}
            viewAllHref="/tv/top-rated"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
