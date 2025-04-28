import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  selectedMovies: number[];
  onMovieClick: (movieId: number) => void;
  title: string;
  isRecommendation?: boolean;
}

const MovieGrid: React.FC<MovieGridProps> = ({ 
  movies,
  selectedMovies,
  onMovieClick,
  title,
  isRecommendation = false
}) => {
  if (movies.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isSelected={selectedMovies.includes(movie.id)}
            onClick={() => onMovieClick(movie.id)}
            isRecommendation={isRecommendation}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;