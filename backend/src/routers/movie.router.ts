import { Router } from "express";
import { authenticateJWT } from "../middleware/auth.middleware";
import {
  getNextPopularMovie,
  searchMovies,
  fetchWatchLaterMovies,
  fetchWatchedMovies,
  getMoviesByIds,
} from "../controllers/movie.controller";

const router = Router();

router.get("/popular-movies/next", authenticateJWT, getNextPopularMovie);
router.get("/search", authenticateJWT, searchMovies);
router.get("/fetchWatchLaterMovies", authenticateJWT, fetchWatchLaterMovies);
router.get("/fetchWatchedMovies", authenticateJWT, fetchWatchedMovies);
router.get("/", authenticateJWT, getMoviesByIds);

export default router;
