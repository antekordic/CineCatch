import { connect, ConnectOptions } from "mongoose";
import session from "express-session";
import MongoStoreFactory from "connect-mongo";

export const dbConnect = () => {
  connect(process.env.MONGO_URI!, {} as ConnectOptions)
    .then(() => console.log("Database connected successfully"))
    .catch((error) => console.error("Database connection error:", error));
};

const MongoStore = MongoStoreFactory.create({
  mongoUrl: process.env.MONGO_URI!,
  collectionName: "sessions",
});

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "your-secret-key", // Replace with a strong secret key
  resave: false,
  saveUninitialized: false,
  store: MongoStore,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24,
  }, // 1 day
  // Use secure: true in production with HTTPS
});
