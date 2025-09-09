import { enableProdMode, importProvidersFrom } from '@angular/core';

import { tokenGetter } from './app/app.module';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { JwtModule } from '@auth0/angular-jwt';
import { provideAnimations } from '@angular/platform-browser/animations';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideRouter } from '@angular/router';
import { routes } from './app/app-routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: ['localhost:3000']
            }
        })),
        provideRouter(routes),
        MatSnackBar,
        provideHttpClient(withInterceptorsFromDi()),
        provideAnimations()
    ]
})
  .catch(err => console.error(err));
