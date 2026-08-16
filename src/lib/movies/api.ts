export interface MovieStream {
  url: string;
  quality: string;
  server: string;
  type: 'mp4' | 'm3u8' | 'embed';
}

export interface StreamingSource {
  id: string;
  name: string;
  getUrl: (tmdbId: number, type: 'movie' | 'tv', season?: number, episode?: number) => string;
  quality: string;
  working: boolean;
}

// Multiple streaming sources for movies and TV
// ORDERED BY PRIORITY: Ad-free APIs first, then ad-supported
export const STREAMING_SOURCES: StreamingSource[] = [
  // === AD-FREE APIs (Priority 1) ===
  // VidCore - Completely ad-free, 4K
  {
    id: 'vidcore',
    name: 'VidCore (Ad-Free)',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'movie'
        ? `https://www.vidcore.org/embed/movie/${tmdbId}`
        : `https://www.vidcore.org/embed/tv/${tmdbId}/${season}/${episode}`,
    quality: '4K',
    working: true,
  },
  // VidSrc - No ads, HD quality
  {
    id: 'vidsrc',
    name: 'VidSrc (No Ads)',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'movie'
        ? `https://vidsrc.sbs/embed/movie/${tmdbId}?autoplay=1`
        : `https://vidsrc.sbs/embed/tv/${tmdbId}/${season}/${episode}?autoplay=1`,
    quality: '4K',
    working: true,
  },
  // VidLink - Minimal ads, 4K
  {
    id: 'vidlink',
    name: 'VidLink (4K)',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'movie'
        ? `https://vidlink.pro/movie/${tmdbId}`
        : `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`,
    quality: '4K',
    working: true,
  },
  // Zenith Movies - Ad-free
  {
    id: 'zenith',
    name: 'Zenith Movies (Ad-Free)',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'movie'
        ? `https://api.zenithmovies.xyz/embed/movie/${tmdbId}`
        : `https://api.zenithmovies.xyz/embed/tv/${tmdbId}/${season}/${episode}`,
    quality: '1080p',
    working: true,
  },
  // AniMovie - Anime, minimal ads
  {
    id: 'animovie',
    name: 'AniMovie',
    getUrl: (tmdbId, type) =>
      `https://animovie.vercel.app/embed/movie/${tmdbId}`,
    quality: '1080p',
    working: true,
  },
  // AniWatch - Anime streaming
  {
    id: 'aniwatch',
    name: 'AniWatch',
    getUrl: (tmdbId, type) =>
      `https://aniwatch.to/watch/${tmdbId}`,
    quality: '1080p',
    working: true,
  },
  
  // === AD-SUPPORTED APIs (Priority 2 - Backup) ===
  // 2Embed - Some ads but reliable
  {
    id: '2embed',
    name: '2Embed',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'movie'
        ? `https://www.2embed.online/embed/movie/${tmdbId}`
        : `https://www.2embed.online/embed/tv/${tmdbId}/${season}/${episode}`,
    quality: '1080p',
    working: true,
  },
  // Embed.su - Minimal ads
  {
    id: 'embedsu',
    name: 'Embed.su',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'movie'
        ? `https://embed.su/embed/movie/${tmdbId}`
        : `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`,
    quality: '1080p',
    working: true,
  },
  // SuperEmbed - 1 popup ad
  {
    id: 'superembed',
    name: 'SuperEmbed',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'movie'
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
    quality: '1080p',
    working: true,
  },
  // VidBolt - Some ads
  {
    id: 'vidbolt',
    name: 'VidBolt',
    getUrl: (tmdbId, type, season, episode) =>
      type === 'movie'
        ? `https://vidbolt.xyz/embed/movie/${tmdbId}`
        : `https://vidbolt.xyz/embed/tv/${tmdbId}/${season}/${episode}`,
    quality: '1080p',
    working: true,
  },
  // Watchmode - Source finder
  {
    id: 'watchmode',
    name: 'Watchmode',
    getUrl: (tmdbId, type) =>
      `https://api.watchmode.com/v1/title/${tmdbId}/sources/`,
    quality: '1080p',
    working: true,
  },
];

// Get all available sources for a title
export function getAvailableSources(
  tmdbId: number,
  type: 'movie' | 'tv',
  season?: number,
  episode?: number
): StreamingSource[] {
  return STREAMING_SOURCES.filter(source => source.working);
}

// Get source by ID
export function getSourceById(id: string): StreamingSource | undefined {
  return STREAMING_SOURCES.find(source => source.id === id);
}

// Test if source is working
export async function testSource(source: StreamingSource): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(source.getUrl(123, 'movie'), {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Get quality badge color
export function getQualityColor(quality: string): string {
  switch (quality) {
    case '4K':
      return 'bg-purple-600';
    case '1080p':
      return 'bg-blue-600';
    case '720p':
      return 'bg-green-600';
    default:
      return 'bg-gray-600';
  }
}
