import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {filter, map, Observable, of, tap} from "rxjs";
import {Movie} from "../interfaces/movie.interface";
import {MOVIES_MOCK} from "../mocks/movies.mock";
import {MOVIES_BY_ID_URL, MOVIES_URL} from "../shared/constants/urls";
import { urlToHttpOptions } from 'node:url';



@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private readonly http = inject(HttpClient)

  public loadAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(MOVIES_URL);
  }

  public loadWatchedMovies(): Observable<Movie[]> {
    return this.loadAllMovies().pipe(
      map(movies => movies.filter(movie => movie.watched))
    )
  }

  public loadUnwatchedMovies(): Observable<Movie[]> {
    return this.loadAllMovies().pipe(
      map(movies => movies.filter(movie => !movie.watched))
    )
  }

  public search(query: string): Observable<Movie[]> {
    return this.loadAllMovies().pipe(
      map(movies => movies.filter(movie => movie.title.match(new RegExp(query, 'gi')))),
    )
  }

  public getMovieById(movieId: Movie['id']): Observable<Movie | null> {
    return this.http.get<Movie>(MOVIES_BY_ID_URL.replace(':id', movieId.toString()));
  }

   
  public addMovieToWatchList(movie: Movie): Observable<Movie>{
    return this.http.post<Movie>(MOVIES_BY_ID_URL, movie);
  } 


  public addRatingToMovie(movie: Movie): Observable<Movie>{
    return this.http.post<Movie>(MOVIES_BY_ID_URL, movie);
  }
}
