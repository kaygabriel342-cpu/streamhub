import { Anime, AnimeEpisode, AnimeSearchResponse, AnimeSource } from './types';

const ANILIST_API = 'https://graphql.anilist.co';
const JIKAN_API = 'https://api.jikan.moe/v4';
const CONSUMET_API = 'https://consumet-api.vercel.app';
const GOGOANIME_API = 'https://gogoanime.consumet.org';

// AniList GraphQL Query
const ANILIST_QUERY = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: ANIME) {
      id
      title { romaji english native }
      description
      coverImage { large medium }
      bannerImage
      genres
      status
      episodes
      duration
      season
      seasonYear
      averageScore
      popularity
      format
      startDate { year month day }
      endDate { year month day }
      trailer { id site }
    }
  }
}
`;

export async function searchAnimeAniList(query: string, page = 1, perPage = 20): Promise<Anime[]> {
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: {
          search: query,
          page: page,
          perPage: perPage,
        },
      }),
    });

    const data = await response.json();
    return data.data?.Page?.media || [];
  } catch (error) {
    console.error('AniList API Error:', error);
    return [];
  }
}

export async function searchAnimeJikan(query: string, page = 1): Promise<Anime[]> {
  try {
    const response = await fetch(`${JIKAN_API}/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`);
    const data = await response.json();
    return data.data?.map((anime: any) => ({
      id: anime.mal_id,
      title: {
        romaji: anime.title,
        english: anime.title_english,
        native: anime.title_japanese,
      },
      description: anime.synopsis,
      coverImage: {
        large: anime.images?.jpg?.large_image_url,
        medium: anime.images?.jpg?.image_url,
      },
      bannerImage: anime.images?.jpg?.large_image_url,
      genres: anime.genres?.map((g: any) => g.name),
      status: anime.status,
      episodes: anime.episodes,
      duration: anime.duration,
      season: anime.season,
      seasonYear: anime.year,
      averageScore: anime.score ? anime.score * 10 : 0,
      popularity: anime.popularity,
      format: anime.type,
      startDate: {
        year: anime.aired?.from?.split('-')[0],
        month: anime.aired?.from?.split('-')[1],
        day: anime.aired?.from?.split('-')[2],
      },
    })) || [];
  } catch (error) {
    console.error('Jikan API Error:', error);
    return [];
  }
}

export async function getTopAnimeAniList(page = 1): Promise<Anime[]> {
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: SCORE_DESC) {
              id
              title { romaji english native }
              coverImage { large }
              averageScore
              popularity
              genres
              format
            }
          }
        }
        `,
        variables: {
          page: page,
          perPage: 20,
        },
      }),
    });

    const data = await response.json();
    return data.data?.Page?.media || [];
  } catch (error) {
    console.error('AniList API Error:', error);
    return [];
  }
}

export async function getTrendingAnimeAniList(): Promise<Anime[]> {
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query ($page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(type: ANIME, sort: TRENDING_DESC) {
              id
              title { romaji english native }
              coverImage { large }
              averageScore
              popularity
              genres
              format
              bannerImage
            }
          }
        }
        `,
        variables: {
          page: 1,
          perPage: 20,
        },
      }),
    });

    const data = await response.json();
    return data.data?.Page?.media || [];
  } catch (error) {
    console.error('AniList API Error:', error);
    return [];
  }
}

export async function getAnimeDetailsAniList(animeId: number): Promise<Anime | null> {
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title { romaji english native }
            description
            coverImage { large medium }
            bannerImage
            genres
            status
            episodes
            duration
            season
            seasonYear
            averageScore
            popularity
            format
            startDate { year month day }
            endDate { year month day }
            trailer { id site }
            relations { edges { relationType node { id title { romaji english } } } }
          }
        }
        `,
        variables: { id: animeId },
      }),
    });

    const data = await response.json();
    return data.data?.Media || null;
  } catch (error) {
    console.error('AniList API Error:', error);
    return null;
  }
}

// GogoAnime/Consumet for streaming
export async function searchAnimeGogoAnime(query: string): Promise<any[]> {
  try {
    const response = await fetch(`${CONSUMET_API}/anime/gogoanime/${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('GogoAnime API Error:', error);
    return [];
  }
}

export async function getAnimeEpisodesGogoAnime(animeId: string): Promise<AnimeEpisode[]> {
  try {
    const response = await fetch(`${CONSUMET_API}/anime/gogoanime/info/${animeId}`);
    const data = await response.json();
    return data.episodes || [];
  } catch (error) {
    console.error('GogoAnime API Error:', error);
    return [];
  }
}

export async function getAnimeStreamGogoAnime(episodeId: string): Promise<AnimeSource> {
  try {
    const response = await fetch(`${CONSUMET_API}/anime/gogoanime/watch/${episodeId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('GogoAnime Stream API Error:', error);
    return { sources: [], headers: {} };
  }
}

// Kitsu API
export async function searchAnimeKitsu(query: string): Promise<Anime[]> {
  try {
    const response = await fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.data?.map((item: any) => ({
      id: item.id,
      title: {
        romaji: item.attributes.titles?.en_jp,
        english: item.attributes.titles?.en,
        native: item.attributes.titles?.ja_jp,
      },
      description: item.attributes.synopsis,
      coverImage: {
        large: item.attributes.posterImage?.large,
        medium: item.attributes.posterImage?.medium,
      },
      bannerImage: item.attributes.coverImage?.large,
      genres: item.attributes.categories,
      status: item.attributes.status,
      episodes: item.attributes.episodeCount,
      averageScore: item.attributes.averageRating ? parseFloat(item.attributes.averageRating) : 0,
    })) || [];
  } catch (error) {
    console.error('Kitsu API Error:', error);
    return [];
  }
}

// Seasonal anime
export async function getSeasonalAnime(season: string = 'current', year?: number): Promise<Anime[]> {
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query ($season: MediaSeason, $seasonYear: Int, $page: Int, $perPage: Int) {
          Page(page: $page, perPage: $perPage) {
            media(season: $season, seasonYear: $seasonYear, type: ANIME) {
              id
              title { romaji english native }
              coverImage { large }
              averageScore
              popularity
              genres
              format
              episodes
            }
          }
        }
        `,
        variables: {
          season: season.toUpperCase(),
          seasonYear: year || new Date().getFullYear(),
          page: 1,
          perPage: 20,
        },
      }),
    });

    const data = await response.json();
    return data.data?.Page?.media || [];
  } catch (error) {
    console.error('AniList Seasonal API Error:', error);
    return [];
  }
}
