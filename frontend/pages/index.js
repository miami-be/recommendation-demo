import { useState, useEffect } from 'react';
import MovieGrid from '../components/MovieGrid';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

async function fetchPoster(tmdbId) {
  if (!tmdbId) return null;
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${TMDB_API_KEY}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : null;
  } catch {
    return null;
  }
}

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [selected, setSelected] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecs, setLoadingRecs] = useState(false);

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      const res = await fetch('http://localhost:8000/movies?limit=30');
      const data = await res.json();
      const moviesWithPosters = await Promise.all(
        data.map(async (movie) => {
          let posterUrl = null;
          if (movie.tmdbId) {
            posterUrl = await fetchPoster(movie.tmdbId);
          }
          return { ...movie, posterUrl };
        })
      );
      setMovies(moviesWithPosters);
      setLoading(false);
    }
    loadMovies();
  }, []);

  const toggleSelect = (movieId) => {
    setSelected((prev) => prev.includes(movieId) ? prev.filter(id => id !== movieId) : [...prev, movieId]);
  };

  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    // For demo: pick a userId (or could POST selected movies to a custom endpoint)
    const res = await fetch(`http://localhost:8000/recommend?user_id=1`);
    const data = await res.json();
    // Fetch posters for recommendations
    const recsWithPosters = await Promise.all(
      data.recommendations.map(async (movie) => {
        let posterUrl = null;
        if (movie.tmdbId) {
          posterUrl = await fetchPoster(movie.tmdbId);
        }
        return { ...movie, posterUrl };
      })
    );
    setRecommendations(recsWithPosters);
    setLoadingRecs(false);
  };

  return (
    <main className="bg-neutral-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-black mb-4"><span className="text-red-600">MovieLens</span> Recommendation Demo</h1>
        <h2 className="text-xl mb-6 font-semibold">Select Movies You Like</h2>
        {loading ? (
          <div className="text-gray-400">Loading movies...</div>
        ) : (
          <MovieGrid movies={movies} selected={selected} onSelect={toggleSelect} />
        )}
        <button
          className="mt-6 px-6 py-2 rounded bg-red-600 hover:bg-red-700 text-lg font-semibold disabled:opacity-60"
          onClick={fetchRecommendations}
          disabled={selected.length === 0 || loadingRecs}
        >
          {loadingRecs ? 'Loading Recommendations...' : 'Get Recommendations'}
        </button>
        {recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Recommended For You</h2>
            <MovieGrid movies={recommendations} selected={[]} onSelect={() => {}} />
          </div>
        )}
      </div>
    </main>
  );
}
