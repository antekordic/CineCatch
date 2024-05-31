import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import {
  HTTP_UNAUTHORIZED,
  HTTP_FORBIDDEN,
  HTTP_OK,
} from "../constants/http_status";
import dotenv from "dotenv";
dotenv.config();

// Extending the Request interface to include user information
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

// Middleware to authenticate JWT tokens
export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // If no token is provided, return an unauthorized error
  if (!token) {
    return res.status(HTTP_UNAUTHORIZED).json({ error: "Unauthorized" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    // Find the user associated with the token
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(HTTP_FORBIDDEN).json({ error: "User not found" });
    }

    // Attach the user information to the request object
    req.user = { id: user.id, email: user.email };

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // If token verification fails, return an unauthorized error
    res.status(HTTP_UNAUTHORIZED).json({ error: "Invalid token" });
  }
};
