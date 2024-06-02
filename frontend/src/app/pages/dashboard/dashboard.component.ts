import { Component, OnInit, inject, Input, OnDestroy } from '@angular/core';
import { MovieComponent } from '../movie/movie.component';
import {} from '@angular/common/http';
import {
  BehaviorSubject,
  distinctUntilChanged, filter,
  map,
  Observable, of,
  shareReplay,
  Subscription,
  switchMap,
  tap,
  withLatestFrom
} from "rxjs";
import { MovieInformationComponent } from '../../components/movie-information/movie-information.component';
import { MoviesService } from '../../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../interfaces/movie.interface';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { response } from 'express';
import {MovieDetailDTO} from "@movie-app/shared";
import {ToastService} from "../../services/toast.service";
import {RatingControlComponent} from "../../components/rating-control/rating-control.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    MovieInformationComponent,
    RatingControlComponent,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnDestroy {
  private readonly subscription = new Subscription();

  private readonly moviesService = inject(MoviesService);
  private readonly toastService = inject(ToastService);

  private readonly loadNextMovie$$ = new BehaviorSubject<undefined>(undefined);

  public readonly movie$ = this.loadNextMovie$$.pipe(
    switchMap(() => this.moviesService.getNextPopularMovie())
  );

  public readonly ratingControl = new FormControl<string | number | null>(null);

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public watchLater(movie: MovieDetailDTO): void {
    const movieId = `${movie.id}`;
    this.subscription.add(
      this.moviesService.addToWatchLaterMovies({ movieId }).pipe(
        tap(() => this.showNextMovie()),
      ).subscribe({
        next: ({ message }) => this.toastService.addSuccess(message),
        error: err => this.toastService.addError(err.message),
      })
    );
  }

  public watched(movie: MovieDetailDTO): void {
    const movieId = `${movie.id}`;
    const rating = this.ratingControl.value ? +this.ratingControl.value : undefined;

    this.subscription.add(
      this.moviesService.addToWatchedMovies({
        movieId,
        rating
      }).subscribe({
        next: ({ message }) => {
          this.toastService.addSuccess(message);
          this.showNextMovie();
        },
        error: error => this.toastService.addError(error.message),
      })
    )

  }

  public showNextMovie(): void {
    this.loadNextMovie$$.next(undefined);
    this.ratingControl.setValue(null, { emitEvent: true });
  }

  /*
  public addMovie(movie: Movie){
    this.subscription.add(
      this.moviesService.addMovieToWatchList(movie).subscribe({
        next: response => {
          console.log(response)
        }
      })
    );
  }

  public rateMovie(movie: Movie){
    this.subscription.add(
      this.moviesService.addRatingToMovie(movie).subscribe({
        next: response => {
          console.log(response)
        }
      })
    );
  }
  */
}
