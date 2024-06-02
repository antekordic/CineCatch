import { HttpEvent, HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {catchError, Observable, switchMap, throwError} from "rxjs";
import {Router} from "@angular/router";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.jwt$.pipe(
    switchMap(jwt => {
      let _next: Observable<HttpEvent<any>>;
      if (jwt) {
        _next = next(req.clone({
          headers: req.headers.set('Authorization', 'Bearer ' + jwt),
        }))
      } else {
        _next = next(req);
      }

      return _next.pipe(
        catchError((error) => {
          if (error.status === HttpStatusCode.Unauthorized) {
            authService.logout();
            router.navigate(['/login']);
          }

          return throwError(() => error)
        })
      );
    })
  )
};
