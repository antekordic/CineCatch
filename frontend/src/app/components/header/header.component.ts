import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  public readonly loggedIn$ = this.authService.loggedIn$;

  public readonly searchForm = this.fb.group({
    query: [''],
  });

  public async submitSearchQuery() {
    const { query } = this.searchForm.value;

    await this.router.navigate(['/search'], {
      queryParams: {
        q: query,
      }
    })
  }
}
