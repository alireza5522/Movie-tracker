export interface WatchlistItem {
  id: string;
  tmdb_id?: number;
  imdb_id?: string;
  title: string;
  year?: string;
  poster?: string;
  overview?: string;
  type: 'movie' | 'tv';
  total_seasons?: number;
  current_season?: number;
  current_episode?: number;
  has_new_episodes?: boolean;
  last_checked?: string;
  status?: string;
  created_at?: string;
}

export interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  media_type: 'movie' | 'tv';
}

export interface TMDBTVDetails {
  id: number;
  name: string;
  poster_path?: string;
  overview?: string;
  first_air_date?: string;
  number_of_seasons: number;
  seasons: Array<{
    season_number: number;
    episode_count: number;
  }>;
}
