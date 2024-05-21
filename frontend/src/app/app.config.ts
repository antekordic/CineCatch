import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import {STORAGE_KEY_PREFIX} from "./tokens/storage-key-prefix.token";

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), {
    provide: STORAGE_KEY_PREFIX,
    useValue: 'movies',
  }]
};
