export interface StreamingSource {
  id: string;
  name: string;
  getUrl: (tmdbId: number, type: 'movie' | 'tv', season?: number, episode?: number) => string;
  quality: string;
  working: boolean;
}

export const STREAMING_SOURCES: StreamingSource[] = [
  {
    id: 'vidking',
    name: 'VidKing',
    getUrl: (tmdbId, type, season = 1, episode = 1) => {
      const params = new URLSearchParams({ color: 'e50914', autoPlay: 'true' });
      if (type === 'tv') {
        params.set('nextEpisode', 'true');
        params.set('episodeSelector', 'true');
        return `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}?${params.toString()}`;
      }
      return `https://www.vidking.net/embed/movie/${tmdbId}?${params.toString()}`;
    },
    quality: '4K',
    working: true,
  },
];

export function getAvailableSources(): StreamingSource[] {
  return STREAMING_SOURCES;
}

export function getSourceById(id: string): StreamingSource | undefined {
  return STREAMING_SOURCES.find((source) => source.id === id);
}

export function getQualityColor(quality: string): string {
  return quality === '4K' ? 'bg-purple-600' : 'bg-blue-600';
}
