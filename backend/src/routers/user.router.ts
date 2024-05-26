import { Router } from "express";
import {
  registerUser,
  loginUser,
  addToWatched,
  addToWatchLater,
  getWatchedMovies,
  getWatchLaterMovies,
  updateWatchedMovieRating,
  deleteWatchedMovie,
  deleteWatchLaterMovie,
} from "../controllers/user.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/watched", authenticateJWT, addToWatched);
router.post("/watchlater", authenticateJWT, addToWatchLater);
router.get("/watched", authenticateJWT, getWatchedMovies);
router.get("/watchlater", authenticateJWT, getWatchLaterMovies);
router.put("/watched/rating", authenticateJWT, updateWatchedMovieRating);
router.delete("/watched", authenticateJWT, deleteWatchedMovie);
router.delete("/watchlater", authenticateJWT, deleteWatchLaterMovie);

export default router;
