import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {STORAGE_KEY_PREFIX} from "./tokens/storage-key-prefix.token";
import {authInterceptor} from "./interceptors/auth.interceptor";
import {BASE_IMAGE_URL} from "./tokens/base-image-url.token";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: STORAGE_KEY_PREFIX,
      useValue: 'movies',
    }, {
      provide: BASE_IMAGE_URL,
      useValue: 'https://image.tmdb.org/t/p/w300'
    }
  ]
};
