import { Schema, model, Document } from "mongoose";

export interface User {
  email: string;
  password: string;
  watchedMovies: Array<{ movieId: string; rating?: number }>;
  watchLaterMovies: string[];
  currentPage?: number;
  movieIndex?: number;
}

export interface UserDocument extends Document, User {}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchedMovies: [{ movieId: String, rating: Number }],
    watchLaterMovies: [{ type: String }],
    currentPage: { type: Number, default: 1 },
    movieIndex: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const UserModel = model<UserDocument>("User", userSchema);
