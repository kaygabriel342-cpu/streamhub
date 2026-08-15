'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getImageUrl } from '@/lib/tmdb/api';
import { TMDBMedia } from '@/lib/tmdb/types';

interface WatchParty {
  id: string;
  name: string;
  hostId: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  currentTime: number;
  isPlaying: boolean;
  createdAt: string;
  members?: { id: string; userId: string }[];
  media?: TMDBMedia;
}

export default function WatchPartiesPage() {
  const router = useRouter();
  const [parties, setParties] = useState<WatchParty[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingParty, setCreatingParty] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [partyName, setPartyName] = useState('');
  const [partyTmdbId, setPartyTmdbId] = useState('');
  const [partyMediaType, setPartyMediaType] = useState<'movie' | 'tv'>('movie');

  useEffect(() => {
    async function fetchParties() {
      try {
        const res = await fetch('/api/watch-parties');
        const data = await res.json();
        setParties(data);
        
        // Fetch media details for each party
        const partiesWithMedia = await Promise.all(
          data.map(async (party: WatchParty) => {
            try {
              const mediaRes = await fetch(`/api/tmdb/${party.mediaType}/${party.tmdbId}`);
              const media = await mediaRes.json();
              return { ...party, media };
            } catch {
              return party;
            }
          })
        );
        
        setParties(partiesWithMedia);
      } catch (error) {
        console.error('Error fetching parties:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchParties();
  }, []);

  const handleCreateParty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partyName.trim() || !partyTmdbId) return;

    setCreatingParty(true);
    try {
      const res = await fetch('/api/watch-parties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: partyName.trim(),
          hostId: 'anonymous-user',
          tmdbId: parseInt(partyTmdbId),
          mediaType: partyMediaType,
        }),
      });

      const party = await res.json();
      router.push(`/watch-party/${party.id}`);
    } catch (error) {
      console.error('Error creating party:', error);
    } finally {
      setCreatingParty(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Watch Parties</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#e50914] hover:bg-[#f40612] text-white font-semibold rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Party
            </button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-pulse text-[#666]">Loading parties...</div>
            </div>
          )}

          {!loading && parties.length === 0 && (
            <div className="text-center py-20">
              <svg className="w-20 h-20 text-[#333] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-[#666] text-lg">No watch parties yet</p>
              <p className="text-[#444] text-sm mt-2">Create one to start watching with friends!</p>
            </div>
          )}

          {!loading && parties.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parties.map((party) => (
                <Link
                  key={party.id}
                  href={`/watch-party/${party.id}`}
                  className="bg-[#1f1f1f] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition-colors group"
                >
                  <div className="aspect-video relative bg-[#141414]">
                    {party.media?.backdrop_path ? (
                      <Image
                        src={getImageUrl(party.media.backdrop_path, 'w780')}
                        alt={party.media.title || party.media.name || ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : party.media?.poster_path ? (
                      <Image
                        src={getImageUrl(party.media.poster_path, 'w500')}
                        alt={party.media.title || party.media.name || ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-[#444]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Live Indicator */}
                    {party.isPlaying && (
                      <div className="absolute top-2 right-2 bg-[#e50914] text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        Live
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-medium truncate group-hover:text-[#e50914] transition-colors">
                      {party.name}
                    </h3>
                    <p className="text-[#666] text-sm mt-1">
                      {party.media?.title || party.media?.name || 'Unknown'}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 text-[#666] text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        {party.members?.length || 0} watching
                      </div>
                      <span className="text-[#444] text-xs">
                        {party.mediaType === 'movie' ? 'Movie' : 'TV Show'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Party Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1f1f1f] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Create Watch Party</h2>
            <form onSubmit={handleCreateParty}>
              <div className="mb-4">
                <label className="block text-[#666] text-sm mb-2">Party Name</label>
                <input
                  type="text"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  placeholder="My Awesome Watch Party"
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#e50914]"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-[#666] text-sm mb-2">Media Type</label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPartyMediaType('movie')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      partyMediaType === 'movie'
                        ? 'bg-[#e50914] text-white'
                        : 'bg-[#2a2a2a] text-[#666] hover:bg-[#333]'
                    }`}
                  >
                    Movie
                  </button>
                  <button
                    type="button"
                    onClick={() => setPartyMediaType('tv')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      partyMediaType === 'tv'
                        ? 'bg-[#e50914] text-white'
                        : 'bg-[#2a2a2a] text-[#666] hover:bg-[#333]'
                    }`}
                  >
                    TV Show
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-[#666] text-sm mb-2">TMDB ID</label>
                <input
                  type="number"
                  value={partyTmdbId}
                  onChange={(e) => setPartyTmdbId(e.target.value)}
                  placeholder="Enter TMDB ID (e.g., 550 for Fight Club)"
                  className="w-full px-4 py-2 bg-[#2a2a2a] border border-[#333] rounded-lg text-white placeholder-[#666] focus:outline-none focus:border-[#e50914]"
                  required
                />
                <p className="text-[#444] text-xs mt-2">
                  Find the TMDB ID on themoviedb.org
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 bg-[#333] hover:bg-[#444] text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingParty}
                  className="flex-1 py-2 bg-[#e50914] hover:bg-[#f40612] disabled:bg-[#666] text-white rounded-lg transition-colors"
                >
                  {creatingParty ? 'Creating...' : 'Create Party'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
