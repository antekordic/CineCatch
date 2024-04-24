import {Router} from "express";
import { sample_movies } from "../data";
import asynceHandler from 'express-async-handler';
import { MovieModel } from "../models/movie.model";


const router = Router();

router.get("/seed", asynceHandler(
    async (req, res) => {
       const movieCount = await MovieModel.countDocuments();
       if(movieCount> 0){
         res.send("Seed is already done!");
         return;
       }
   
       await MovieModel.create(sample_movies);
       res.send("Seed Is Done!");
   }
   ))

   router.get("/",asynceHandler(
    async (req, res) => {
      const movies = await MovieModel.find();
        res.send(movies);
    }
  ))

  router.get("/search/:searchTerm", asynceHandler(
    async (req, res) => {
      const searchRegex = new RegExp(req.params.searchTerm, 'i');
      const movies = await MovieModel.find({title: {$regex:searchRegex}})
      res.send(movies);
    }
  ))

  router.get("/:movieId", asynceHandler(
    async (req, res) => {
      const movie = await MovieModel.findById(req.params.movieId);
      res.send(movie);
    }
  ))

export default router;
