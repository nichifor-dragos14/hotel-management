import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { BackendApiModule } from '$backend/services';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { EditorModule } from '@tinymce/tinymce-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      BackendApiModule.forRoot({ rootUrl: '/api' }),
      BrowserAnimationsModule,
      MatSnackBarModule,
      MatIconModule,
      EditorModule
    ),
    provideAnimations(),
  ],
};
