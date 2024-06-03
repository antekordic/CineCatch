import dotenv from "dotenv";
dotenv.config();

//TODO: delete in production
console.log("JWT_SECRET:", process.env.JWT_SECRET); // Add this line to check

import express from "express";
import path from "path";
import cors from "cors";
import movieRouter from "./routers/movie.router";
import userRouter from "./routers/user.router";
import { dbConnect } from "./configs/database.config";
import serverless from "serverless-http";

// Connect to the database
dbConnect();

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: ["http://localhost:4200"] }));

app.use("/api/movies", movieRouter);
app.use("/api/users", userRouter);

// Serve static files from the 'public/browser' directory
app.use(express.static(path.join(__dirname, "public", "browser")));

// Send all other requests to the Angular app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "browser", "index.html"));
});

const port = process.env.PORT || 4201;
app.listen(port, () => {
  console.log(`Website served on http://localhost:${port}`);
});

export const handler = serverless(app);

// import dotenv from "dotenv";
// dotenv.config();

// //TODO: delete in production
// console.log("JWT_SECRET:", process.env.JWT_SECRET); // Add this line to check

// import express from "express";
// import path from "path";
// import cors from "cors";
// import movieRouter from "./routers/movie.router";
// import userRouter from "./routers/user.router";
// import { dbConnect } from "./configs/database.config";

// // Connect to the database
// dbConnect();

// const app = express();
// app.use(express.json());
// app.use(cors({ credentials: true, origin: ["http://localhost:4200"] }));

// app.use("/api/movies", movieRouter);
// app.use("/api/users", userRouter);

// app.use(express.static("public"));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// const port = process.env.PORT || 4201;
// app.listen(port, () => {
//   console.log(`Website served on http://localhost:${port}`);
// });
