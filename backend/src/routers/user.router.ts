import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { LoginDTO, RegisterDTO, TokenResponseDTO } from "../dtos/user.dto";

const router = Router();

// router.get(
//   "/seed",
//   asyncHandler(async (req, res) => {
//     const usersCount = await UserModel.countDocuments();
//     if (usersCount > 0) {
//       res.send("Seed is already done!");
//       return;
//     }

//     await UserModel.create(sample_users);
//     res.send("Seed Is Done!");
//   })
// );

router.post(
  "/login",
  asyncHandler(async (req: Request & { session: any }, res: Response) => {
    const { email, password }: LoginDTO = req.body;
    const user = await UserModel.findOne({ email });

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
      req.session.userId = user.id; // Save user ID in session
      res.json(tokenResponse);
    } else {
      res.status(400).json({ error: "Username or password is invalid!" });
    }
  })
);

router.post(
  "/register",
  asyncHandler(async (req: Request & { session: any }, res: Response) => {
    const { email, password }: RegisterDTO = req.body;
    const user = await UserModel.findOne({ email });

    if (user) {
      res.status(400).json({ error: "User already exists, please login!" });
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      password: encryptedPassword,
      watchedMovies: [],
      watchLaterMovies: [],
    });

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

    req.session.userId = newUser.id; // Save user ID in session
    res.json(tokenResponse);
  })
);

// Define a route for adding movie IDs to the user's watched list
router.post("/watched", async (req, res) => {
  try {
    const { email, movieId, rating } = req.body;

    // Find the user by email
    let user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the movie ID already exists in the watched list
    const existingMovie = user.watchedMovies.find(
      (movie) => movie.movieId === movieId
    );
    if (existingMovie) {
      return res
        .status(400)
        .json({ error: "Movie ID already exists in the watched list" });
    }

    // Add the movie ID and rating to the watched list and save the user
    const newMovie: { movieId: string; rating?: number } = { movieId }; // Define newMovie with optional rating
    if (rating !== undefined) {
      newMovie.rating = rating;
    }
    user.watchedMovies.push(newMovie);
    await user.save();

    res.json({
      success: true,
      message: "Movie ID added to watched list successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for updating the rating of a watched movie
router.put("/watched", async (req, res) => {
  try {
    const { email, movieId, rating } = req.body;

    // Find the user by email
    let user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the movie in the watched list
    const movieIndex = user.watchedMovies.findIndex(
      (movie) => movie.movieId === movieId
    );
    if (movieIndex === -1) {
      return res
        .status(404)
        .json({ error: "Movie not found in the watched list" });
    }

    // Update the rating of the movie and save the user
    user.watchedMovies[movieIndex].rating = rating;
    await user.save();

    res.json({ success: true, message: "Rating updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a route for adding movie IDs to the user's watch later list
router.post("/watchLater", async (req, res) => {
  try {
    const { email, movieId } = req.body;

    // Find the user by email
    let user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the movie ID already exists in the watch later list
    if (user.watchLaterMovies.includes(movieId)) {
      return res
        .status(400)
        .json({ error: "Movie ID already exists in the watch later list" });
    }

    // Add the movie ID to the watch later list and save the user
    user.watchLaterMovies.push(movieId);
    await user.save();

    res.json({
      success: true,
      message: "Movie ID added to watch later list successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for deleting a watched movie from the list
router.delete("/watched", async (req, res) => {
  try {
    const { email, movieId } = req.body;

    // Find the user by email
    let user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the movie in the watched list
    const index = user.watchedMovies.findIndex(
      (movie) => movie.movieId === movieId
    );
    if (index === -1) {
      return res
        .status(404)
        .json({ error: "Movie not found in the watched list" });
    }

    // Remove the movie from the watched list and save the user
    user.watchedMovies.splice(index, 1);
    await user.save();

    res.json({
      success: true,
      message: "Movie removed from watched list successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route for deleting a watch later movie
router.delete("/watchLater", async (req, res) => {
  try {
    const { email, movieId } = req.body;

    // Find the user by email
    let user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the index of the movie in the watch later list
    const index = user.watchLaterMovies.indexOf(movieId);
    if (index === -1) {
      return res
        .status(404)
        .json({ error: "Movie not found in the watch later list" });
    }

    // Remove the movie from the watch later list and save the user
    user.watchLaterMovies.splice(index, 1);
    await user.save();

    res.json({
      success: true,
      message: "Movie removed from watch later list successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Alternative to Redis, caching in jason:

// Help function for saving data in a file
const saveDataToFile = (filename: string, data: any) => {
  const filePath = path.join(__dirname, "..", "data", filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

// Help function for loading data from a file
const loadDataFromFile = (filename: string) => {
  const filePath = path.join(__dirname, "..", "data", filename);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  }
  return null;
};

/*alt
// Route to save watched movie IDs to a JSON file
router.post("/savewatchedMovies", async (req, res) => {
  try {
    const { email } = req.body;
    // Find the user by email
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Extract watched movie IDs
    const watchedMovieIds = user.watchedMovies.map((movie) => movie.movieId);
    // Save to JSON file
    const filePath = path.join(__dirname, `../data/${email}-watched.json`);
    fs.writeFileSync(
      filePath,
      JSON.stringify(watchedMovieIds, null, 2),
      "utf8"
    );
    res.json({
      success: true,
      message: "Watched movie IDs saved to JSON file",
      filePath: filePath,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to save watch later movie IDs to a JSON file
router.post("/savewatchLaterMovies", async (req, res) => {
  try {
    const { email } = req.body;
    // Find the user by email
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Extract watch later movie IDs
    const watchLaterMovieIds = user.watchLaterMovies;
    // Save to JSON file
    const filePath = path.join(__dirname, `../data/${email}-watchLater.json`);
    fs.writeFileSync(
      filePath,
      JSON.stringify(watchLaterMovieIds, null, 2),
      "utf8"
    );
    res.json({
      success: true,
      message: "Watch later movie IDs saved to JSON file",
      filePath: filePath,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

V2 -> funktioniert über Postman

export async function saveWatchedMovies(req: Request, res: Response): Promise<void> {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
  }
  const watchedMovieIds = user.watchedMovies.map((movie) => movie.movieId);
  const filePath = path.join(__dirname, `../data/${email}-watched.json`);
  fs.writeFileSync(filePath, JSON.stringify(watchedMovieIds, null, 2), "utf8");
  res.json({
      success: true,
      message: "Watched movie IDs saved to JSON file",
      filePath: filePath,
  });
}

export async function saveWatchLaterMovies(req: Request, res: Response): Promise<void> {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
  }
  const watchLaterMovieIds = user.watchLaterMovies;
  const filePath = path.join(__dirname, `../data/${email}-watchLater.json`);
  fs.writeFileSync(filePath, JSON.stringify(watchLaterMovieIds, null, 2), "utf8");
  res.json({
      success: true,
      message: "Watch later movie IDs saved to JSON file",
      filePath: filePath,
  });
}
*/

export async function saveWatchedMovies(req: Request, res: Response): Promise<string[]> {
  const { email } = req.body;  // Get email from request body
  const user = await UserModel.findOne({ email: email });
  if (!user) {
      throw new Error("User not found");
  }
  const watchedMovieIds = user.watchedMovies.map((movie) => movie.movieId);
  const filePath = path.join(__dirname, `../data/${email}-watched.json`);
  fs.writeFileSync(filePath, JSON.stringify(watchedMovieIds, null, 2), "utf8");
  return watchedMovieIds;
}

export async function saveWatchLaterMovies(req: Request, res: Response): Promise<string[]> {
  const { email } = req.body;  // Get email from request body
  const user = await UserModel.findOne({ email: email });
  if (!user) {
      throw new Error("User not found");
  }
  const watchLaterMovieIds = user.watchLaterMovies;
  const filePath = path.join(__dirname, `../data/${email}-watchLater.json`);
  fs.writeFileSync(filePath, JSON.stringify(watchLaterMovieIds, null, 2), "utf8");
  return watchLaterMovieIds;
}
//router.post("/savewatchedMovies", asyncHandler(saveWatchedMovies));
//router.post("/savewatchLaterMovies", asyncHandler(saveWatchLaterMovies));

export default router;
