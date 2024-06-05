import {MovieDetailDTO} from "./movie.dto";

export interface RegisterDTO {
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface TokenResponseDTO {
  id: string;
  email: string;
  token: string;
}

export interface AddToWatchedMovieDTO {
  movieId: string;
  rating?: number;
}

export interface AddToWatchLaterMovieDTO {
  movieId: string;
}

export interface UpdateWatchedMovieRatingDTO {
  movieId: string;
  rating: number;
}

export interface ResponseMoviesDTO {
  success:boolean;
  movies: MovieDetailDTO[];
}

export interface ResponseMessageDTO {
  success: boolean;
  message: string;
}