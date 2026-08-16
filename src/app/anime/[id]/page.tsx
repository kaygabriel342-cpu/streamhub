'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getAnimeDetailsAniList, searchAnimeGogoAnime } from '@/lib/anime/api';
import type { Anime } from '@/lib/anime/types';

export default function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [gogoResults, setGogoResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnime() {
      try {
        const details = await getAnimeDetailsAniList(Number(id));
        setAnime(details);
        const title = details?.title?.english || details?.title?.romaji || '';
        if (title) {
          const results = await searchAnimeGogoAnime(title);
          setGogoResults(results.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to load anime:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAnime();
  }, [id]);

  const title = anime?.title?.english || anime?.title?.romaji || anime?.title?.native || 'Anime';
  const poster = anime?.coverImage?.large || anime?.coverImage?.medium || '/placeholder-anime.jpg';
  const banner = anime?.bannerImage || poster;
  const score = anime?.averageScore ? (anime.averageScore / 10).toFixed(1) : 'N/A';
  const cleanDescription = anime?.description?.replace(/<[^>]+>/g, '') || 'No description available.';

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#e50914] border-t-transparent" />
          <p className="text-[#b3b3b3]">Loading anime...</p>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-[#0a0a0a]">
        <Header />
        <main className="flex min-h-screen items-center justify-center px-4 pt-20">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-white">Anime not found</h1>
            <Link href="/anime" className="text-[#e50914] hover:text-white">Back to Anime</Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <main>
        <section className="relative min-h-[70vh] pt-24">
          <div className="absolute inset-0">
            <Image src={banner} alt={title} fill className="object-cover opacity-35" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/85 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
          </div>

          <div className="relative mx-auto flex max-w-[1600px] flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8">
            <div className="relative aspect-[2/3] w-52 flex-shrink-0 overflow-hidden rounded-2xl bg-[#1a1a1a] shadow-2xl md:w-64">
              <Image src={poster} alt={title} fill className="object-cover" sizes="256px" />
            </div>

            <div className="max-w-4xl pt-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {anime.format && <span className="rounded-full bg-[#e50914] px-3 py-1 text-xs font-bold text-white">{anime.format}</span>}
                {anime.status && <span className="rounded-full bg-[#222] px-3 py-1 text-xs font-bold text-[#b3b3b3]">{anime.status}</span>}
              </div>

              <h1 className="mb-4 text-4xl font-black text-white md:text-6xl">{title}</h1>

              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-[#b3b3b3]">
                <span className="font-bold text-yellow-500">Rating {score}</span>
                {anime.episodes && <span>{anime.episodes} episodes</span>}
                {anime.duration && <span>{anime.duration} min</span>}
                {anime.seasonYear && <span>{anime.seasonYear}</span>}
              </div>

              <p className="mb-6 max-w-3xl text-base leading-7 text-[#d0d0d0] md:text-lg">{cleanDescription}</p>

              <div className="mb-8 flex flex-wrap gap-2">
                {anime.genres?.map((genre) => (
                  <span key={genre} className="rounded-full border border-[#333] bg-[#111] px-3 py-1 text-sm text-[#b3b3b3]">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://aniwatch.to/search?keyword=${encodeURIComponent(title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-[#e50914] px-8 py-4 font-bold text-white shadow-lg shadow-[#e50914]/30 transition-all hover:scale-105 hover:bg-[#f40612]"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Watch on AniWatch
                </a>
                <a
                  href={`https://anitaku.to/search.html?keyword=${encodeURIComponent(title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-[#333] bg-[#1a1a1a] px-8 py-4 font-bold text-white transition-colors hover:bg-[#2a2a2a]"
                >
                  Find on GogoAnime
                </a>
              </div>
            </div>
          </div>
        </section>

        {gogoResults.length > 0 && (
          <section className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-6 lg:px-8">
            <h2 className="mb-5 text-2xl font-bold text-white">Matching streaming results</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {gogoResults.map((result) => (
                <a
                  key={result.id}
                  href={`https://anitaku.to/category/${result.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-2xl border border-[#222] bg-[#111] p-4 transition-colors hover:border-[#e50914] hover:bg-[#181818]"
                >
                  <h3 className="font-bold text-white">{result.title}</h3>
                  <p className="mt-2 text-sm text-[#888]">Open episodes and sources</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
