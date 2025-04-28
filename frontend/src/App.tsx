import React, { useState } from 'react';
import Header from './components/Header';
import MovieCarousel from './components/MovieCarousel';
import MovieGrid from './components/MovieGrid';
import MovieDetail from './components/MovieDetail';
import EmptyState from './components/EmptyState';
import { useMovies } from './hooks/useMovies';
import { Movie } from './types';

function App() {
  const { 
    movies, 
    selectedMovies, 
    recommendations, 
    searchQuery, 
    toggleMovieSelection, 
    handleSearch 
  } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleMovieClick = (movieId: number) => {
    if (selectedMovies.includes(movieId)) {
      const movie = movies.find(m => m.id === movieId) || recommendations.find(m => m.id === movieId);
      if (movie) {
        setSelectedMovie(movie);
      }
    } else {
      toggleMovieSelection(movieId);
    }
  };

  const handleConfirmSelection = () => {
    setShowRecommendations(true);
  };

  const handleClearSelection = () => {
    selectedMovies.forEach(id => toggleMovieSelection(id));
    setShowRecommendations(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedMovies.length === 0 ? 'Select Your Favorite Movies' : `Selected (${selectedMovies.length})`}
            </h2>
            {selectedMovies.length > 0 && (
              <div className="flex gap-4">
                <button 
                  onClick={handleClearSelection}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 
                           hover:bg-red-50 rounded-md transition-colors"
                >
                  Clear All
                </button>
                {!showRecommendations && (
                  <button 
                    onClick={handleConfirmSelection}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                             hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Get Recommendations
                  </button>
                )}
              </div>
            )}
          </div>
          
          <MovieCarousel
            movies={movies}
            selectedMovies={selectedMovies}
            onMovieClick={handleMovieClick}
          />
        </div>
        
        {showRecommendations && recommendations.length > 0 && (
          <MovieGrid
            title="Recommended For You"
            movies={recommendations}
            selectedMovies={selectedMovies}
            onMovieClick={handleMovieClick}
            isRecommendation={true}
          />
        )}
        
        {searchQuery && (
          movies.length > 0 ? (
            <MovieGrid
              title={`Search Results for "${searchQuery}"`}
              movies={movies}
              selectedMovies={selectedMovies}
              onMovieClick={handleMovieClick}
            />
          ) : (
            <EmptyState 
              message="No movies found" 
              submessage="Try adjusting your search or filters."
            />
          )
        )}
      </main>
      
      {selectedMovie && (
        <MovieDetail 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}

export default App;