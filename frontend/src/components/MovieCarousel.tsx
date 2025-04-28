import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieCarouselProps {
  movies: Movie[];
  selectedMovies: number[];
  onMovieClick: (movieId: number) => void;
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({
  movies,
  selectedMovies,
  onMovieClick,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
  });

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={scrollPrev}
          className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 py-4">
          {movies.map((movie) => (
            <div key={movie.id} className="flex-[0_0_280px]">
              <MovieCard
                movie={movie}
                isSelected={selectedMovies.includes(movie.id)}
                onClick={() => onMovieClick(movie.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <button
          onClick={scrollNext}
          className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-gray-800" />
        </button>
      </div>
    </div>
  );
};

export default MovieCarousel;