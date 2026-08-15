'use client';

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import WatchParty from '@/components/WatchParty';
import { getImageUrl } from '@/lib/tmdb/api';
import { TMDBMedia } from '@/lib/tmdb/types';

interface WatchPartyData {
  id: string;
  name: string;
  hostId: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  currentTime: number;
  isPlaying: boolean;
  createdAt: string;
  members?: { id: string; userId: string }[];
}

export default function WatchPartyRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [party, setParty] = useState<WatchPartyData | null>(null);
  const [media, setMedia] = useState<TMDBMedia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParty() {
      try {
        const res = await fetch(`/api/watch-parties?id=${id}`);
        const data = await res.json();
        setParty(data);

        // Fetch media details
        if (data.tmdbId && data.mediaType) {
          const mediaRes = await fetch(`/api/tmdb/${data.mediaType}/${data.tmdbId}`);
          const mediaData = await mediaRes.json();
          setMedia(mediaData);
        }
      } catch (error) {
        console.error('Error fetching party:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchParty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="animate-pulse text-[#666]">Loading watch party...</div>
      </div>
    );
  }

  if (!party || !media) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Watch party not found</h1>
          <a href="/watch-parties" className="text-[#e50914] hover:underline">
            Back to Watch Parties
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />
      
      <main className="pt-16">
        <WatchParty
          partyId={party.id}
          tmdbId={party.tmdbId}
          mediaType={party.mediaType}
          title={media.title || media.name || 'Unknown'}
          season={1}
          episode={1}
        />
      </main>
    </div>
  );
}
