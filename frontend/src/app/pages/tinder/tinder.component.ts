import { Component, OnInit } from '@angular/core';
import { MOVIES_MOCK } from '../../mocks/movies.mock';
import { MovieComponent } from '../movie/movie.component';
import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-tinder',
  standalone: true,
  imports: [],
  templateUrl: './tinder.component.html',
  styleUrl: './tinder.component.css'
})
export class TinderComponent {
} 
