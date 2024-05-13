import { Router } from "express";
import { sample_movies } from "../data";
// import asynceHandler from 'express-async-handler';
// import { isMethodDeclaration } from "typescript";
import fetch from "node-fetch";

const router = Router();

let currentPage = 1;
let movieIndex = 0;
let movies: string | any[] = [];

router.get("/popular-movies/next", async (req, res) => {
  // If there are no movies left in the current page, fetch the next page
  if (movieIndex >= movies.length) {
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=true&include_video=false&language=en-US&page=${currentPage}&sort_by=popularity.desc`;
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

router.get("/:movieId", async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&append_to_response=videos`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: process.env.TMDB_API_KEY!,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;

// router.get('/top-rated-movies/next', async (req, res) => {
//   // If there are no movies left in the current page, fetch the next page
//   if (movieIndex >= movies.length) {

//     const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${currentPage}`;
//     const options = {
//       method: 'GET',
//       headers: {
//         accept: 'application/json',
//         Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiNzkyNDdmZGI3NGQwZjA3ZWJkMDY5NjgxMDE4N2Y2OSIsInN1YiI6IjY1Y2E4YzY1YTIyZDNlMDE3YjRmYmJjYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Go81zEmCmVngHKLDR-qAGW2SBzDbAYBE54Nwoqa2oWg'
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
