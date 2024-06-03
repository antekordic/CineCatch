import {
  Component,
  Input,
  OnInit,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MovieDetailDTO } from '../../../../../shared';
import { BASE_IMAGE_URL } from '../../tokens/base-image-url.token';
import { MoviesService } from '../../services/movies.service';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { RatingControlComponent } from '../rating-control/rating-control.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-information',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, RatingControlComponent, FormsModule],
  templateUrl: './movie-information.component.html',
  styleUrl: './movie-information.component.css',
})
export class MovieInformationComponent {
  private readonly subscription: Subscription = new Subscription();

  private readonly baseImageUrl = inject(BASE_IMAGE_URL);

  private readonly toastService = inject(ToastService);
  private readonly moviesService = inject(MoviesService);

  @Input({ required: true }) movie!: MovieDetailDTO;
  @Output() changedList = new EventEmitter<unknown>();

  public get posterUrl(): string {
    return this.baseImageUrl + this.movie.poster_path;
  }

  public updateRating(): void {
    if (!this.movie.user.watched) {
      return this.addToWatchList();
    }

    const movieId = `${this.movie.id}`;
    const rating = this.movie.user.rating;

    this.subscription.add(
      this.moviesService.rateWatchedMovie({ movieId, rating }).subscribe({
        next: () => this.toastService.addSuccess('Changed rating'),
        error: (error) => this.toastService.addError(error.message),
      })
    );
  }

  public addToWatchList(): void {
    const movieId = `${this.movie.id}`;
    const rating = this.movie.user.rating;

    this.subscription.add(
      this.moviesService.addToWatchedMovies({ movieId, rating }).subscribe({
        next: () => {
          this.movie.user.watched = true;
          this.toastService.addSuccess('Movie added to watch list');
          this.changedList.emit();
        },
        error: (error) => this.toastService.addError(error.message),
      })
    );
  }

  public addToWatchLater(): void {
    const movieId = `${this.movie.id}`;

    this.subscription.add(
      this.moviesService.addToWatchLaterMovies({ movieId }).subscribe({
        next: () => {
          this.movie.user.watchLater = true;
          this.toastService.addSuccess('Movie added to watch later list');
          this.changedList.emit();
        },
        error: (error) => this.toastService.addError(error.message),
      })
    );
  }

  public removeFromWatchList(): void {
    const movieId = `${this.movie.id}`;

    this.subscription.add(
      this.moviesService.removeFromWatchedMovies(movieId).subscribe({
        next: () => {
          this.movie.user.watched = false;
          this.toastService.addSuccess('Movie remove from watch list');
          this.changedList.emit();
        },
        error: (error) => this.toastService.addError(error.message),
      })
    );
  }

  public removeFromWatchLater(): void {
    const movieId = `${this.movie.id}`;

    this.subscription.add(
      this.moviesService.deleteWatchlaterMovie(movieId).subscribe({
        next: () => {
          this.movie.user.watchLater = false;
          this.toastService.addSuccess('Movie removed from watch later list');
          this.changedList.emit();
        },
        error: (error) => this.toastService.addError(error.message),
      })
    );
  }
}
