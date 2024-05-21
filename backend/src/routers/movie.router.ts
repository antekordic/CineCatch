import { Router, Request, Response } from "express";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

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
      return res.status(401).json({ error: "Unauthorized" });
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
          Authorization: process.env.TMDB_API_KEY!, // Corrected the Authorization header format
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
          return res.status(404).json({ error: "No movies found" });
        }
      } catch (error) {
        console.error("Error fetching popular movies:", error);
        return res.status(500).json({ error: "Internal Server Error" });
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
      return res.status(400).json({ error: "Query parameter is missing" });
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
    res.status(500).json({ error: "Internal Server Error" });
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
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// requires a current json -> execute the user route savewatchedMovies beforehand
// Sends “watched” movies from the user json to tmdb and outputs the response. Title, release date, original language, and genre as map
router.get("/fetchWatchedMovies/:email", async (req, res) => {
  const { email } = req.params;
  const filePath = path.join(__dirname, `../data/${email}-watched.json`);

  try {
    const watchedMovies: string[] = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );
    const movieDetails = await fetchMovieDetails(watchedMovies);
    res.json({ success: true, email, movies: movieDetails });
  } catch (error: unknown) {
    console.error("Error fetching movie details:", error);
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, message: "An unknown error occurred" });
    }
  }
});

// requires a current json -> execute the user route savewatchLater beforehand
// Sends "watchLaterMovies" movies from the user json to tmdb and outputs the response. Title, release date, original language, and genre as map
router.get("/fetchWatchLaterMovies/:email", async (req, res) => {
  const { email } = req.params;
  const filePath = path.join(__dirname, `../data/${email}-watchLater.json`);

  try {
    const watchLaterMovies: string[] = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );
    const movieDetails = await fetchMovieDetails(watchLaterMovies);
    res.json({ success: true, email, movies: movieDetails });
  } catch (error: unknown) {
    console.error("Error fetching movie details:", error);
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res
        .status(500)
        .json({ success: false, message: "An unknown error occurred" });
    }
  }
});

export default router;

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
        //if required, the queried id can be returned again for better allocation
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
