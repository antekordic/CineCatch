"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchedMovies: [{ movieId: String, rating: Number }],
    watchLaterMovies: [{ type: String }],
    currentPage: { type: Number, default: 1 },
    movieIndex: { type: Number, default: 0 },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
exports.UserModel = (0, mongoose_1.model)("User", userSchema);
