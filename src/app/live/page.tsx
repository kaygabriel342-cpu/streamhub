'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

interface LiveChannel {
  id: string;
  name: string;
  logo: string;
  category: string;
  streamUrl: string;
  currentProgram?: string;
  nextProgram?: string;
  isLive: boolean;
}

const channels: LiveChannel[] = [
  {
    id: 'espn',
    name: 'ESPN',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/ESPN_wordmark.svg/1200px-ESPN_wordmark.svg.png',
    category: 'Sports',
    streamUrl: 'https://example.com/espn',
    currentProgram: 'SportsCenter',
    nextProgram: 'NBA Live',
    isLive: true,
  },
  {
    id: 'nickelodeon',
    name: 'Nickelodeon',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Nickelodeon_2009_logo.svg/1200px-Nickelodeon_2009_logo.svg.png',
    category: 'Kids',
    streamUrl: 'https://example.com/nick',
    currentProgram: 'SpongeBob SquarePants',
    nextProgram: 'The Loud House',
    isLive: true,
  },
  {
    id: 'nickjr',
    name: 'Nick Jr.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Nick_Jr._logo_2009.svg/1200px-Nick_Jr._logo_2009.svg.png',
    category: 'Kids',
    streamUrl: 'https://example.com/nickjr',
    currentProgram: 'PAW Patrol',
    nextProgram: 'Blue\'s Clues',
    isLive: true,
  },
  {
    id: 'cn',
    name: 'Cartoon Network',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Cartoon_Network_2010_logo.svg/1200px-Cartoon_Network_2010_logo.svg.png',
    category: 'Kids',
    streamUrl: 'https://example.com/cn',
    currentProgram: 'Adventure Time',
    nextProgram: 'Regular Show',
    isLive: true,
  },
  {
    id: 'disney',
    name: 'Disney Channel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Disney_Channel_2019.svg/1200px-Disney_Channel_2019.svg.png',
    category: 'Kids',
    streamUrl: 'https://example.com/disney',
    currentProgram: 'Phineas and Ferb',
    nextProgram: 'Gravity Falls',
    isLive: true,
  },
  {
    id: 'fox-sports',
    name: 'FOX Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Fox_Sports_2019.svg/1200px-Fox_Sports_2019.svg.png',
    category: 'Sports',
    streamUrl: 'https://example.com/foxsports',
    currentProgram: 'NFL Live',
    nextProgram: 'MLB Tonight',
    isLive: true,
  },
  {
    id: 'sky-sports',
    name: 'Sky Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Sky_Sports_2020_logo.svg/1200px-Sky_Sports_2020_logo.svg.png',
    category: 'Sports',
    streamUrl: 'https://example.com/skysports',
    currentProgram: 'Premier League Live',
    nextProgram: 'Cricket',
    isLive: true,
  },
  {
    id: 'bbc-news',
    name: 'BBC News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/BBC_News_2022_%28Alt%29.svg/1200px-BBC_News_2022_%28Alt%29.svg.png',
    category: 'News',
    streamUrl: 'https://example.com/bbcnews',
    currentProgram: 'BBC News at Ten',
    nextProgram: 'Newsnight',
    isLive: true,
  },
  {
    id: 'cnn',
    name: 'CNN',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/CNN_International_logo.svg/1200px-CNN_International_logo.svg.png',
    category: 'News',
    streamUrl: 'https://example.com/cnn',
    currentProgram: 'CNN Newsroom',
    nextProgram: 'Anderson Cooper',
    isLive: true,
  },
  {
    id: 'mtv',
    name: 'MTV',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/MTV_2021.svg/1200px-MTV_2021.svg.png',
    category: 'Entertainment',
    streamUrl: 'https://example.com/mtv',
    currentProgram: 'MTV Unplugged',
    nextProgram: 'Total Request Live',
    isLive: true,
  },
];

const categories = ['All', 'Sports', 'Kids', 'News', 'Entertainment', 'Movies'];

export default function LiveTVPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChannels = channels.filter((channel) => {
    const matchesCategory = selectedCategory === 'All' || channel.category === selectedCategory;
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              Watch your favorite channels live - Sports, Kids, News, and more
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

          {/* Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                        <span className="text-xs font-bold text-gray-800">{channel.name}</span>
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
                  <div className="mb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-[#e50914] text-sm font-medium">Now Playing</span>
                    </div>
                    <p className="text-white font-medium truncate">{channel.currentProgram}</p>
                  </div>
                  <div className="text-[#666] text-sm">
                    <span>Next: </span>
                    <span className="text-[#999]">{channel.nextProgram}</span>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          {/* No Results */}
          {filteredChannels.length === 0 && (
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
