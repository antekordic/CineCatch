import { Routes } from '@angular/router';
import {TinderComponent} from './pages/tinder/tinder.component';
import {MoviesComponent} from "./pages/movies/movies.component";
import {SearchComponent} from "./pages/search/search.component";
import {MovieComponent} from "./pages/movie/movie.component";
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { authGuard } from './guards/auth.guard';
import {AuthType} from "./enums/auth-type.enum";

export const routes: Routes = [{
  path: '',
  component: TinderComponent,
  canActivate: [authGuard],
  data: {
    authType: AuthType.Protected,
  }
}, {
  path: 'movies',
  component: MoviesComponent,
  canActivate: [authGuard],
  data: {
    authType: AuthType.Protected,
  }
}, {
  path: 'movies/:id',
  component: MovieComponent,
  canActivate: [authGuard],  data: {
    authType: AuthType.Protected,
  }
}, {
  path: 'search',
  component: SearchComponent,
  canActivate: [authGuard],
  data: {
    authType: AuthType.Protected,
  }
}, {
  path: 'login',
  component: LoginComponent,
  canActivate: [authGuard],
  data: {
    authType: AuthType.Unprotected,
  }
}, {
  path: 'signup',
  component: SignupComponent,
  canActivate: [authGuard],
  data: {
    authType: AuthType.Unprotected,
  }
}];
