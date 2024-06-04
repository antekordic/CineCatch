"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMoviesByIds = exports.getWatchedMovies = exports.getWatchLaterMovies = exports.searchMovies = exports.getNextPopularMovie = exports.addUserContext = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var user_model_1 = require("../models/user.model");
var http_status_1 = require("../constants/http_status");
// Function to fetch movie details from TMDB
var fetchMovieDetails = function (movieIds, user) { return __awaiter(void 0, void 0, void 0, function () {
    var movieDetails;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Promise.all(movieIds.map(function (movieId) { return __awaiter(void 0, void 0, void 0, function () {
                    var url, options, response, data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                url = "https://api.themoviedb.org/3/movie/".concat(movieId, "?language=en-US&append_to_response=videos,images&api_key=").concat(process.env.TMDB_API_KEY);
                                options = {
                                    method: "GET",
                                    headers: {
                                        accept: "application/json",
                                        Authorization: "Bearer ".concat(process.env.TMDB_AUTH_TOKEN),
                                    },
                                };
                                return [4 /*yield*/, (0, node_fetch_1.default)(url, options)];
                            case 1:
                                response = _a.sent();
                                if (!response.ok) {
                                    console.error("Failed to fetch data for movieId: ".concat(movieId));
                                    return [2 /*return*/, null];
                                }
                                return [4 /*yield*/, response.json()];
                            case 2:
                                data = _a.sent();
                                // Filter only trailer videos
                                data.videos.results = data.videos.results.filter(function (video) { return video.type === "Trailer"; });
                                return [2 /*return*/, data];
                        }
                    });
                }); }))];
            case 1:
                movieDetails = _a.sent();
                // Filter out any null values
                return [2 /*return*/, Promise.all(movieDetails.filter(function (movie) { return movie !== null; }).map(function (movie) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (!user) {
                                return [2 /*return*/, movie];
                            }
                            return [2 /*return*/, (0, exports.addUserContext)(movie, user)];
                        });
                    }); }))];
        }
    });
}); };
var addUserContext = function (movie, user) { return __awaiter(void 0, void 0, void 0, function () {
    var watched, watchLater, rating;
    var _a;
    return __generator(this, function (_b) {
        watched = !!user.watchedMovies.find(function (_a) {
            var movieId = _a.movieId;
            return movieId === movie.id.toString();
        });
        watchLater = !!user.watchLaterMovies.find(function (watchLaterMovieId) { return watchLaterMovieId === movie.id.toString(); });
        rating = ((_a = user.watchedMovies.find(function (_a) {
            var movieId = _a.movieId;
            return movieId === movie.id.toString();
        })) === null || _a === void 0 ? void 0 : _a.rating) || 0;
        return [2 /*return*/, __assign(__assign({}, movie), { user: {
                    watched: watched,
                    watchLater: watchLater,
                    rating: rating
                } })];
    });
}); };
exports.addUserContext = addUserContext;
// Controller to get the next popular movie for a user
var getNextPopularMovie = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, currentPage, movieIndex, url, options, response, data, nextMovie, detailedMovie, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_BAD_REQUEST).json({ error: "User not found" })];
                }
                currentPage = user.currentPage || 1;
                movieIndex = user.movieIndex || 0;
                url = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=".concat(currentPage, "&sort_by=popularity.desc&api_key=").concat(process.env.TMDB_API_KEY);
                options = {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        Authorization: "Bearer ".concat(process.env.TMDB_AUTH_TOKEN),
                    },
                };
                return [4 /*yield*/, (0, node_fetch_1.default)(url, options)];
            case 2:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                data = _a.sent();
                if (!data.results || data.results.length === 0) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_NO_CONTENT).json({ error: "No movies found" })];
                }
                nextMovie = data.results[movieIndex];
                return [4 /*yield*/, fetchMovieDetails([nextMovie.id.toString()], user)];
            case 4:
                detailedMovie = _a.sent();
                // Update user data
                user.currentPage =
                    movieIndex >= data.results.length - 1 ? currentPage + 1 : currentPage;
                user.movieIndex = (movieIndex + 1) % data.results.length;
                return [4 /*yield*/, user.save()];
            case 5:
                _a.sent();
                res.status(http_status_1.HTTP_OK).json(detailedMovie[0]); // Return the detailed movie information
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                console.error("Error fetching popular movies:", error_1);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getNextPopularMovie = getNextPopularMovie;
// Controller to search movies by a query
var searchMovies = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, query, page, url, options, response, data, movies, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_BAD_REQUEST).json({ error: "User not found" })];
                }
                query = (_a = req.query.query) === null || _a === void 0 ? void 0 : _a.toString();
                page = req.query.page || 1;
                if (!query) {
                    return [2 /*return*/, res
                            .status(http_status_1.HTTP_BAD_REQUEST)
                            .json({ error: "Query parameter is missing" })];
                }
                url = "https://api.themoviedb.org/3/search/movie?query=".concat(encodeURIComponent(query), "&language=en-US&page=").concat(page, "&append_to_response=videos,images&api_key=").concat(process.env.TMDB_API_KEY);
                options = {
                    method: "GET",
                    headers: {
                        accept: "application/json",
                        Authorization: "Bearer ".concat(process.env.TMDB_AUTH_TOKEN),
                    },
                };
                return [4 /*yield*/, (0, node_fetch_1.default)(url, options)];
            case 2:
                response = _b.sent();
                return [4 /*yield*/, response.json()];
            case 3:
                data = _b.sent();
                return [4 /*yield*/, fetchMovieDetails((data.results || []).map(function (movie) { return movie.id.toString(); }), user)];
            case 4:
                movies = _b.sent();
                res.status(http_status_1.HTTP_OK).json(movies);
                return [3 /*break*/, 6];
            case 5:
                error_2 = _b.sent();
                console.error("Error:", error_2);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.searchMovies = searchMovies;
// Controller to fetch movies marked as watch later by the user
var getWatchLaterMovies = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, watchLaterMovieIds, movieDetails, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_FORBIDDEN).json({ error: "User not found" })];
                }
                watchLaterMovieIds = user.watchLaterMovies;
                return [4 /*yield*/, fetchMovieDetails(watchLaterMovieIds, user)];
            case 2:
                movieDetails = _a.sent();
                res.status(http_status_1.HTTP_OK).json({ success: true, movies: movieDetails });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error("Error:", error_3);
                if (error_3 instanceof Error) {
                    res
                        .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                        .json({ success: false, message: error_3.message });
                }
                else {
                    res
                        .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                        .json({ success: false, message: "An unknown error occurred" });
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getWatchLaterMovies = getWatchLaterMovies;
// Controller to fetch movies marked as watched by the user
var getWatchedMovies = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, watchedMovieIds, movieDetails, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_FORBIDDEN).json({ error: "User not found" })];
                }
                watchedMovieIds = user.watchedMovies.map(function (movie) { return movie.movieId; });
                return [4 /*yield*/, fetchMovieDetails(watchedMovieIds, user)];
            case 2:
                movieDetails = _a.sent();
                res.status(http_status_1.HTTP_OK).json({ success: true, movies: movieDetails });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Error:", error_4);
                if (error_4 instanceof Error) {
                    res
                        .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                        .json({ success: false, message: error_4.message });
                }
                else {
                    res
                        .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                        .json({ success: false, message: "An unknown error occurred" });
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getWatchedMovies = getWatchedMovies;
// Controller to get movies by their IDs
var getMoviesByIds = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, movieIds, movieDetails, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_FORBIDDEN).json({ error: "User not found" })];
                }
                // Check if ids parameter exists in the query
                if (!req.query.ids || typeof req.query.ids !== "string") {
                    return [2 /*return*/, res
                            .status(http_status_1.HTTP_BAD_REQUEST)
                            .json({ error: "IDs parameter is missing or not a string" })];
                }
                movieIds = req.query.ids.split(",");
                return [4 /*yield*/, fetchMovieDetails(movieIds, user)];
            case 2:
                movieDetails = _a.sent();
                res.status(http_status_1.HTTP_OK).json(movieDetails);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _a.sent();
                console.error("Error:", error_5);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getMoviesByIds = getMoviesByIds;
