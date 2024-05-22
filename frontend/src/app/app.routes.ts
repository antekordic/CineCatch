import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MoviesComponent } from "./pages/movies/movies.component";
import { SearchComponent } from "./pages/search/search.component";
import { MovieComponent } from "./pages/movie/movie.component";
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './signup/signup.component';
import { authGuard } from './guards/auth.guard';
import { AuthType } from "./enums/auth-type.enum";

export const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  canActivate: [authGuard],
}, {
  path: 'movies',
  component: MoviesComponent,
  canActivate: [authGuard],
}, {
  path: 'movies/:id',
  component: MovieComponent,
  canActivate: [authGuard], data: {
    authType: AuthType.Protected,
  }
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
