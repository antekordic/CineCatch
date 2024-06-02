import {Component, inject} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {AsyncPipe} from "@angular/common";
import {MovieFilterType} from "../../enums/movie-filter-type.enum";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  public readonly loggedIn$ = this.authService.loggedIn$;

  public readonly MovieFilterType = MovieFilterType;

  public async logout(): Promise<void> {
    this.authService.logout();
    await this.router.navigate(['/login']);
  }
}
