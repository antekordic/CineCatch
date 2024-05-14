import { Schema, model } from "mongoose";

export interface User {
  id: string;
  email: string;
  password: string;
  watchedMovies: Array<{ movieId: string; rating?: number }>;
  watchLaterMovies: string[];
}

export const UserSchema = new Schema<User>(
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

export const UserModel = model<User>("user", UserSchema);
