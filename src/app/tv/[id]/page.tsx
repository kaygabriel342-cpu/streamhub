'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContentRow from '@/components/ContentRow';
import ProviderBadges from '@/components/ProviderBadges';
import { getBackdropUrl, getImageUrl } from '@/lib/tmdb/api';
import { TMDBTVDetails, TMDBMedia, TMDBEpisode } from '@/lib/tmdb/types';

export default function TVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [show, setShow] = useState<TMDBTVDetails | null>(null);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<TMDBEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingParty, setCreatingParty] = useState(false);

  useEffect(() => {
    async function fetchShow() {
      try {
        const res = await fetch(`/api/tmdb/tv/${id}`);
        const data = await res.json();
        setShow(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching TV show:', error);
        setLoading(false);
      }
    }

    fetchShow();
  }, [id]);

  useEffect(() => {
    async function fetchEpisodes() {
      if (!show) return;
      try {
        const res = await fetch(`/api/tmdb/tv/${id}/season/${selectedSeason}`);
        const data = await res.json();
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      }
    }

    fetchEpisodes();
  }, [show, id, selectedSeason]);

  const handleCreateWatchParty = async () => {
    if (!show) return;
    
    setCreatingParty(true);
    try {
      const res = await fetch('/api/watch-parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${show.name} Watch Party`,
          hostId: 'anonymous-user',
          tmdbId: show.id,
          mediaType: 'tv',
        }),
      });
      
      const party = await res.json();
      router.push(`/watch-party/${party.id}`);
    } catch (error) {
      console.error('Error creating watch party:', error);
    } finally {
      setCreatingParty(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-pulse text-[#666]">Loading...</div>
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">TV Show not found</h1>
          <Link href="/" className="text-[#e50914] hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const year = show.first_air_date?.split('-')[0] || 'N/A';
  const seasons = show.seasons?.filter((s) => s.season_number > 0) || [];

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />
      
      <main>
        {/* Hero Backdrop */}
        <section className="relative h-[50vh] md:h-[70vh]">
          {show.backdrop_path ? (
            <Image
              src={getBackdropUrl(show.backdrop_path, 'w1280')}
              alt={show.name}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#1a1a1a] to-[#2a2a2a]" />
          )}
          <div className="absolute inset-0 gradient-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent" />
        </section>

        {/* Content */}
        <div className="relative -mt-32 md:-mt-48 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-48 md:w-64 aspect-[2/3] rounded-lg overflow-hidden bg-[#1f1f1f] shadow-2xl">
                {show.poster_path ? (
                  <Image
                    src={getImageUrl(show.poster_path, 'w500')}
                    alt={show.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 192px, 256px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
                    <svg className="w-16 h-16 text-[#444]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-4 md:pt-0">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">{show.name}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="rating-badge">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-medium">{show.vote_average?.toFixed(1)}</span>
                </div>
                <span className="text-[#b3b3b3]">{year}</span>
                <span className="text-[#b3b3b3]">{show.number_of_seasons} Seasons</span>
                <span className="bg-[#e50914] text-white text-sm px-3 py-1 rounded">TV Series</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {show.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-[#333] text-white text-sm rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Tagline */}
              {show.tagline && (
                <p className="text-xl text-[#b3b3b3] italic mb-6">{show.tagline}</p>
              )}

              {/* Overview */}
              <p className="text-[#b3b3b3] text-base md:text-lg mb-8 max-w-3xl">
                {show.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={handleCreateWatchParty}
                  disabled={creatingParty}
                  className="flex items-center gap-2 px-6 py-3 bg-[#e50914] hover:bg-[#f40612] disabled:bg-[#666] text-white font-semibold rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                  </svg>
                  {creatingParty ? 'Creating...' : 'Start Watch Party'}
                </button>
                <Link
                  href="/"
                  className="flex items-center gap-2 px-6 py-3 bg-[#333] hover:bg-[#444] text-white font-semibold rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </Link>
              </div>

              {/* Providers */}
              {show.watch_providers && (
                <ProviderBadges providers={show.watch_providers.results} country="US" />
              )}
            </div>
          </div>

          {/* Seasons */}
          {seasons.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-4">Episodes</h2>
              
              {/* Season Selector */}
              <div className="season-selector mb-6">
                {seasons.map((season) => (
                  <button
                    key={season.id}
                    onClick={() => setSelectedSeason(season.season_number)}
                    className={selectedSeason === season.season_number ? 'active' : ''}
                  >
                    Season {season.season_number}
                  </button>
                ))}
              </div>

              {/* Episodes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {episodes.map((episode) => (
                  <div
                    key={episode.id}
                    className="flex gap-4 bg-[#1f1f1f] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                  >
                    <div className="w-32 flex-shrink-0 aspect-video bg-[#141414] relative">
                      {episode.still_path ? (
                        <Image
                          src={getImageUrl(episode.still_path, 'w342')}
                          alt={episode.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 text-[#444]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 py-3 pr-3">
                      <p className="text-[#666] text-sm">S{episode.season_number}:E{episode.episode_number}</p>
                      <h3 className="text-white font-medium truncate">{episode.name}</h3>
                      <p className="text-[#666] text-sm line-clamp-2 mt-1">{episode.overview || 'No overview available'}</p>
                      <p className="text-[#444] text-xs mt-2">{episode.runtime} min</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cast */}
          {show.credits?.cast && show.credits.cast.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {show.credits.cast.slice(0, 12).map((actor) => (
                  <div key={actor.id} className="text-center">
                    <div className="w-full aspect-square rounded-full overflow-hidden bg-[#1f1f1f] mb-3">
                      {actor.profile_path ? (
                        <Image
                          src={getImageUrl(actor.profile_path, 'w185')}
                          alt={actor.name}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#2a2a2a]">
                          <svg className="w-12 h-12 text-[#444]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <p className="text-white font-medium text-sm truncate">{actor.name}</p>
                    <p className="text-[#666] text-xs truncate">{actor.character}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Similar Shows */}
          {show.similar && show.similar.length > 0 && (
            <ContentRow
              title="Similar TV Shows"
              items={show.similar}
            />
          )}

          {/* Recommendations */}
          {show.recommendations && show.recommendations.length > 0 && (
            <ContentRow
              title="You May Also Like"
              items={show.recommendations}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
