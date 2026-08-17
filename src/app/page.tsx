'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ContentRow from '@/components/ContentRow';
import StartupAnimation from '@/components/StartupAnimation';
import { TMDBMedia } from '@/lib/tmdb/types';

export default function Home() {
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);
  const [trending, setTrending] = useState<TMDBMedia[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<TMDBMedia[]>([]);
  const [trendingTV, setTrendingTV] = useState<TMDBMedia[]>([]);
  const [popularMovies, setPopularMovies] = useState<TMDBMedia[]>([]);
  const [popularTV, setPopularTV] = useState<TMDBMedia[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<TMDBMedia[]>([]);
  const [topRatedTV, setTopRatedTV] = useState<TMDBMedia[]>([]);
  const [newReleases, setNewReleases] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroMedia, setHeroMedia] = useState<TMDBMedia | null>(null);

  useEffect(() => {
    // Check if user has seen animation before
    const seen = localStorage.getItem('seenAnimation');
    if (seen) {
      setShowAnimation(false);
    }

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
        setNewReleases(popularMoviesData.results?.slice(0, 12) || []);

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

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    localStorage.setItem('seenAnimation', 'true');
  };

  if (loading && !showAnimation) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-black text-[#e50914] mb-4 animate-pulse">MARQUEEFLIX</div>
          <div className="text-[#666]">Loading your entertainment...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showAnimation && <StartupAnimation onComplete={handleAnimationComplete} />}
      
      <div className={`min-h-screen bg-[#0a0a0a] transition-opacity duration-1000 ${showAnimation ? 'opacity-0' : 'opacity-100'}`}>
        <Header onSearch={handleSearch} />
        
        <main>
          <Hero items={trending.slice(0, 8)} media={heroMedia || undefined} />

          <div className="-mt-32 relative z-10 space-y-8">
            <ContentRow
              title="TOP 10 Today"
              items={trending.slice(0, 10)}
              viewAllHref="/trending"
            />
            
            <ContentRow
              title="Trending Today"
              items={trendingMovies.slice(0, 14)}
              viewAllHref="/movies"
            />
            
            <ContentRow
              title="Only on Netflix"
              items={popularTV.slice(0, 14)}
              viewAllHref="/tv"
            />
            
            <ContentRow
              title="Top rated"
              items={topRatedMovies.slice(0, 14)}
              viewAllHref="/movies"
            />
            
            <ContentRow
              title="Comedy"
              items={popularMovies.slice(0, 14)}
              viewAllHref="/movies"
            />

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
