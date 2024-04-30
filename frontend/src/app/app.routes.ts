import { Routes } from '@angular/router';
import {TinderComponent} from './pages/tinder/tinder.component';
import {MoviesComponent} from "./pages/movies/movies.component";
import {SearchComponent} from "./pages/search/search.component";
import {MovieComponent} from "./pages/movie/movie.component";
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [{
  path: '',
  component: TinderComponent,
}, {
  path: 'movies',
  component: MoviesComponent,
}, {
  path: 'movies/:id',
  component: MovieComponent,
}, {
  path: 'search',
  component: SearchComponent,
}, {
  path: 'login',
  component: LoginComponent,
}, {
  path: 'signup',
  component: SignupComponent,
}];
