import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {map, Observable, of, Subscription, switchMap} from "rxjs";
import {ActivatedRoute, RouterModule} from "@angular/router";
import { USER_LOGIN_URL } from '../../shared/constants/urls';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  private readonly subscription = new Subscription();

  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  public readonly loginForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.email],
    password: ['', Validators.required]
  })

  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  public login(){
    const {email, password} = this.loginForm.value;

    this.subscription.add(this.authService.login(email, password).subscribe({
      next: async () => {
        this.toastService.addSuccess(`Logged in successfully`);
        await this.router.navigate(['/']);
      },
      error: (error) => this.toastService.addError(error.message),
    }));
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
