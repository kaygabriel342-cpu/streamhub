'use client';

import { useEffect, useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MovieCard from '@/components/MovieCard';
import { getLogoUrl } from '@/lib/tmdb/api';
import type { TMDBMedia } from '@/lib/tmdb/types';

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
}

export default function ProvidersPage() {
  const [type, setType] = useState<'movie' | 'tv'>('movie');
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [items, setItems] = useState<TMDBMedia[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function loadProviders() {
      setLoadingProviders(true);
      try {
        const response = await fetch(`/api/tmdb/providers?type=${type}`);
        const data = await response.json();
        const sorted = (data.results || [])
          .sort((a: Provider, b: Provider) => a.display_priority - b.display_priority)
          .slice(0, 60);
        setProviders(sorted);
        setSelectedProvider(sorted[0] || null);
      } catch (error) {
        console.error('Failed to load providers:', error);
        setProviders([]);
      } finally {
        setLoadingProviders(false);
      }
    }

    loadProviders();
  }, [type]);

  useEffect(() => {
    async function loadProviderContent() {
      if (!selectedProvider) return;
      setLoadingItems(true);
      try {
        const response = await fetch(
          `/api/tmdb/discover/provider?type=${type}&providerId=${selectedProvider.provider_id}`
        );
        const data = await response.json();
        setItems((data.results || []).map((item: TMDBMedia) => ({ ...item, media_type: type })));
      } catch (error) {
        console.error('Failed to load provider content:', error);
        setItems([]);
      } finally {
        setLoadingItems(false);
      }
    }

    loadProviderContent();
  }, [selectedProvider, type]);

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => provider.provider_name.toLowerCase().includes(query.toLowerCase()));
  }, [providers, query]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-[1920px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.35em] text-[#e50914]">Watch Providers</p>
            <h1 className="mb-3 text-4xl font-black text-white md:text-5xl">Browse by provider</h1>
            <p className="max-w-3xl text-[#b3b3b3]">
              Pick a streaming provider and explore movies or shows available through that provider in the US watch region.
            </p>
          </div>

          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex rounded-full bg-[#151515] p-1">
              <button
                onClick={() => setType('movie')}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${type === 'movie' ? 'bg-[#e50914] text-white' : 'text-[#b3b3b3] hover:text-white'}`}
              >
                Movies
              </button>
              <button
                onClick={() => setType('tv')}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-colors ${type === 'tv' ? 'bg-[#e50914] text-white' : 'text-[#b3b3b3] hover:text-white'}`}
              >
                TV Shows
              </button>
            </div>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search providers"
              className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3 text-white outline-none focus:border-[#e50914] md:w-80"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="rounded-2xl border border-[#222] bg-[#111] p-4 lg:max-h-[calc(100vh-10rem)] lg:overflow-y-auto">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#666]">Providers</h2>
              {loadingProviders ? (
                <div className="py-8 text-center text-[#666]">Loading providers...</div>
              ) : (
                <div className="space-y-2">
                  {filteredProviders.map((provider) => (
                    <button
                      key={provider.provider_id}
                      onClick={() => setSelectedProvider(provider)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                        selectedProvider?.provider_id === provider.provider_id
                          ? 'border-[#e50914] bg-[#e50914]/10'
                          : 'border-[#222] bg-[#0c0c0f] hover:border-[#444] hover:bg-[#181818]'
                      }`}
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white">
                        {provider.logo_path ? (
                          <img src={getLogoUrl(provider.logo_path)} alt={provider.provider_name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-black">
                            {provider.provider_name.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-white">{provider.provider_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </aside>

            <section>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {selectedProvider ? `${selectedProvider.provider_name} ${type === 'movie' ? 'movies' : 'shows'}` : 'Select a provider'}
                </h2>
                {loadingItems && <span className="text-sm text-[#666]">Loading content...</span>}
              </div>

              {items.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
                  {items.map((item) => (
                    <MovieCard key={`${type}-${item.id}`} media={item} />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-[#222] bg-[#111] p-10 text-center text-[#666]">
                  {loadingItems ? 'Finding content...' : 'No content found for this provider.'}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
