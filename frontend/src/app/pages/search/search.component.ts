import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  switchMap,
  withLatestFrom,
  combineLatest,
  Subscription,
} from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MoviesService } from '../../services/movies.service';
import { MovieDetailDTO } from '../../../../../shared';
import { MovieInformationComponent } from '../../components/movie-information/movie-information.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AsyncPipe, RouterModule, JsonPipe, MovieInformationComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnDestroy {
  private readonly subscription = new Subscription();

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly moviesService = inject(MoviesService);

  public readonly query$: Observable<string> = this.route.queryParams.pipe(
    map((params) => params['q']),
    map((query) => query || '')
  );

  public readonly page$: Observable<number> = this.route.queryParams.pipe(
    map((params) => params['page']),
    map((page) => (page ? +page : 1))
  );

  public readonly searchResult$: Observable<MovieDetailDTO[]> =
    this.query$.pipe(
      withLatestFrom(this.page$),
      switchMap(([searchQuery, page]) =>
        this.moviesService.search(searchQuery, page)
      )
    );

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public async nextPage(currentPage: number): Promise<boolean> {
    return this.changePage(currentPage + 1);
  }

  public async previousPage(currentPage: number): Promise<boolean> {
    return this.changePage(currentPage - 1);
  }

  private async changePage(page: number): Promise<boolean> {
    return this.router.navigate([], {
      queryParams: {
        page: page,
      },
      queryParamsHandling: 'merge',
    });
  }
}
