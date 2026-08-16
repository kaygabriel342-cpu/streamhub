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
  const [newReleases, setNewReleases] = useState<TMDBMedia[]>([]);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-[#e50914] mb-4 animate-pulse">MARQUEEFLIX</div>
          <div className="text-[#666]">Loading your entertainment...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header onSearch={handleSearch} />
      
      <main>
        {heroMedia && <Hero media={heroMedia} />}

        <div className="-mt-32 relative z-10 space-y-8">
          <ContentRow
            title="Trending Now"
            items={trending.slice(0, 14)}
            viewAllHref="/trending"
          />
          
          <ContentRow
            title="New Releases"
            items={newReleases}
            viewAllHref="/movies/new"
          />
          
          <ContentRow
            title="Popular Movies"
            items={popularMovies.slice(0, 14)}
            viewAllHref="/movies/popular"
          />
          
          <ContentRow
            title="Popular TV Shows"
            items={popularTV.slice(0, 14)}
            viewAllHref="/tv/popular"
          />
          
          <ContentRow
            title="Top Rated Movies"
            items={topRatedMovies.slice(0, 14)}
            viewAllHref="/movies/top-rated"
          />
          
          <ContentRow
            title="Top Rated TV Shows"
            items={topRatedTV.slice(0, 14)}
            viewAllHref="/tv/top-rated"
          />

          <ContentRow
            title="Watch Parties"
            items={trending.slice(6, 14)}
            viewAllHref="/watch-parties"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
