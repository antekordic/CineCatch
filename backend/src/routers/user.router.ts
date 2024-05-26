import { Router } from "express";
import {
  registerUser,
  loginUser,
  addToWatched,
  addToWatchLater,
  getWatchedIDs,
  getWatchLaterIDs,
  updateWatchedMovieRating,
  deleteWatchedMovie,
  deleteWatchLaterMovie,
} from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

// User registration and login
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login an existing user

// Watched movies
router.post("/watched", authenticateJWT, addToWatched); // Add movie to watched list
router.put("/watched/rating", authenticateJWT, updateWatchedMovieRating); // Update rating of a watched movie
router.get("/watchedIds", authenticateJWT, getWatchedIDs); // Get all watch later Ids (to get Movies, see to movie.router.ts)
router.delete("/watched", authenticateJWT, deleteWatchedMovie); // Remove movie from watched list

// Watch later movies
router.post("/watchLater", authenticateJWT, addToWatchLater); // Add movie to watch later list
router.get("/watchLaterIds", authenticateJWT, getWatchLaterIDs); // Get all watch later Ids (to get Movies, see to movie.router.ts)
router.delete("/watchLater", authenticateJWT, deleteWatchLaterMovie); // Remove movie from watch later list

export default router;
