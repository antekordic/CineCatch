import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import {
  LoginDTO,
  RegisterDTO,
  TokenResponseDTO,
  AddToWatchedMovieDTO,
  AddToWatchLaterMovieDTO,
  UpdateWatchedMovieRatingDTO,
} from "../../../shared/dtos/user.dto";
import {
  HTTP_UNAUTHORIZED,
  HTTP_FORBIDDEN,
  HTTP_INTERNAL_SERVER_ERROR,
  HTTP_CONFLICT,
  HTTP_NOT_FOUND,
  HTTP_NO_CONTENT,
  HTTP_BAD_REQUEST,
  HTTP_OK,
  HTTP_CREATED,
} from "../constants/http_status";
import { AuthRequest } from "../middleware/auth.middleware";

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: RegisterDTO = req.body;
    const existingUser = await UserModel.findOne({ email });

    // Check if the user already exists
    if (existingUser) {
      return res
        .status(HTTP_FORBIDDEN)
        .json({ error: "User already exists, please login!" });
    }

    // Encrypt the user's password and create a new user
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password: encryptedPassword,
      watchedMovies: [],
      watchLaterMovies: [],
    });

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" }
    );

    const tokenResponse: TokenResponseDTO = {
      id: newUser.id,
      email: newUser.email,
      token,
    };

    // Send the token as the response
    res.status(HTTP_CREATED).json(tokenResponse);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Login an existing user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginDTO = req.body;
    const user = await UserModel.findOne({ email });

    // Validate the user's password
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "30d" }
      );

      const tokenResponse: TokenResponseDTO = {
        id: user.id,
        email: user.email,
        token,
      };

      // Send the token as the response
      res.status(HTTP_OK).json(tokenResponse);
    } else {
      res
        .status(HTTP_UNAUTHORIZED)
        .json({ error: "Username or password is invalid!" });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Add a movie to the watched list
export const addToWatched = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId, rating }: AddToWatchedMovieDTO = req.body;
    const user = await UserModel.findById(req.user!.id);

    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }

    // Check if the movie is already in the watched list
    const existingMovie = user.watchedMovies.find(
      (movie) => movie.movieId === movieId
    );
    if (existingMovie) {
      return res
        .status(HTTP_FORBIDDEN)
        .json({ error: "Movie ID already exists in the watched list" });
    }

    // Add the movie to the watched list
    const newMovie = { movieId, rating };
    user.watchedMovies.push(newMovie);
    await user.save();

    res.status(HTTP_CREATED).json({
      success: true,
      message: "Movie ID added to watched list successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Add a movie to the watch later list
export const addToWatchLater = async (req: AuthRequest, res: Response) => {
  try {
    const { movieId }: AddToWatchLaterMovieDTO = req.body;
    const user = await UserModel.findById(req.user!.id);

    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }

    // Check if the movie is already in the watch later list
    if (user.watchLaterMovies.includes(movieId)) {
      return res
        .status(HTTP_CONFLICT)
        .json({ error: "Movie ID already exists in the watch later list" });
    }

    // Add the movie to the watch later list
    user.watchLaterMovies.push(movieId);
    await user.save();

    res.status(HTTP_CREATED).json({
      success: true,
      message: "Movie ID added to watch later list successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Get all watched IDs for the authenticated user
export const getWatchedIDs = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }
    res.status(HTTP_OK).json(user.watchedMovies);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Get all watch later IDs for the authenticated user
export const getWatchLaterIDs = async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }
    res.status(HTTP_OK).json(user.watchLaterMovies);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Update the rating for a movie in the watched list
export const updateWatchedMovieRating = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { movieId, rating }: UpdateWatchedMovieRatingDTO = req.body;
    const user = await UserModel.findById(req.user!.id);

    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }

    // Find the movie in the watched list
    const movie = user.watchedMovies.find((movie) => movie.movieId === movieId);

    if (!movie) {
      return res
        .status(HTTP_NOT_FOUND)
        .json({ error: "Movie not found in the watched list" });
    }

    // Update the movie rating
    movie.rating = rating;
    await user.save();

    res.status(HTTP_OK).json({
      success: true,
      message: "Movie rating updated successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Delete a movie from the watched list
export const deleteWatchedMovie = async (req: AuthRequest & { params: { movieId: string } }, res: Response) => {
  try {
    const { movieId }: { movieId: string } = req.params;
    const user = await UserModel.findById(req.user!.id);

    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }

    // Find the movie in the watched list
    const index = user.watchedMovies.findIndex(
      (movie) => movie.movieId === movieId
    );
    if (index === -1) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ error: "Movie not found in the watched list" });
    }

    // Remove the movie from the watched list
    user.watchedMovies.splice(index, 1);
    await user.save();

    res.status(HTTP_OK).json({
      success: true,
      message: "Movie removed from watched list successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};

// Delete a movie from the watch later list
export const deleteWatchLaterMovie = async (
    req: AuthRequest & { params: { movieId: string } },
    res: Response
) => {
  try {
    const { movieId }: { movieId: string } = req.params;
    const user = await UserModel.findById(req.user!.id);

    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }

    // Find the movie in the watch later list
    const index = user.watchLaterMovies.indexOf(movieId);
    if (index === -1) {
      return res
        .status(HTTP_BAD_REQUEST)
        .json({ error: "Movie not found in the watch later list" });
    }

    // Remove the movie from the watch later list
    user.watchLaterMovies.splice(index, 1);
    await user.save();

    res.status(HTTP_OK).json({
      success: true,
      message: "Movie removed from watch later list successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(HTTP_INTERNAL_SERVER_ERROR)
      .json({ error: "Internal Server Error" });
  }
};
