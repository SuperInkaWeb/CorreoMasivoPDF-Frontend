import { ApplicationConfig,provideZoneChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { provideAuth0,authHttpInterceptorFn } from '@auth0/auth0-angular';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing:true}),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAuth0({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId,
      authorizationParams:{
        redirect_uri:window.location.origin,
        //audience:'https://automatizador-sunat.com/api',

      },
      httpInterceptor:{
        allowedList: environment.allowedList as any
      },

    }),
  ],
};
