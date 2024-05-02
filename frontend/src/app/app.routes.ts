import { Routes } from '@angular/router';
import {TinderComponent} from './pages/tinder/tinder.component';
import {MoviesComponent} from "./pages/movies/movies.component";
import {SearchComponent} from "./pages/search/search.component";
import {MovieComponent} from "./pages/movie/movie.component";
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [{
  path: '',
  component: TinderComponent,
  canActivate: [authGuard],
}, {
  path: 'movies',
  component: MoviesComponent,
  canActivate: [authGuard],
}, {
  path: 'movies/:id',
  component: MovieComponent,
  canActivate: [authGuard],
}, {
  path: 'search',
  component: SearchComponent,
  canActivate: [authGuard],
}, {
  path: 'login',
  component: LoginComponent,
}, {
  path: 'signup',
  component: SignupComponent,
}];
