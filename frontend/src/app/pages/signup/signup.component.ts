import {Component, inject, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { USER_REGISTER_URL } from '../../shared/constants/urls';
import {SignUpService} from "../../services/sign-up.service";
import {catchError, of, Subscription, throwError} from "rxjs";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnDestroy {
  private readonly subscription = new Subscription();
  private readonly formBuilder = inject(FormBuilder);
  private readonly signUpService = inject(SignUpService);
  private readonly toastService = inject(ToastService);

  public readonly signUpForm: FormGroup = this.formBuilder.group({
    email: ["", Validators.compose([Validators.email])],
    password: ["", Validators.compose([Validators.required])],
    passwordRepeat: ["", Validators.compose([Validators.required])]
  })

  public signUp(): void {
    const { email, password } = this.signUpForm.value;

    this.subscription.add(this.signUpService.signUp({
      email,
      password
    }).subscribe({
      next: () => this.toastService.addSuccess(`Sign Up successful`),
      error: err => this.toastService.addError(err.message),
    }));
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
