import { Schema, model, Document } from "mongoose";

export interface User {
  email: string;
  password: string;
  watchedMovies: Array<{ movieId: string; rating?: number }>;
  watchLaterMovies: string[];
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  watchedMovies: Array<{ movieId: string; rating?: number }>;
  watchLaterMovies: string[];
}

const userSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchedMovies: [{ movieId: String, rating: Number }],
    watchLaterMovies: [{ type: String }],
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
