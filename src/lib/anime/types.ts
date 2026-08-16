export interface Anime {
  id: number | string;
  title: {
    romaji?: string;
    english?: string;
    native?: string;
  };
  title_romaji?: string;
  title_english?: string;
  title_native?: string;
  description?: string;
  coverImage?: {
    large?: string;
    medium?: string;
  };
  bannerImage?: string;
  genres?: string[];
  status?: string;
  episodes?: number;
  duration?: number;
  season?: string;
  seasonYear?: number;
  averageScore?: number;
  popularity?: number;
  format?: string;
  type?: string;
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  endDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  trailer?: {
    id?: string;
    site?: string;
  };
  relations?: {
    edges?: Array<{
      relationType?: string;
      node?: {
        id?: number;
        title?: {
          romaji?: string;
          english?: string;
        };
      };
    }>;
  };
}

export interface AnimeEpisode {
  id: string;
  number: number;
  title: string;
  image?: string;
  description?: string;
  airDate?: string;
  duration?: number;
}

export interface AnimeSearchResponse {
  data?: {
    Page?: {
      media?: Anime[];
    };
  } | Anime[];
  results?: Anime[];
  pagination?: {
    currentPage?: number;
    lastPage?: number;
    hasNextPage?: boolean;
  };
}

export interface AnimeStream {
  url: string;
  quality?: string;
  isM3U8?: boolean;
  headers?: { [key: string]: string };
}

export interface AnimeSource {
  headers?: { [key: string]: string };
  sources: AnimeStream[];
  download?: string;
  subtitles?: Array<{
    url: string;
    lang: string;
  }>;
}
