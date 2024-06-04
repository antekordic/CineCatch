import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subscription,
  switchMap,
  throwError,
} from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MoviesService } from '../../services/movies.service';
import { MovieDetailDTO } from '../../../../../backend/src/shared';
import { MovieFilterType } from '../../enums/movie-filter-type.enum';
import { MovieInformationComponent } from '../../components/movie-information/movie-information.component';
import { RatingControlComponent } from '../../components/rating-control/rating-control.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    JsonPipe,
    MovieInformationComponent,
    RatingControlComponent,
    FormsModule,
  ],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent implements OnDestroy {
  private readonly subscription = new Subscription();
  private readonly route = inject(ActivatedRoute);
  private readonly moviesService = inject(MoviesService);

  private readonly reload$$ = new BehaviorSubject<undefined>(undefined);

  public readonly type$: Observable<MovieFilterType> =
    this.route.queryParams.pipe(map((params) => params['type']));

  public readonly movies$: Observable<MovieDetailDTO[]> = combineLatest([
    this.type$,
    this.reload$$,
  ]).pipe(
    switchMap(([watchedFilter]) => {
      if (watchedFilter === MovieFilterType.Watched) {
        return this.moviesService.loadWatchedMovies();
      }

      if (watchedFilter === MovieFilterType.WatchLater) {
        return this.moviesService.loadWatchLaterMovies();
      }

      return throwError(() => 'No valid filter set.');
    })
  );

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public reloadList(): void {
    this.reload$$.next(undefined);
  }
}
