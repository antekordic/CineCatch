import { Component, input } from '@angular/core';
import { Movie } from '../../interfaces/movie.interface';

@Component({
  selector: 'app-movie-information',
  standalone: true,
  imports: [],
  templateUrl: './movie-information.component.html',
  styleUrl: './movie-information.component.css'
})
export class MovieInformationComponent {
  @input() infos: Movie;
  @input('master') tinder = '';
  @input('master') movie = '';

}
