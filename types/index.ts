export type ContentType = 'movie' | 'series' | 'sport';
export type PlatformType = 'flatrate' | 'rent' | 'buy' | 'free' | 'live';

export interface Platform {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  textColor: string;
  url: string;
  type: PlatformType;
  logoUrl?: string;  // Logo oficial de la plataforma (TMDB CDN)
}

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  voteAverage: number;
  voteCount: number;
  releaseDate: string;
  genres: string[];
  type: 'movie' | 'series';
  platforms: Platform[];
  tmdbId?: number;
  runtime?: number;
  seasons?: number;
  isNew?: boolean;
  isTop10?: boolean;
  rank?: number;
  trailerUrl?: string;
}

export interface SportEvent {
  id: number;
  title: string;
  sport: 'football' | 'formula1' | 'tennis' | 'basketball' | 'rugby' | 'ufc' | 'cycling' | 'other';
  league: string;
  leagueLogo?: string;
  teamA?: string;
  teamB?: string;
  logoA?: string;
  logoB?: string;
  date: string;
  time: string;
  timezone: string;
  platforms: Platform[];
  isLive: boolean;
  thumbnailPath: string;
  description?: string;
  isUruguay?: boolean;
  score?: string;       // "2-1"
  liveMinute?: number;  // e.g. 67
  status?: string;      // "NS" | "1H" | "HT" | "2H" | "FT"
}

export interface AdminContent {
  id: string;
  tmdbId?: number;
  title: string;
  type: ContentType;
  overridePlatforms: Platform[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  isManual: boolean;
}

export interface FilterState {
  platformIds: string[];
  genres: string[];
  contentType: 'all' | 'movie' | 'series';
  query: string;
}

export interface HeroSlide {
  movie: Movie;
  tagline: string;
}
