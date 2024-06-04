import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { Movie } from '../../interfaces/movie.interface';
import { MoviesService } from '../../services/movies.service';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MovieInformationComponent } from '../../components/movie-information/movie-information.component';
import { MovieDetailDTO } from '../../../../../backend/src/shared';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, MovieInformationComponent],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly moviesService = inject(MoviesService);

  private readonly movieId$: Observable<Movie['id']> = this.route.params.pipe(
    map((params) => params['id'])
  );

  public movie$: Observable<MovieDetailDTO | null> = this.movieId$.pipe(
    tap(console.info),
    switchMap((movieId) => this.moviesService.getMovieById(movieId))
  );
}
