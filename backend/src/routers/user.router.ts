import { Router, Request, Response, NextFunction } from 'express';
import { sample_users } from '../data';
import { UserModel } from '../models/user.model';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { HTTP_BAD_REQUEST } from '../constants/http_status';

const router = Router();

router.get("/seed", asyncHandler(
  async (req, res) => {
    const usersCount = await UserModel.countDocuments();
    if (usersCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await UserModel.create(sample_users);
    res.send("Seed Is Done!");
  }
));

router.post("/login", asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json(generateTokenReponse(user));
      return; // Hinzugefügter Rückgabewert
    } else {
      res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
      return; // Hinzugefügter Rückgabewert
    }
  }
));

router.post('/register', asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { name, email, password, toWatch = [], watched = new Map() } = req.body;
    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      res.status(HTTP_BAD_REQUEST).send('User already exists, please login!');
      return; // Hinzugefügter Rückgabewert
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
      toWatch,
      watched
    });

    const dbUser = await newUser.save();
    res.json(generateTokenReponse(dbUser));
    return; // Hinzugefügter Rückgabewert
  }
));

router.get('/user/:userId/towatch', asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(HTTP_BAD_REQUEST).send('User not found!');
      return; // Rückgabe von void
    }

    res.send(user.toWatch);
    return; // Rückgabe von void
  }
));

router.get('/user/:userId/watched', asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);

    if (!user) {
      res.status(HTTP_BAD_REQUEST).send('User not found!');
      return; // Rückgabe von void
    }

    res.send(Array.from(user.watched.entries()));
    return; // Rückgabe von void
  }
));

const generateTokenReponse = (user: any) => {
  const token = jwt.sign({
    id: user.id, email: user.email
  }, process.env.JWT_TOKEN!, {
    expiresIn: "30d"
  });

  return {
    id: user.id,
    email: user.email,
    token: token
  };
};

export default router;