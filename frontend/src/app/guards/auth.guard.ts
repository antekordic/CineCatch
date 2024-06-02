import {inject} from '@angular/core';
import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {map, Observable, tap} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {AuthType} from "../enums/auth-type.enum";

export const authGuard: CanActivateFn = (route, state): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.loggedIn$.pipe(
    map(loggedIn => {
      const authType = route.data['authType'] || AuthType.Public;

      switch(authType) {
        case AuthType.Protected: {
          return loggedIn || router.createUrlTree(AuthType.Protected);
        }
        case AuthType.Unprotected: {
          return !loggedIn ? true : router.createUrlTree(AuthType.Unprotected);
        }
        case AuthType.Public: {
          return true;
        }
        default: {
          throw new Error('authGuard needs a authType configuration.');
        }
      }
    })
  );
};
