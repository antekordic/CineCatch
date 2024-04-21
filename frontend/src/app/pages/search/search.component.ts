import {Component, inject, OnInit} from '@angular/core';
import {map, Observable, of, switchMap} from "rxjs";
import {ActivatedRoute, RouterModule} from "@angular/router";
import {AsyncPipe} from "@angular/common";
import {MoviesService} from "../../services/movies.service";
import {Movie} from "../../interfaces/movie.interface";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [AsyncPipe, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly moviesService = inject(MoviesService);
  public readonly query$: Observable<string> = this.route.queryParams.pipe(
    map(params => params['q']),
    map(query => query || ''),
  );

  public readonly searchResult$: Observable<Movie[]> = this.query$.pipe(
    switchMap(searchQuery => this.moviesService.search(searchQuery)),
  )
}
