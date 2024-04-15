import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public readonly searchForm = this.fb.group({
    query: [''],
  });

  public submitSearchQuery() {
    const { query } = this.searchForm.value;

    this.router.navigate(['/search'], {
      queryParams: {
        q: query,
      }
    })
  }
}
