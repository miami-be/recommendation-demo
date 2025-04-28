export interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  year: number;
  rating: number;
  genres: string[];
  description: string;
  tmdbId?: number;
}

export interface MovieState {
  allMovies: Movie[];
  selectedMovies: number[];
  recommendations: Movie[];
  searchQuery: string;
}