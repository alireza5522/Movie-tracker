import { TMDBSearchResult, TMDBTVDetails } from '../types';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

export function isAPIKeyConfigured(): boolean {
  return TMDB_API_KEY !== '' && TMDB_API_KEY !== 'YOUR_TMDB_API_KEY';
}

export async function searchByIMDB(imdbId: string): Promise<TMDBSearchResult | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    );
    const data = await response.json();

    if (data.movie_results && data.movie_results.length > 0) {
      return { ...data.movie_results[0], media_type: 'movie' };
    }
    if (data.tv_results && data.tv_results.length > 0) {
      return { ...data.tv_results[0], media_type: 'tv' };
    }
    return null;
  } catch (error) {
    console.error('TMDB search error:', error);
    return null;
  }
}

export async function getTVDetails(tmdbId: number): Promise<TMDBTVDetails | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tmdbId}?api_key=${TMDB_API_KEY}`
    );
    return await response.json();
  } catch (error) {
    console.error('TMDB TV details error:', error);
    return null;
  }
}

export function getPosterUrl(posterPath?: string): string {
  if (!posterPath) return '/placeholder.png';
  return `${TMDB_IMAGE_BASE}${posterPath}`;
}

export function extractIMDBId(url: string): string | null {
  const patterns = [
    /imdb\.com\/title\/(tt\d+)/,
    /\/(tt\d+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
