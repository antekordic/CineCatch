import { Router } from "express";
import { sample_movies } from "../data";
// import asynceHandler from 'express-async-handler';
// import { isMethodDeclaration } from "typescript";
import fetch from "node-fetch";

const router = Router();

let currentPage = 1;
let movieIndex = 0;
let movies: string | any[] = [];

// Get popular movies, to iterate like tinder, there are over 80 tousend movies in this API call
router.get("/popular-movies/next", async (req, res) => {
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
        return res.status(404).json({ error: "No movies found" });
      }
    } catch (error) {
      console.error("Error fetching top-rated movies:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Send the next movie to the frontend
  const nextMovie = movies[movieIndex];
  res.json(nextMovie);
  movieIndex++;
});

// Define a route for movie search
router.get("/search/:searchTerm", async (req, res) => {
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

export default router;

// // Get movie by ID
// router.get("/:movieId", async (req, res) => {
//   try {
//     const movieId = req.params.movieId;
//     const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&append_to_response=videos`;
//     const options = {
//       method: "GET",
//       headers: {
//         accept: "application/json",
//         Authorization: process.env.TMDB_API_KEY!,
//       },
//     };

//     const response = await fetch(url, options);
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

// router.get('/top-rated-movies/next', async (req, res) => {
//   // If there are no movies left in the current page, fetch the next page
//   if (movieIndex >= movies.length) {

//     const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`;
//     const options = {
//       method: 'GET',
//       headers: {
//         accept: 'application/json',
//         Authorization: Authorization: process.env.TMDB_API_KEY!,
//       }
//     };

//     try {
//       const response = await fetch(url, options);
//       const data = await response.json();

//       if (data.results && data.results.length > 0) {
//         movies = data.results;
//         movieIndex = 0;
//         currentPage++;
//       } else {
//         return res.status(404).json({ error: 'No movies found' });
//       }
//     } catch (error) {
//       console.error('Error fetching top-rated movies:', error);
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   }

//   // Send the next movie to the frontend
//   const nextMovie = movies[movieIndex];
//   res.json(nextMovie);
//   movieIndex++;
// });
