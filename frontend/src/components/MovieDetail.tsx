import React from 'react';
import { Star, X } from 'lucide-react';
import { Movie } from '../types';

interface MovieDetailProps {
  movie: Movie;
  onClose: () => void;
}

const MovieDetail: React.FC<MovieDetailProps> = ({ movie, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:w-1/3 h-72 md:h-auto relative">
          <img 
            src={movie.posterUrl} 
            alt={movie.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="md:w-2/3 p-6 md:p-8 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{movie.title}</h2>
              <div className="flex items-center mt-1">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-1" />
                <span className="font-bold text-gray-800">{movie.rating}</span>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-gray-600">{movie.year}</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genres.map((genre, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {genre}
              </span>
            ))}
          </div>
          
          <h3 className="font-semibold text-gray-800 mb-2">Overview</h3>
          <p className="text-gray-600 leading-relaxed">{movie.description}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;