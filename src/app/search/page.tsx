'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import { TMDBMedia } from '@/lib/tmdb/types';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<TMDBMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    async function search() {
      if (!query) {
        setResults([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}`);
        const data = await res.json();
        // Filter to only movies and TV shows
        setResults(data.results?.filter((m: TMDBMedia) => m.media_type === 'movie' || m.media_type === 'tv') || []);
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }

    search();
  }, [query]);

  const handleSearch = (newQuery: string) => {
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(newQuery)}`);
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header onSearch={handleSearch} />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
            {query ? `Search Results for "${query}"` : 'Search'}
          </h1>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse text-[#666]">Searching...</div>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="text-center py-20">
              <svg className="w-20 h-20 text-[#333] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-[#666] text-lg">No results found for "{query}"</p>
              <p className="text-[#444] text-sm mt-2">Try searching for something else</p>
            </div>
          )}

          {!query && (
            <div className="text-center py-20">
              <svg className="w-20 h-20 text-[#333] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-[#666] text-lg">Search for movies and TV shows</p>
              <p className="text-[#444] text-sm mt-2">Use the search bar above to find content</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {results.map((media: TMDBMedia) => (
                <MovieCard key={`${media.id}-${media.media_type}`} media={media} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-pulse text-[#666]">Loading...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
