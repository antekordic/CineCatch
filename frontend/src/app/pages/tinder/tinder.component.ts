import { Component, OnInit, inject, Input } from '@angular/core';
import { MovieComponent } from '../movie/movie.component';
import { HttpClientModule } from '@angular/common/http';
import {map, Observable, shareReplay, switchMap, tap} from "rxjs";
import { MovieInformationComponent } from '../../components/movie-information/movie-information.component';
import { MoviesService } from '../../services/movies.service';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../interfaces/movie.interface';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-tinder',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    MovieInformationComponent
  ],
  templateUrl: './tinder.component.html',
  styleUrl: './tinder.component.css'
})
export class TinderComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly moviesService = inject(MoviesService);

  private readonly movieId$: Observable<Movie['id']> = this.route.params.pipe(
    map(params => params['id']),
  );

  public movie$: Observable<Movie | null> = this.movieId$.pipe(
    tap(console.info),
    switchMap(movieId => this.moviesService.getMovieById(movieId)),
  );
} 
