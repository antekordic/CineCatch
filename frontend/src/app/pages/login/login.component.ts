import {Component, inject, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {map, Observable, of, switchMap} from "rxjs";
import {ActivatedRoute, RouterModule} from "@angular/router";
import { USER_LOGIN_URL } from '../../shared/constants/urls';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public loginForm!: FormGroup

  private readonly authService = inject(AuthService);

  public loggedIn$ = this.authService.loggedIn$;

  constructor(private formbuilder: FormBuilder,private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.formbuilder.group({
      email: [''],
      password: ['', Validators.required]
    })
  }
  login(){
    this.http.get<any>(USER_LOGIN_URL)
    .subscribe(res=>{
      const user = res.find((a:any)=>{
        return a.email === this.loginForm.value.email && a.password === this.loginForm.value.password 
      });
      if(user){
        alert('Login Succesful');
        this.loginForm.reset()
      this.router.navigate([""])
      }else{
        alert("user not found")
      }
    },err=>{
      alert("Something went wrong")
    })
  }

  public fakeLogin() {
    this.authService.login('quatsch', 'passwort');
  }

  public fakeLogout() {
    this.authService.logout();
  }

}
