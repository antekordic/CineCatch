import { Injectable } from '@angular/core';
import {filter, map, Observable, of, tap} from "rxjs";
import {Movie} from "../interfaces/movie.interface";
import {MOVIES_MOCK} from "../mocks/movies.mock";

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  public laodAllMovies(): Observable<Movie[]> {
    return of(MOVIES_MOCK);
  }

  public loadWatchedMovies(): Observable<Movie[]> {
    return this.laodAllMovies().pipe(
      map(movies => movies.filter(movie => movie.watched))
    )
  }

  public loadUnwatchedMovies(): Observable<Movie[]> {
    return this.laodAllMovies().pipe(
      map(movies => movies.filter(movie => !movie.watched))
    )
  }

  public search(query: string): Observable<Movie[]> {
    return this.laodAllMovies().pipe(
      map(movies => movies.filter(movie => movie.title.match(new RegExp(query, 'gi')))),
    )
  }

  public getMovieById(movieId: Movie['id']): Observable<Movie | null> {
    return this.laodAllMovies().pipe(
      map(movies => movies.find(movie => movie.id === +movieId) || null),
    )
  }
}
