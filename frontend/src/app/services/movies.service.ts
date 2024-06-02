import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, of, switchMap} from "rxjs";
import {
  MOVIES_ADD_WATCH_LATER,
  MOVIES_ADD_WATCHED,
  MOVIES_BY_IDS,
  MOVIES_BY_SEARCH_URL, MOVIES_DELETE_WATCH_LATER, MOVIES_DELETE_WATCHED, MOVIES_GET_WATCH_LATER, MOVIES_GET_WATCHED,
  MOVIES_NEXT_POPULAR, MOVIES_RATE_WATCHED,
} from "../shared/constants/urls";
import {
  AddToWatchedMovieDTO,
  AddToWatchLaterMovieDTO,
  MovieDetailDTO,
  ResponseMessageDTO, ResponseMoviesDTO,
  UpdateWatchedMovieRatingDTO
} from "@movie-app/shared";
import {observableToBeFn} from "rxjs/internal/testing/TestScheduler";

@Injectable({
  providedIn: 'root'
})
export class MoviesService {

  private readonly http = inject(HttpClient)

  public getNextPopularMovie(): Observable<MovieDetailDTO> {
    return this.http.get<MovieDetailDTO>(MOVIES_NEXT_POPULAR);
  }

  public search(query: string, page = 1): Observable<MovieDetailDTO[]> {
    return this.http.get<MovieDetailDTO[]>(
      MOVIES_BY_SEARCH_URL
        .replace(':query', query)
        .replace(':page', `${page}`)
    );
  }

  public getMovieById(id: MovieDetailDTO['id']): Observable<MovieDetailDTO> {
    return this.getMoviesByIds([id]).pipe(
      map(movies => movies[0]),
    );
  }

  public getMoviesByIds(ids: MovieDetailDTO['id'][]): Observable<MovieDetailDTO[]> {
    return this.http.get<MovieDetailDTO[]>(MOVIES_BY_IDS.replace(':ids', ids.join(',')));
  }

  // Watched movies
  public addToWatchedMovies(data: AddToWatchedMovieDTO): Observable<ResponseMessageDTO> {
    return this.http.post<ResponseMessageDTO>(MOVIES_ADD_WATCHED, data);
  }

  public removeFromWatchedMovies(movieId: string): Observable<ResponseMessageDTO> {
    return this.http.delete<ResponseMessageDTO>(MOVIES_DELETE_WATCHED.replace(':movieId', movieId));
  }

  public loadWatchedMovies(): Observable<MovieDetailDTO[]> {
    return this.http.get<ResponseMoviesDTO>(MOVIES_GET_WATCHED).pipe(
      map(({ movies }) => movies),
    );;
  }

  public rateWatchedMovie(data: UpdateWatchedMovieRatingDTO): Observable<ResponseMessageDTO> {
    return this.http.put<ResponseMessageDTO>(MOVIES_RATE_WATCHED, data);
  }

  // Want to watch later
  public addToWatchLaterMovies(data: AddToWatchLaterMovieDTO): Observable<ResponseMessageDTO> {
    return this.http.post<ResponseMessageDTO>(MOVIES_ADD_WATCH_LATER, data);
  }

  public loadWatchLaterMovies(): Observable<MovieDetailDTO[]> {
    return this.http.get<ResponseMoviesDTO>(MOVIES_GET_WATCH_LATER).pipe(
      map(({ movies }) => movies),
    );
  }

  public deleteWatchlaterMovie(movieId: string): Observable<ResponseMessageDTO> {
    return this.http.delete<ResponseMessageDTO>(MOVIES_DELETE_WATCH_LATER.replace(':movieId', movieId));
  }
}
