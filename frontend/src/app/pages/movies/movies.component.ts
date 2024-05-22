import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {map, Observable, switchMap} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {Movie} from "../../interfaces/movie.interface";
import {MoviesService} from "../../services/movies.service";

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    AsyncPipe, RouterLink
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly moviesService = inject(MoviesService);
  public readonly watchedFilter$: Observable<boolean | null> = this.route.queryParams.pipe(
    map(params => params['watched']),
    map(watchedParam => {
      if (watchedParam === 'true') {
        return true;
      }

      if (watchedParam === 'false') {
        return false;
      }

      return null;
    })
  );

  public readonly movies$: Observable<Movie[]> = this.watchedFilter$.pipe(
    switchMap(watchedFilter => {
      if (watchedFilter === true) {
        return this.moviesService.loadWatchedMovies();
      }

      if (watchedFilter === false) {
        return this.moviesService.loadUnwatchedMovies();
      }
      return this.moviesService.loadAllMovies();
    })
  )

}
