import React from 'react';

export default function MovieGrid({ movies, selected, onSelect }) {
  // Only show movies with posters
  const filtered = movies.filter((movie) => !!movie.posterUrl);
  return (
    <div className="bg-neutral-900 min-h-screen py-6 px-2">
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2">
        {filtered.map((movie) => (
          <div
            key={movie.movieId}
            className={`relative cursor-pointer rounded-lg overflow-hidden shadow-lg border-2 border-neutral-900 hover:border-red-500 hover:scale-105 transition-all duration-150 bg-neutral-800 ${selected.includes(movie.movieId) ? 'border-red-500 scale-105' : ''}`}
            onClick={() => onSelect(movie.movieId)}
            style={{ aspectRatio: '2/3' }}
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-32 sm:h-40 md:h-44 lg:h-48 object-cover object-top"
              style={{ filter: selected.includes(movie.movieId) ? 'brightness(0.7)' : 'none' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end">
              <div className="p-1 text-white text-xs text-center font-semibold bg-black/60 rounded-b-lg truncate">
                {movie.title}
              </div>
            </div>
            {selected.includes(movie.movieId) && (
              <div className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-1 py-0.5 text-[10px] font-bold shadow">Selected</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
