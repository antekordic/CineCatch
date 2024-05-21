import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {USER_REGISTER_URL} from "../shared/constants/urls";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private readonly http = inject(HttpClient);

  public signUp({ email, password }: { email: string; password: string } ) {
    return this.http.post(USER_REGISTER_URL, {
      email,
      password
    }).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => new Error(error.error)))
    );
  }
}
