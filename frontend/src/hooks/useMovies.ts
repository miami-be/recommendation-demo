import { useState, useEffect } from 'react';
import { Movie, MovieState } from '../types';
import { movies, getRecommendations } from '../data/movies';

export const useMovies = () => {
  const [state, setState] = useState<MovieState>({
    allMovies: movies,
    selectedMovies: [],
    recommendations: [],
    searchQuery: '',
  });

  // Update recommendations whenever selected movies change
  useEffect(() => {
    const newRecommendations = getRecommendations(state.selectedMovies);
    setState(prevState => ({
      ...prevState,
      recommendations: newRecommendations
    }));
  }, [state.selectedMovies]);

  // Toggle movie selection
  const toggleMovieSelection = (movieId: number) => {
    setState(prevState => {
      const isSelected = prevState.selectedMovies.includes(movieId);
      const newSelectedMovies = isSelected
        ? prevState.selectedMovies.filter(id => id !== movieId)
        : [...prevState.selectedMovies, movieId];
      
      return {
        ...prevState,
        selectedMovies: newSelectedMovies,
      };
    });
  };

  // Search functionality
  const handleSearch = (query: string) => {
    setState(prevState => ({
      ...prevState,
      searchQuery: query
    }));
  };

  // Get filtered movies based on search query
  const filteredMovies = state.searchQuery
    ? state.allMovies.filter(movie => 
        movie.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        movie.genres.some(genre => genre.toLowerCase().includes(state.searchQuery.toLowerCase()))
      )
    : state.allMovies;

  return {
    movies: filteredMovies,
    selectedMovies: state.selectedMovies,
    recommendations: state.recommendations,
    searchQuery: state.searchQuery,
    toggleMovieSelection,
    handleSearch,
  };
};