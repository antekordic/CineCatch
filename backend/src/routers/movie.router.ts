import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import {
  getNextPopularMovie,
  searchMovies,
  getWatchLaterMovies,
  getWatchedMovies,
  getMoviesByIds,
} from "../controllers/movie.controller";

const router = Router();

router.get("/popularMovies/next", authenticateJWT, getNextPopularMovie); // Get the next popular movie based on current page and index
router.get("/search", authenticateJWT, searchMovies); // Search for movies based on a query parameter
router.get("/getWatchLaterMovies", authenticateJWT, getWatchLaterMovies); // Get all movies marked as watch later by the user
router.get("/getWatchedMovies", authenticateJWT, getWatchedMovies); // Get all movies marked as watched by the user
router.get("/", authenticateJWT, getMoviesByIds); // Fetch detailed information for movies by their IDs

export default router;
