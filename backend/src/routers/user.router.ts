import {Router} from 'express';
import { sample_users } from '../data';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/user.model';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import bcrypt from 'bcryptjs';

const router = Router();

router.get("/seed", asyncHandler(
  async (req, res) => {
     const usersCount = await UserModel.countDocuments();
     if(usersCount> 0){
       res.send("Seed is already done!");
       return;
     }
 
     await UserModel.create(sample_users);
     res.send("Seed Is Done!");
 }
 ))

router.post("/login", asyncHandler(
  async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});
  
     if(user && (await bcrypt.compare(password,user.password))) {
      res.send(generateTokenReponse(user));
     }
     else{
       res.status(HTTP_BAD_REQUEST).send("Username or password is invalid!");
     }
  
  }
))
  
router.post('/register', asyncHandler(
  async (req, res) => {
    const {email, password} = req.body;
    const user = await UserModel.findOne({email});
    if(user){
      res.status(HTTP_BAD_REQUEST)
      .send('User already exist, please login!');
      return;
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser:User = {
      id:'',
      email: email.toLowerCase(),
      password: encryptedPassword,
    }

    const dbUser = await UserModel.create(newUser);
    res.send(generateTokenReponse(dbUser));
  }
))

  const generateTokenReponse = (user : User) => {
    const token = jwt.sign({
      id: user.id, email:user.email
    },process.env.JWT_TOKEN!,{
      expiresIn:"30d"
    });
  
    return {
      id: user.id,
      email: user.email,
      token: token
    };
  }
  
//Änderung von Thorben, toWatch Router -> Rückgabe der noch zu sehenden Filme des Users

router.get('/:userId/toWatch', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.toWatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


  export default router;