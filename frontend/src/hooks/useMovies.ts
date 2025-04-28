import { useState, useEffect } from 'react';
import { MovieState } from '../types';
import axios from 'axios';
// import { movies, getRecommendations } from '../data/movies'; // No longer needed

export const useMovies = () => {
  // Fetch allMovies from the backend on mount
  const [state, setState] = useState<MovieState>({
    allMovies: [],
    selectedMovies: [],
    recommendations: [],
    searchQuery: '',
  });

  // Fetch a small initial set of movies from backend on mount
  useEffect(() => {
    const fetchInitialMovies = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies?skip=0&limit=20`);
        setState(prevState => ({
          ...prevState,
          allMovies: response.data.map((m: any) => ({
            id: m.movieId,
            title: m.title,
            tmdbId: m.tmdbId,
            posterUrl: '',
            year: 0,
            rating: 0,
            genres: m.genres ? m.genres.split('|') : [],
            description: '',
          })),
        }));
      } catch (error) {}
    };
    fetchInitialMovies();
  }, []);

  // Backend-powered search: fetch movies from backend when searchQuery changes
  useEffect(() => {
    const fetchSearchedMovies = async () => {
      if (!state.searchQuery) return;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/movies?search=${encodeURIComponent(state.searchQuery)}&limit=40`);
        setState(prevState => ({
          ...prevState,
          allMovies: response.data.map((m: any) => ({
            id: m.movieId,
            title: m.title,
            tmdbId: m.tmdbId,
            posterUrl: '',
            year: 0,
            rating: 0,
            genres: m.genres ? m.genres.split('|') : [],
            description: '',
          })),
        }));
      } catch (error) {}
    };
    fetchSearchedMovies();
    // eslint-disable-next-line
  }, [state.searchQuery]);

  // Fetch posters and metadata from TMDb for movies with tmdbId and missing posterUrl
  useEffect(() => {
    const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
    const fetchTMDbData = async () => {
      // Only fetch for movies missing posterUrl and with tmdbId
      const moviesToFetch = state.allMovies.filter(m => m.tmdbId && !m.posterUrl);
      if (moviesToFetch.length === 0) return;
      const updatedMovies = await Promise.all(state.allMovies.map(async movie => {
        if (!movie.tmdbId || movie.posterUrl) return movie;
        try {
          const resp = await axios.get(`https://api.themoviedb.org/3/movie/${movie.tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`);
          const details = resp.data;
          return {
            ...movie,
            posterUrl: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '',
            year: details.release_date ? parseInt(details.release_date.slice(0, 4)) : 0,
            description: details.overview || '',
            rating: details.vote_average || 0,
          };
        } catch {
          return movie;
        }
      }));
      setState(prev => ({ ...prev, allMovies: updatedMovies }));
    };
    if (state.allMovies.length > 0) fetchTMDbData();
    // eslint-disable-next-line
  }, [state.allMovies.length]);

  // Update recommendations whenever selected movies change
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (state.selectedMovies.length === 0) {
        setState(prevState => ({
          ...prevState,
          recommendations: [],
        }));
        return;
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/recommend?selected=${state.selectedMovies.join(",")}&top_n=20`);
        // The backend returns { recommendations: [...] }
        // Enrich recommendations with posterUrl and metadata from allMovies or TMDb
        const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY';
        const enrichRecommendation = async (rec: any) => {
          // Try to find in allMovies cache
          const cached = state.allMovies.find(m => m.id === rec.movieId);
          if (cached && cached.posterUrl) {
            return {
              ...rec,
              posterUrl: cached.posterUrl,
              year: cached.year,
              rating: cached.rating,
              description: cached.description,
              genres: cached.genres,
            };
          }
          // Try to fetch from TMDb if tmdbId exists
          if (rec.tmdbId) {
            try {
              const resp = await axios.get(`https://api.themoviedb.org/3/movie/${rec.tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`);
              const details = resp.data;
              return {
                ...rec,
                posterUrl: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '',
                year: details.release_date ? parseInt(details.release_date.slice(0, 4)) : 0,
                description: details.overview || '',
                rating: details.vote_average || 0,
                genres: rec.genres ? rec.genres.split('|') : [],
              };
            } catch {
              // fallback to minimal
            }
          }
          // Fallback: minimal info
          return {
            ...rec,
            posterUrl: '',
            year: 0,
            rating: 0,
            description: '',
            genres: rec.genres ? rec.genres.split('|') : [],
          };
        };
        Promise.all(response.data.recommendations.map(enrichRecommendation)).then(finalRecs => {
          setState(prevState => ({
            ...prevState,
            recommendations: finalRecs,
          }));
        });
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          recommendations: [],
        }));
      }
    };
    fetchRecommendations();
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