import React from 'react';
import { Star } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  isSelected: boolean;
  onClick: () => void;
  isRecommendation?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  isSelected, 
  onClick,
  isRecommendation = false
}) => {
  return (
    <div 
      className={`
        relative group overflow-hidden rounded-lg shadow-lg transition-all duration-300 
        hover:shadow-xl hover:scale-[1.02] cursor-pointer
        ${isSelected ? 'ring-4 ring-red-500' : ''}
        ${isRecommendation ? 'bg-blue-900/10' : 'bg-white'}
      `}
      onClick={onClick}
    >
      <div className="aspect-[2/3] overflow-hidden">
        <img 
          src={movie.posterUrl} 
          alt={movie.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium">{movie.year}</p>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
            <span className="text-sm font-bold">{movie.rating}</span>
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-bold tracking-tight mb-1">{movie.title}</h3>
        <div className="flex flex-wrap gap-1">
          {movie.genres.map((genre, index) => (
            <span 
              key={index}
              className="text-xs bg-blue-900/60 px-2 py-1 rounded-full"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-red-500 rounded-full w-6 h-6 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;