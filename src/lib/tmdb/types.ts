export interface TMDBImage {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string | null;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
  original_language: string;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
}

export interface TMDBMedia extends TMDBMovie {
  media_type?: 'movie' | 'tv' | 'person';
  name?: string;
  original_name?: string;
  first_air_date?: string;
  origin_country?: string[];
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  production_companies: { id: number; name: string; logo_path: string | null }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  videos: { results: TMDBVideo[] };
  similar: TMDBMedia[];
  recommendations: TMDBMedia[];
  credits: { cast: TMDBCast[]; crew: TMDBCrew[] };
  watch_providers?: { results: { [key: string]: TMDBProviderInfo } };
}

export interface TMDBTVDetails extends TMDBTVShow {
  genres: { id: number; name: string }[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string;
  type: string;
  created_by: { id: number; name: string; profile_path: string | null }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  production_countries: { iso_3166_1: string; name: string }[];
  spoken_languages: { iso_639_1: string; name: string }[];
  videos: { results: TMDBVideo[] };
  similar: TMDBMedia[];
  recommendations: TMDBMedia[];
  credits: { cast: TMDBCast[]; crew: TMDBCrew[] };
  watch_providers?: { results: { [key: string]: TMDBProviderInfo } };
  seasons: TMDBSeason[];
}

export interface TMDBSeason {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  air_date: string;
  episode_count: number;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  episode_number: number;
  season_number: number;
  still_path: string | null;
  air_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}

export interface TMDBVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBProviderInfo {
  link: string;
  flatrate?: { id: number; name: string; logo_path: string }[];
  rent?: { id: number; name: string; logo_path: string }[];
  buy?: { id: number; name: string; logo_path: string }[];
  ads?: { id: number; name: string; logo_path: string }[];
}

export interface TMDBSearchResponse {
  page: number;
  results: TMDBMedia[];
  total_pages: number;
  total_results: number;
}

export interface TMDBTrendingResponse {
  page: number;
  results: TMDBMedia[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBGenresResponse {
  genres: TMDBGenre[];
}
