import { Movie } from '../types';

export const movies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    posterUrl: "https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 2010,
    rating: 8.8,
    genres: ["Action", "Sci-Fi", "Thriller"],
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O."
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    posterUrl: "https://images.pexels.com/photos/15919780/pexels-photo-15919780/free-photo-of-silhouette-of-man-behind-bars.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 1994,
    rating: 9.3,
    genres: ["Drama"],
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
  },
  {
    id: 3,
    title: "The Dark Knight",
    posterUrl: "https://images.pexels.com/photos/2925304/pexels-photo-2925304.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 2008,
    rating: 9.0,
    genres: ["Action", "Crime", "Drama"],
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
  },
  {
    id: 4,
    title: "Pulp Fiction",
    posterUrl: "https://images.pexels.com/photos/5137664/pexels-photo-5137664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 1994,
    rating: 8.9,
    genres: ["Crime", "Drama"],
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption."
  },
  {
    id: 5,
    title: "The Godfather",
    posterUrl: "https://images.pexels.com/photos/8112139/pexels-photo-8112139.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 1972,
    rating: 9.2,
    genres: ["Crime", "Drama"],
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
  },
  {
    id: 6,
    title: "Fight Club",
    posterUrl: "https://images.pexels.com/photos/4348748/pexels-photo-4348748.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 1999,
    rating: 8.8,
    genres: ["Drama"],
    description: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more."
  },
  {
    id: 7,
    title: "Forrest Gump",
    posterUrl: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 1994,
    rating: 8.8,
    genres: ["Drama", "Romance"],
    description: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart."
  },
  {
    id: 8,
    title: "The Matrix",
    posterUrl: "https://images.pexels.com/photos/2516406/pexels-photo-2516406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 1999,
    rating: 8.7,
    genres: ["Action", "Sci-Fi"],
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers."
  },
  {
    id: 9,
    title: "Interstellar",
    posterUrl: "https://images.pexels.com/photos/6501460/pexels-photo-6501460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 2014,
    rating: 8.6,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."
  },
  {
    id: 10,
    title: "The Silence of the Lambs",
    posterUrl: "https://images.pexels.com/photos/3888585/pexels-photo-3888585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 1991,
    rating: 8.6,
    genres: ["Crime", "Drama", "Thriller"],
    description: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims."
  },
  {
    id: 11,
    title: "Goodfellas",
    posterUrl: "https://images.pexels.com/photos/3945321/pexels-photo-3945321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 1990,
    rating: 8.7,
    genres: ["Biography", "Crime", "Drama"],
    description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate."
  },
  {
    id: 12,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    posterUrl: "https://images.pexels.com/photos/6435031/pexels-photo-6435031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    year: 2001,
    rating: 8.8,
    genres: ["Action", "Adventure", "Drama"],
    description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron."
  }
];

export const getRecommendations = (selectedMovieIds: number[]): Movie[] => {
  if (selectedMovieIds.length === 0) return [];
  
  // Get the selected movies
  const selectedMovies = movies.filter(movie => selectedMovieIds.includes(movie.id));
  
  // Extract all genres from selected movies
  const selectedGenres = new Set<string>();
  selectedMovies.forEach(movie => {
    movie.genres.forEach(genre => selectedGenres.add(genre));
  });
  
  // Find movies with matching genres that aren't already selected
  const recommendations = movies
    .filter(movie => !selectedMovieIds.includes(movie.id))
    .map(movie => {
      // Count matching genres
      const matchingGenres = movie.genres.filter(genre => selectedGenres.has(genre)).length;
      return { movie, matchingGenres };
    })
    .filter(item => item.matchingGenres > 0)
    .sort((a, b) => b.matchingGenres - a.matchingGenres || b.movie.rating - a.movie.rating)
    .slice(0, 4)
    .map(item => item.movie);
  
  return recommendations;
};