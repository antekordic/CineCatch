// import {Schema, model} from "mongoose";

// export interface Movie {
//     id: string;
//     title: string;
//     genre: string;
//     director: string;
//     plot: string;
//     rating: number;
//     imageUrl: string;
//     trailerUrl: string;
// }

// export const MovieSchema = new Schema<Movie>(
//     {
//         title: {type: String, required:true},
//         genre: {type: String, required:true},
//         director: {type: String, required:true},
//         plot: {type: String, required:true},
//         rating: {type: Number},
//         imageUrl: {type: String, required:true},
//         trailerUrl: {type: String, required:true},
//     },{
//         toJSON:{
//             virtuals: true,
//         },
//         toObject:{
//             virtuals: true
//         },
//         timestamps:true
//     }
// );

// export const MovieModel = model<Movie>('movie', MovieSchema);