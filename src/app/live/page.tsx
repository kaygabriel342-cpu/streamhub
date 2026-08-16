'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { SAMPLE_CHANNELS, FREE_M3U_PLAYLISTS, LiveChannel } from '@/lib/livetv/api';

const categories = ['All', 'Sports', 'Kids', 'News', 'Entertainment', 'Movies', 'Music', 'Documentary'];

export default function LiveTVPage() {
  const [channels, setChannels] = useState<LiveChannel[]>(SAMPLE_CHANNELS);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredChannels = channels.filter((channel) => {
    const matchesCategory = selectedCategory === 'All' || channel.category === selectedCategory;
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const loadM3UPlaylist = async (url: string) => {
    setLoading(true);
    try {
      // In production, you'd fetch this from your backend to avoid CORS
      const response = await fetch(`/api/livetv/m3u?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      if (data.channels) {
        setChannels(data.channels);
      }
    } catch (error) {
      console.error('Error loading M3U:', error);
      setChannels(SAMPLE_CHANNELS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Live TV
            </h1>
            <p className="text-[#b3b3b3] text-lg">
              Watch live channels - Sports, Kids, News, Entertainment and more
            </p>
          </div>

          {/* M3U Playlist Import */}
          <div className="mb-8 p-6 bg-[#1a1a1a] rounded-xl border border-[#222]">
            <h3 className="text-white font-semibold mb-4">Load M3U Playlist</h3>
            <div className="flex flex-wrap gap-3">
              {FREE_M3U_PLAYLISTS.map((playlist) => (
                <button
                  key={playlist.url}
                  onClick={() => loadM3UPlaylist(playlist.url)}
                  className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white text-sm rounded-lg transition-colors border border-[#333]"
                >
                  {playlist.name}
                </button>
              ))}
            </div>
            <p className="text-[#666] text-sm mt-4">
              Supports M3U/M3U8 playlists and Xtream Codes API
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#e50914] text-white'
                    : 'bg-[#1a1a1a] text-[#b3b3b3] hover:bg-[#2a2a2a] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search channels..."
                className="w-full px-4 py-3 pl-12 bg-[#1a1a1a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#e50914] transition-colors"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[#666]">Loading channels...</p>
            </div>
          )}

          {/* Channels Grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {filteredChannels.map((channel) => (
                <Link
                  key={channel.id}
                  href={`/live/${channel.id}`}
                  className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden hover:bg-[#2a2a2a] transition-all hover:scale-105"
                >
                  {/* Channel Logo */}
                  <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center p-6">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-2 rounded-lg bg-white flex items-center justify-center overflow-hidden">
                          <span className="text-xs font-bold text-gray-800 px-2 text-center">{channel.name}</span>
                        </div>
                        <p className="text-white font-semibold">{channel.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Live Indicator */}
                  {channel.isLive && (
                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-full">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      <span className="text-white text-xs font-bold">LIVE</span>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-[#0a0a0a]/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-white text-xs font-medium">{channel.category}</span>
                  </div>

                  {/* Program Info */}
                  <div className="p-4">
                    {channel.currentProgram && (
                      <div className="mb-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-[#e50914] text-sm font-medium">Now Playing</span>
                        </div>
                        <p className="text-white font-medium truncate">{channel.currentProgram}</p>
                      </div>
                    )}
                    {channel.nextProgram && (
                      <div className="text-[#666] text-sm">
                        <span>Next: </span>
                        <span className="text-[#999]">{channel.nextProgram}</span>
                      </div>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredChannels.length === 0 && (
            <div className="text-center py-20">
              <svg className="w-20 h-20 text-[#333] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-[#666] text-lg">No channels found</p>
              <p className="text-[#444] text-sm mt-2">Try a different category or search term</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
