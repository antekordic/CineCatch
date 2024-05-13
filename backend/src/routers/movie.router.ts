import {Router} from "express";
import { sample_movies } from "../data";
import asynceHandler from 'express-async-handler';
import { MovieModel } from "../models/movie.model";
import axios from "axios"; // npm install axios


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

  router.get("/:movieId", async (req, res) => {
    try {
        const movieId = req.params.movieId;
        // TMDB API CALL AUF ID
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}?api_key=YOUR_API_KEY`);
        if (response.status === 200) {
            res.json(response.data);
        } else {
            res.status(response.status).json({ error: "Failed to fetch movie details" });
        }
    } catch (error) {

        res.status(500).json({ error: "Internal server error" });
    }
});

//  router.get("/:movieId", asynceHandler(
//    async (req, res) => {
//      const movie = await MovieModel.findById(req.params.movieId);
//      res.send(movie);
//    }
//  ))

export default router;
