'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { getTrendingAnimeAniList, getTopAnimeAniList, getSeasonalAnime, searchAnimeAniList } from '@/lib/anime/api';
import { Anime } from '@/lib/anime/types';

export default function AnimePage() {
  const [trending, setTrending] = useState<Anime[]>([]);
  const [topRated, setTopRated] = useState<Anime[]>([]);
  const [seasonal, setSeasonal] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnime() {
      try {
        const [trendingData, topData, seasonalData] = await Promise.all([
          getTrendingAnimeAniList(),
          getTopAnimeAniList(),
          getSeasonalAnime('current'),
        ]);

        setTrending(trendingData);
        setTopRated(topData);
        setSeasonal(seasonalData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime:', error);
        setLoading(false);
      }
    }

    fetchAnime();
  }, []);

  const getAnimeTitle = (anime: Anime) => {
    return anime.title?.english || anime.title?.romaji || anime.title?.native || 'Unknown';
  };

  const getAnimeImage = (anime: Anime) => {
    return anime.coverImage?.large || anime.coverImage?.medium || '/placeholder-anime.jpg';
  };

  const getAnimeScore = (anime: Anime) => {
    return anime.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-black text-[#e50914] mb-4 animate-pulse">MARQUEEFLIX</div>
          <div className="text-[#666]">Loading anime...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Anime
            </h1>
            <p className="text-[#b3b3b3] text-lg">
              Stream the latest anime series and movies in HD
            </p>
          </div>

          {/* Trending Anime */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Trending Now</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {trending.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a] card-hover"
                >
                  <Image
                    src={getAnimeImage(anime)}
                    alt={getAnimeTitle(anime)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  
                  {/* Score Badge */}
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white text-xs font-bold">{getAnimeScore(anime)}</span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-sm font-medium line-clamp-2">{getAnimeTitle(anime)}</p>
                    <p className="text-[#b3b3b3] text-xs mt-1">{anime.format}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Top Rated Anime */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Top Rated</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {topRated.slice(0, 12).map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a] card-hover"
                >
                  <Image
                    src={getAnimeImage(anime)}
                    alt={getAnimeTitle(anime)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-white text-xs font-bold">{getAnimeScore(anime)}</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-sm font-medium line-clamp-2">{getAnimeTitle(anime)}</p>
                    <p className="text-[#b3b3b3] text-xs mt-1">{anime.format}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Seasonal Anime */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">This Season</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {seasonal.map((anime) => (
                <Link
                  key={anime.id}
                  href={`/anime/${anime.id}`}
                  className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-[#1a1a1a] card-hover"
                >
                  <Image
                    src={getAnimeImage(anime)}
                    alt={getAnimeTitle(anime)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  
                  {anime.seasonYear && (
                    <div className="absolute top-2 right-2 bg-[#e50914] px-2 py-1 rounded text-white text-xs font-bold">
                      {anime.seasonYear}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                    <p className="text-white text-sm font-medium line-clamp-2">{getAnimeTitle(anime)}</p>
                    <p className="text-[#b3b3b3] text-xs mt-1">{anime.format}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
