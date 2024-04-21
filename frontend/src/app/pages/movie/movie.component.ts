import {Component, inject} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, Observable, switchMap} from "rxjs";
import {Movie} from "../../interfaces/movie.interface";
import {MoviesService} from "../../services/movies.service";
import {AsyncPipe, JsonPipe} from "@angular/common";

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe
  ],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css'
})
export class MovieComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly moviesService = inject(MoviesService);

  private readonly movieId$: Observable<Movie['id']> = this.route.params.pipe(
    map(params => params['id']),
  );

  public movie$: Observable<Movie | null> = this.movieId$.pipe(
    switchMap(movieId => this.moviesService.getMovieById(movieId)),
  );
}
