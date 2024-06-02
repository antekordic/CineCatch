import {inject, Injectable} from '@angular/core';
import {catchError, map, ReplaySubject, tap, throwError} from 'rxjs';
import {LocalStorageService} from "./local-storage.service";
import { HttpClient } from "@angular/common/http";
import {USER_LOGIN_URL} from "../shared/constants/urls";
import {User} from "../shared/models/User";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly jwtStorageKey = 'jwt';

  private readonly http = inject(HttpClient);
  private readonly localStorage = inject(LocalStorageService);

  private readonly jwt$$ = new ReplaySubject<string | null>(1);
  public readonly jwt$ = this.jwt$$.asObservable();
  public readonly loggedIn$ = this.jwt$$.pipe(
    map(jwt => !!jwt),
  );

  public checkAuthentication(): void {
    // TODO: check against backend

    this.jwt$$.next(this.localStorage.getItem<string>(this.jwtStorageKey));
  }

  public login(email: string, password: string) {
    return this.http.post<User>(USER_LOGIN_URL, {
      email,
      password
    }).pipe(
      catchError(error => throwError((() => new Error(error.error)))),
      tap(({token}) => this.persistToken(token)),
    );
  }

  public logout() {
    this.localStorage.removeItem(this.jwtStorageKey);
    this.jwt$$.next(null);
  }

  private persistToken(jwt: string): void {
    this.localStorage.setItem(this.jwtStorageKey, jwt);
    this.jwt$$.next(jwt);
  }
}
