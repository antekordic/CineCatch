import { connect, ConnectOptions } from "mongoose";

export const dbConnect = () => {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not defined in environment variables");
    process.exit(1);
  }

  connect(process.env.MONGO_URI, {} as ConnectOptions)
    .then(() => console.log("Database connected successfully"))
    .catch((error) => {
      console.error("Database connection error:", error);
      process.exit(1); // Exit the process with an error code
    });
};
