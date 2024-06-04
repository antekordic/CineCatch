"use strict";
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
exports.deleteWatchLaterMovie = exports.deleteWatchedMovie = exports.updateWatchedMovieRating = exports.getWatchLaterIDs = exports.getWatchedIDs = exports.addToWatchLater = exports.addToWatched = exports.loginUser = exports.registerUser = void 0;
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var user_model_1 = require("../models/user.model");
var http_status_1 = require("../constants/http_status");
// Register a new user
var registerUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, existingUser, encryptedPassword, newUser, token, tokenResponse, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_model_1.UserModel.findOne({ email: email })];
            case 1:
                existingUser = _b.sent();
                // Check if the user already exists
                if (existingUser) {
                    return [2 /*return*/, res
                            .status(http_status_1.HTTP_FORBIDDEN)
                            .json({ error: "User already exists, please login!" })];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                encryptedPassword = _b.sent();
                return [4 /*yield*/, user_model_1.UserModel.create({
                        email: email.toLowerCase(),
                        password: encryptedPassword,
                        watchedMovies: [],
                        watchLaterMovies: [],
                    })];
            case 3:
                newUser = _b.sent();
                token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: "30d" });
                tokenResponse = {
                    id: newUser.id,
                    email: newUser.email,
                    token: token,
                };
                // Send the token as the response
                res.status(http_status_1.HTTP_CREATED).json(tokenResponse);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                console.error("Error:", error_1);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.registerUser = registerUser;
// Login an existing user
var loginUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, _b, token, tokenResponse, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, user_model_1.UserModel.findOne({ email: email })];
            case 1:
                user = _c.sent();
                _b = user;
                if (!_b) return [3 /*break*/, 3];
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                _b = (_c.sent());
                _c.label = 3;
            case 3:
                // Validate the user's password
                if (_b) {
                    token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "30d" });
                    tokenResponse = {
                        id: user.id,
                        email: user.email,
                        token: token,
                    };
                    // Send the token as the response
                    res.status(http_status_1.HTTP_OK).json(tokenResponse);
                }
                else {
                    res
                        .status(http_status_1.HTTP_UNAUTHORIZED)
                        .json({ error: "Username or password is invalid!" });
                }
                return [3 /*break*/, 5];
            case 4:
                error_2 = _c.sent();
                console.error("Error:", error_2);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.loginUser = loginUser;
// Add a movie to the watched list
var addToWatched = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, movieId_1, rating, user, existingMovie, newMovie, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, movieId_1 = _a.movieId, rating = _a.rating;
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_FORBIDDEN).json({ error: "User not found" })];
                }
                existingMovie = user.watchedMovies.find(function (movie) { return movie.movieId === movieId_1; });
                if (existingMovie) {
                    return [2 /*return*/, res
                            .status(http_status_1.HTTP_FORBIDDEN)
                            .json({ error: "Movie ID already exists in the watched list" })];
                }
                newMovie = { movieId: movieId_1, rating: rating };
                user.watchedMovies.push(newMovie);
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                res.status(http_status_1.HTTP_CREATED).json({
                    success: true,
                    message: "Movie ID added to watched list successfully",
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _b.sent();
                console.error("Error:", error_3);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addToWatched = addToWatched;
// Add a movie to the watch later list
var addToWatchLater = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var movieId, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                movieId = req.body.movieId;
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_FORBIDDEN).json({ error: "User not found" })];
                }
                // Check if the movie is already in the watch later list
                if (user.watchLaterMovies.includes(movieId)) {
                    return [2 /*return*/, res
                            .status(http_status_1.HTTP_CONFLICT)
                            .json({ error: "Movie ID already exists in the watch later list" })];
                }
                // Add the movie to the watch later list
                user.watchLaterMovies.push(movieId);
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.status(http_status_1.HTTP_CREATED).json({
                    success: true,
                    message: "Movie ID added to watch later list successfully",
                });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error("Error:", error_4);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.addToWatchLater = addToWatchLater;
// Get all watched IDs for the authenticated user
var getWatchedIDs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_FORBIDDEN).json({ error: "User not found" })];
                }
                res.status(http_status_1.HTTP_OK).json(user.watchedMovies);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error("Error:", error_5);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getWatchedIDs = getWatchedIDs;
// Get all watch later IDs for the authenticated user
var getWatchLaterIDs = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_FORBIDDEN).json({ error: "User not found" })];
                }
                res.status(http_status_1.HTTP_OK).json(user.watchLaterMovies);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error("Error:", error_6);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getWatchLaterIDs = getWatchLaterIDs;
// Update the rating for a movie in the watched list
var updateWatchedMovieRating = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, movieId_2, rating, user, movie, error_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, movieId_2 = _a.movieId, rating = _a.rating;
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_FORBIDDEN).json({ error: "User not found" })];
                }
                movie = user.watchedMovies.find(function (movie) { return movie.movieId === movieId_2; });
                if (!movie) {
                    return [2 /*return*/, res
                            .status(http_status_1.HTTP_NOT_FOUND)
                            .json({ error: "Movie not found in the watched list" })];
                }
                // Update the movie rating
                movie.rating = rating;
                return [4 /*yield*/, user.save()];
            case 2:
                _b.sent();
                res.status(http_status_1.HTTP_OK).json({
                    success: true,
                    message: "Movie rating updated successfully",
                });
                return [3 /*break*/, 4];
            case 3:
                error_7 = _b.sent();
                console.error("Error:", error_7);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateWatchedMovieRating = updateWatchedMovieRating;
// Delete a movie from the watched list
var deleteWatchedMovie = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var movieId_3, user, index, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                movieId_3 = req.params.movieId;
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_FORBIDDEN).json({ error: "User not found" })];
                }
                index = user.watchedMovies.findIndex(function (movie) { return movie.movieId === movieId_3; });
                if (index === -1) {
                    return [2 /*return*/, res
                            .status(http_status_1.HTTP_BAD_REQUEST)
                            .json({ error: "Movie not found in the watched list" })];
                }
                // Remove the movie from the watched list
                user.watchedMovies.splice(index, 1);
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.status(http_status_1.HTTP_OK).json({
                    success: true,
                    message: "Movie removed from watched list successfully",
                });
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                console.error("Error:", error_8);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteWatchedMovie = deleteWatchedMovie;
// Delete a movie from the watch later list
var deleteWatchLaterMovie = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var movieId, user, index, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                movieId = req.params.movieId;
                return [4 /*yield*/, user_model_1.UserModel.findById(req.user.id)];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(http_status_1.HTTP_FORBIDDEN).json({ error: "User not found" })];
                }
                index = user.watchLaterMovies.indexOf(movieId);
                if (index === -1) {
                    return [2 /*return*/, res
                            .status(http_status_1.HTTP_BAD_REQUEST)
                            .json({ error: "Movie not found in the watch later list" })];
                }
                // Remove the movie from the watch later list
                user.watchLaterMovies.splice(index, 1);
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.status(http_status_1.HTTP_OK).json({
                    success: true,
                    message: "Movie removed from watch later list successfully",
                });
                return [3 /*break*/, 4];
            case 3:
                error_9 = _a.sent();
                console.error("Error:", error_9);
                res
                    .status(http_status_1.HTTP_INTERNAL_SERVER_ERROR)
                    .json({ error: "Internal Server Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteWatchLaterMovie = deleteWatchLaterMovie;
