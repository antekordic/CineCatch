import { Request, Response } from "express";
import fetch from "node-fetch";
import { UserDocument, UserModel } from "../models/user.model";
import {
  HTTP_NO_CONTENT,
  HTTP_BAD_REQUEST,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_FORBIDDEN,
  HTTP_NOT_FOUND,
  HTTP_CONFLICT,
  HTTP_OK,
  HTTP_CREATED,
} from "../constants/http_status";
import { AuthRequest } from "../middleware/auth.middleware";
import { MovieDetailDTO, MovieUserContextDTO } from "../shared/dtos/movie.dto";

// Function to fetch movie details from TMDB
const fetchMovieDetails = async (
  movieIds: string[],
  user?: UserDocument
): Promise<MovieDetailDTO[]> => {
  const movieDetails = await Promise.all(
    movieIds.map(async (movieId) => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&append_to_response=videos,images&api_key=${process.env.TMDB_API_KEY}`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
        },
      };
      const response = await fetch(url, options);
      if (!response.ok) {
        console.error(`Failed to fetch data for movieId: ${movieId}`);
        return null;
      }
      const data = await response.json();

      // Filter only trailer videos
      data.videos.results = data.videos.results.filter(
        (video: any) => video.type === "Trailer"
      );

      return data as MovieDetailDTO;
    })
  );

  // Filter out any null values
  return Promise.all(
    movieDetails
      .filter((movie): movie is MovieDetailDTO => movie !== null)
      .map(async (movie) => {
        if (!user) {
          return movie;
        }

        return addUserContext(movie, user);
      })
  );
};

export const addUserContext = async (
  movie: MovieDetailDTO,
  user: UserDocument
): Promise<MovieDetailDTO & MovieUserContextDTO> => {
  const watched = !!user.watchedMovies.find(
    ({ movieId }) => movieId === movie.id.toString()
  );
  const watchLater = !!user.watchLaterMovies.find(
    (watchLaterMovieId) => watchLaterMovieId === movie.id.toString()
  );
  const rating =
    user.watchedMovies.find(({ movieId }) => movieId === movie.id.toString())
      ?.rating || 0;

  return {
    ...movie,
    user: {
      watched,
      watchLater,
      rating,
    },
  };
};

// Controller to get the next popular movie for a user
export const getNextPopularMovie = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(HTTP_BAD_REQUEST).json({ error: "User not found" });
    }

    const currentPage = user.currentPage || 1;
    const movieIndex = user.movieIndex || 0;

    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc&api_key=${process.env.TMDB_API_KEY}`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return res.status(HTTP_NO_CONTENT).json({ error: "No movies found" });
    }

    const nextMovie = data.results[movieIndex];

    // Fetch additional details for the next movie
    const detailedMovie = await fetchMovieDetails(
      [nextMovie.id.toString()],
      user
    );

    // Update user data
    user.currentPage =
      movieIndex >= data.results.length - 1 ? currentPage + 1 : currentPage;
    user.movieIndex = (movieIndex + 1) % data.results.length;

    await user.save();

    res.status(HTTP_OK).json(detailedMovie[0]); // Return the detailed movie information
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Controller to search movies by a query
export const searchMovies = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(HTTP_BAD_REQUEST).json({ error: "User not found" });
    }

    const query = req.query.query?.toString();
    const page = req.query.page || 1;

    if (!query) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ error: "Query parameter is missing" });
    }

    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&language=en-US&page=${page}&append_to_response=videos,images&api_key=${
      process.env.TMDB_API_KEY
    }`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_AUTH_TOKEN}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    const movies: MovieDetailDTO[] = await fetchMovieDetails(
      (data.results || []).map((movie: any) => movie.id.toString()),
      user
    );

    res.status(HTTP_OK).json(movies);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Controller to fetch movies marked as watch later by the user
export const getWatchLaterMovies = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }
    const watchLaterMovieIds = user.watchLaterMovies;
    const movieDetails = await fetchMovieDetails(watchLaterMovieIds, user);
    res.status(HTTP_OK).json({ success: true, movies: movieDetails });
  } catch (error: unknown) {
    console.error("Error:", error);
    if (error instanceof Error) {
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    } else {
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "An unknown error occurred" });
    }
  }
};

// Controller to fetch movies marked as watched by the user
export const getWatchedMovies = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }
    const watchedMovieIds = user.watchedMovies.map((movie) => movie.movieId);
    const movieDetails = await fetchMovieDetails(watchedMovieIds, user);
    res.status(HTTP_OK).json({ success: true, movies: movieDetails });
  } catch (error: unknown) {
    console.error("Error:", error);
    if (error instanceof Error) {
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    } else {
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "An unknown error occurred" });
    }
  }
};

// Controller to get movies by their IDs
export const getMoviesByIds = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }

    // Check if ids parameter exists in the query
    if (!req.query.ids || typeof req.query.ids !== "string") {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ error: "IDs parameter is missing or not a string" });
    }

    // Extract movie IDs from request parameters
    const movieIds = (req.query.ids as string).split(",");
    const movieDetails = await fetchMovieDetails(movieIds, user);

    res.status(HTTP_OK).json(movieDetails);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
