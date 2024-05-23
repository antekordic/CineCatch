import dotenv from "dotenv";
dotenv.config();

//TODO: delete in production
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Add this line to check

import express from "express";
import cors from "cors";
import movieRouter from "./routers/movie.router";
import userRouter from "./routers/user.router";
import { dbConnect, sessionMiddleware } from "./configs/database.config";

// Connect to the database
dbConnect();

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

// Use the session middleware
app.use(sessionMiddleware);

app.use("/api/movies", movieRouter);
app.use("/api/users", userRouter);

const port = process.env.PORT || 4201;
app.listen(port, () => {
  console.log(`Website served on http://localhost:${port}`);
});

//Nodemon.json -> stoppt das restarten des Servers bei änderungen des data ordners, kann bei problemen gelöscht werden