import { ApplicationConfig,provideZoneChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient,withInterceptors } from '@angular/common/http';
import { provideAuth0,authHttpInterceptorFn } from '@auth0/auth0-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing:true}),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAuth0({
      domain:'dev-sz4fx5wrtcwh5kdb.us.auth0.com',
      clientId:'TmvnEHQdUbwLaDvagPdNNqiAvjVyTwjp',
      authorizationParams:{
        redirect_uri:window.location.origin,
        //audience:'https://automatizador-sunat.com/api',

      },
      httpInterceptor:{
        allowedList:[
          'http://localhost:8000/*',
          'http://127.0.0.1:8000/*',
        ],
      },

    }),
  ],
};
