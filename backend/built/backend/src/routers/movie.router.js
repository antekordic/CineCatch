"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_middleware_1 = require("../middleware/auth.middleware");
var movie_controller_1 = require("../controllers/movie.controller");
var router = (0, express_1.Router)();
router.get("/popularMovies/next", auth_middleware_1.authenticateJWT, movie_controller_1.getNextPopularMovie); // Get the next popular movie based on current page and index
router.get("/search", auth_middleware_1.authenticateJWT, movie_controller_1.searchMovies); // Search for movies based on a query parameter
router.get("/getWatchLaterMovies", auth_middleware_1.authenticateJWT, movie_controller_1.getWatchLaterMovies); // Get all movies marked as watch later by the user
router.get("/getWatchedMovies", auth_middleware_1.authenticateJWT, movie_controller_1.getWatchedMovies); // Get all movies marked as watched by the user
router.get("/", auth_middleware_1.authenticateJWT, movie_controller_1.getMoviesByIds); // Fetch detailed information for movies by their IDs
exports.default = router;
