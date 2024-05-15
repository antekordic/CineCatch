import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loggedIn$$ = new ReplaySubject<boolean>(1);
  public readonly loggedIn$ = this.loggedIn$$.asObservable();

  constructor() { }

  public login(email: string, password: string) {
    this.loggedIn$$.next(true);
  }

  public logout() {
    this.loggedIn$$.next(false);
  }
}
