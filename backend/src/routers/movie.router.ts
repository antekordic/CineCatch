import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import {
  HTTP_NO_CONTENT,
  HTTP_BAD_REQUEST,
  HTTP_UNAUTHORIZED,
  HTTP_FORBIDDEN,
  HTTP_NOT_FOUND,
  HTTP_CONFLICT,
  HTTP_INTERNAL_SERVER_ERROR
} from "../constants/http_status";
import { saveWatchLaterMovies, saveWatchedMovies } from './user.router';

const router = Router();

router.get(
  "/popular-movies/next",
  async (
    req: Request & {
      session: {
        userId?: string;
        currentPage?: number;
        movieIndex?: number;
        movies?: any[];
      };
    },
    res: Response
  ) => {
    // Check if there is an active session
    if (!req.session.userId) {
      return res.status(HTTP_UNAUTHORIZED).json({ error: "Unauthorized" });
    }

    // Initialize session variables if they don't exist
    let currentPage = req.session.currentPage || 1;
    let movieIndex = req.session.movieIndex || 0;
    let movies = req.session.movies || [];

    // If there are no movies left in the current page, fetch the next page
    if (movieIndex >= movies.length) {
      const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: process.env.TMDB_API_KEY!,
        },
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          movies = data.results;
          movieIndex = 0;
          currentPage++;
        } else {
          return res.status(HTTP_NO_CONTENT).json({ error: "No movies found" });
        }
      } catch (error) {
        console.error("Error fetching popular movies:", error);
        return res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
      }
    }

    // Send the next movie to the frontend
    const nextMovie = movies[movieIndex];

    // Update session data before sending response
    movieIndex++;
    req.session.currentPage = currentPage;
    req.session.movieIndex = movieIndex;
    req.session.movies = movies;

    res.json(nextMovie);
  }
);

// Define a route for movie search
router.get("/search", async (req, res) => {
  try {
    const query = req.query.query?.toString(); // Ensure query is accessed as a string
    const page = req.query.page || 1; // Get the page number, default to 1 if not provided
    if (!query) {
      return res.status(HTTP_BAD_REQUEST).json({ error: "Query parameter is missing" });
    }

    // Build the URL for the search API
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
      query
    )}&language=en-US&page=${page}`;

    // Set up options for the fetch request
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.TMDB_API_KEY!,
      },
    };

    // Fetch data from TMDB API
    const response = await fetch(url, options);
    const data = await response.json();

    // Send the search results back to the client
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
});

// Get movies by IDs
router.get("/", async (req, res) => {
  try {
    // Check if ids parameter exists in the query
    if (!req.query.ids || typeof req.query.ids !== "string") {
      return res
        .status(400)
        .json({ error: "IDs parameter is missing or not a string" });
    }

    // Extract movie IDs from request parameters
    const movieIds = (req.query.ids as string).split(",");

    // Array to store movie data
    const moviesData = [];

    // Iterate over each movie ID
    for (const movieId of movieIds) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&append_to_response=videos`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: process.env.TMDB_API_KEY!,
        },
      };

      // Fetch movie data for the current ID
      const response = await fetch(url, options);
      const data = await response.json();

      // Add movie data to the array
      moviesData.push(data);
    }

    // Send back combined JSON response
    res.json(moviesData);
  } catch (error) {
    console.error("Error:", error);
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
  }
});

// calls savewatchlaterMovies first to save them using user.router function
router.post("/fetchWatchLaterMovies", async (req, res) => {
  try {
    const { email } = req.body;  // Get email from request body
    const watchLaterMovieIds = await saveWatchLaterMovies(req, res);
    const movieDetails = await fetchMovieDetails(watchLaterMovieIds);
    res.json({ success: true, email, movies: movieDetails });
  } catch (error: unknown) {
    console.error("Error:", error);
    if (error instanceof Error) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    } else {
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "An unknown error occurred" });
    }
  }
});

// calls save watchedMovies first to save them using user.router function
router.post("/fetchWatchedMovies", async (req, res) => {
  try {
    const { email } = req.body;  // Get email from request body
    const watchedMovieIds = await saveWatchedMovies(req, res);
    const movieDetails = await fetchMovieDetails(watchedMovieIds);
    res.json({ success: true, email, movies: movieDetails });
  } catch (error: unknown) {
    console.error("Error:", error);
    if (error instanceof Error) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
    } else {
      res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "An unknown error occurred" });
    }
  }
});


//sets the structure for genre
interface Genre {
  id: number;
  name: string;
}

// helper function for fetchWatchedMovies and fetchwatchLaterMovies -> performs the actual tmdb request and feedback. Can be used for more fetching usecases
async function fetchMovieDetails(movieIds: string[]) {
  return Promise.all(
    movieIds.map(async (movieId) => {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US`;
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: process.env.TMDB_API_KEY!,
        },
      };
      const response = await fetch(url, options);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.status_message || "Failed to fetch data from TMDB"
        );
      }
      return {
        //if required, the queried id can be returned again for better allocation (or the description)
        title: data.title,
        releaseDate: data.release_date,
        originalLanguage: data.original_language,
        genres: data.genres.map((genre: Genre) => ({
          id: genre.id,
          name: genre.name,
        })),
      };
    })
  );
}

export default router;
