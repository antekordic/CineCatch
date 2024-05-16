// src/global.d.ts
export {};
declare namespace NodeJS {
    interface Global {
      watchedMoviesData: { movieId: string; rating?: number }[];
      watchLaterMovieIds: string[];
    }
  }