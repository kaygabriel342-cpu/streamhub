import {
  TMDBMedia,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBSearchResponse,
  TMDBTrendingResponse,
  TMDBGenresResponse,
  TMDBGenre,
  TMDBEpisode,
} from './types';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'): string => {
  if (!path) return '/placeholder-poster.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string => {
  if (!path) return '/placeholder-backdrop.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getProfileUrl = (path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'): string => {
  if (!path) return '/placeholder-profile.jpg';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getLogoUrl = (path: string | null): string => {
  if (!path) return '/placeholder-logo.png';
  return `${IMAGE_BASE_URL}/original${path}`;
};

const getHeaders = () => ({
  'Authorization': `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
});

export async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: getHeaders(),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  
  if (!response.ok) {
    throw new Error(`TMDB API Error: ${response.status}`);
  }
  
  return response.json();
}

export async function getTrending(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/trending/all/${timeWindow}`);
}

export async function getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/trending/movie/${timeWindow}`);
}

export async function getTrendingTV(timeWindow: 'day' | 'week' = 'week'): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/trending/tv/${timeWindow}`);
}

export async function getPopularMovies(page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/movie/popular?page=${page}`);
}

export async function getPopularTV(page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/tv/popular?page=${page}`);
}

export async function getTopRatedMovies(page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/movie/top_rated?page=${page}`);
}

export async function getTopRatedTV(page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/tv/top_rated?page=${page}`);
}

export async function getUpcomingMovies(page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/movie/upcoming?page=${page}`);
}

export async function getNowPlayingMovies(page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/movie/now_playing?page=${page}`);
}

export async function getOnTheAirTV(page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/tv/on_the_air?page=${page}`);
}

export async function searchMulti(query: string, page: number = 1): Promise<TMDBSearchResponse> {
  const encodedQuery = encodeURIComponent(query);
  return fetchFromTMDB<TMDBSearchResponse>(`/search/multi?query=${encodedQuery}&page=${page}`);
}

export async function searchMovies(query: string, page: number = 1): Promise<TMDBSearchResponse> {
  const encodedQuery = encodeURIComponent(query);
  return fetchFromTMDB<TMDBSearchResponse>(`/search/movie?query=${encodedQuery}&page=${page}`);
}

export async function searchTV(query: string, page: number = 1): Promise<TMDBSearchResponse> {
  const encodedQuery = encodeURIComponent(query);
  return fetchFromTMDB<TMDBSearchResponse>(`/search/tv?query=${encodedQuery}&page=${page}`);
}

export async function getMovieDetails(id: number): Promise<TMDBMovieDetails> {
  return fetchFromTMDB<TMDBMovieDetails>(`/movie/${id}?append_to_response=videos,similar,credits,watch_providers`);
}

export async function getTVDetails(id: number): Promise<TMDBTVDetails> {
  return fetchFromTMDB<TMDBTVDetails>(`/tv/${id}?append_to_response=videos,similar,credits,watch_providers,seasons`);
}

export async function getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<{ episodes: TMDBEpisode[] }> {
  return fetchFromTMDB<{ episodes: TMDBEpisode[] }>(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function getMovieGenres(): Promise<TMDBGenresResponse> {
  return fetchFromTMDB<TMDBGenresResponse>('/genre/movie/list');
}

export async function getTVGenres(): Promise<TMDBGenresResponse> {
  return fetchFromTMDB<TMDBGenresResponse>('/genre/tv/list');
}

export async function getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/discover/movie?with_genres=${genreId}&page=${page}`);
}

export async function getTVByGenre(genreId: number, page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/discover/tv?with_genres=${genreId}&page=${page}`);
}

export async function getSimilarMovies(id: number, page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/movie/${id}/similar?page=${page}`);
}

export async function getSimilarTV(id: number, page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/tv/${id}/similar?page=${page}`);
}

export async function getRecommendationsMovies(id: number, page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/movie/${id}/recommendations?page=${page}`);
}

export async function getRecommendationsTV(id: number, page: number = 1): Promise<TMDBTrendingResponse> {
  return fetchFromTMDB<TMDBTrendingResponse>(`/tv/${id}/recommendations?page=${page}`);
}
