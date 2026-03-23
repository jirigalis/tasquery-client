import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    // We only want to attach the token to requests going to our backend API.
    // Adjust the URL condition based on your backend environment variable if needed.
    const isApiRequest = req.url.includes('localhost:3000') || req.url.includes(environment.apiUrl);

    if (!isApiRequest) {
        return next(req);
    }

    // Convert the Promise from getSessionToken() to an Observable chain
    return from(authService.getSessionToken()).pipe(
        switchMap((token) => {
            if (token) {
                // Clone the request and append the Authorization header
                const clonedRequest = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token}`
                    }
                });
                return next(clonedRequest);
            }

            // If no token is found (user not logged in), proceed without it
            return next(req);
        })
    );
};
