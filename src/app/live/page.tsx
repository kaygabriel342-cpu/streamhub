'use client';

import { useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HLSPlayer from '@/components/HLSPlayer';
import { WORKING_LIVE_CHANNELS } from '@/lib/livetv/channels';
import type { LiveChannel } from '@/lib/livetv/api';

const categories = ['All', 'Sports', 'Kids', 'News', 'Entertainment', 'Movies', 'Music', 'Documentary'];

export default function LiveTVPage() {
  const [channels] = useState<LiveChannel[]>(WORKING_LIVE_CHANNELS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<LiveChannel>(WORKING_LIVE_CHANNELS[0]);

  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      const matchesCategory = selectedCategory === 'All' || channel.category === selectedCategory;
      const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [channels, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-[1920px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="mb-3 text-4xl font-black text-white md:text-5xl">Live TV</h1>
            <p className="max-w-3xl text-base text-[#b3b3b3] md:text-lg">
              Free, browser-playable live channels. Choose a channel and it starts in the player below.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <section>
              <HLSPlayer src={selectedChannel.streamUrl} title={selectedChannel.name} />

              <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-red-500">Live</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{selectedChannel.name}</h2>
                  <p className="text-sm text-[#00e08a]">{selectedChannel.category}</p>
                  {selectedChannel.currentProgram && (
                    <p className="mt-2 text-[#b3b3b3]">Now playing: {selectedChannel.currentProgram}</p>
                  )}
                </div>

                <div className="rounded-full bg-[#1a1a1a] px-4 py-2 text-sm text-[#b3b3b3]">
                  {filteredChannels.length} channels available
                </div>
              </div>
            </section>

            <aside className="rounded-2xl border border-[#222] bg-[#111] p-4 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto">
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#666]">Channels</h3>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search channels"
                    className="w-full rounded-xl border border-[#333] bg-[#0a0a0a] px-4 py-3 pl-11 text-white placeholder-[#666] outline-none transition-colors focus:border-[#e50914]"
                  />
                  <svg className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#666]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-[#e50914] text-white'
                        : 'bg-[#1f1f1f] text-[#b3b3b3] hover:bg-[#2b2b2b] hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                {filteredChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className={`w-full rounded-xl border p-3 text-left transition-all ${
                      selectedChannel.id === channel.id
                        ? 'border-[#5f2bff] bg-[#1e103d]'
                        : 'border-[#222] bg-[#0c0c0f] hover:border-[#444] hover:bg-[#17171c]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#24242a] text-xs font-black text-white">
                        {channel.logo || channel.name.slice(0, 4).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-bold text-white">{channel.name}</p>
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                        </div>
                        <p className="truncate text-sm text-[#888]">{channel.category}{channel.currentProgram ? ` · ${channel.currentProgram}` : ''}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
