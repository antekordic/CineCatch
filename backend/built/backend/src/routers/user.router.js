"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var user_controller_1 = require("../controllers/user.controller");
var auth_middleware_1 = require("../middleware/auth.middleware");
var router = (0, express_1.Router)();
// User registration and login
router.post("/register", user_controller_1.registerUser); // Register a new user
router.post("/login", user_controller_1.loginUser); // Login an existing user
// Watched movies
router.post("/watched", auth_middleware_1.authenticateJWT, user_controller_1.addToWatched); // Add movie to watched list
router.put("/watched/rating", auth_middleware_1.authenticateJWT, user_controller_1.updateWatchedMovieRating); // Update rating of a watched movie
router.get("/watchedIds", auth_middleware_1.authenticateJWT, user_controller_1.getWatchedIDs); // Get all watch later Ids (to get Movies, see to movie.router.ts)
router.delete("/watched/:movieId", auth_middleware_1.authenticateJWT, user_controller_1.deleteWatchedMovie); // Remove movie from watched list
// Watch later movies
router.post("/watchLater", auth_middleware_1.authenticateJWT, user_controller_1.addToWatchLater); // Add movie to watch later list
router.get("/watchLaterIds", auth_middleware_1.authenticateJWT, user_controller_1.getWatchLaterIDs); // Get all watch later Ids (to get Movies, see to movie.router.ts)
router.delete("/watchLater/:movieId", auth_middleware_1.authenticateJWT, user_controller_1.deleteWatchLaterMovie); // Remove movie from watch later list
exports.default = router;
