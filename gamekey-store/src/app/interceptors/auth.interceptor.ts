import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { Observable } from 'rxjs';

// Functional Interceptor: attaches Authorization header if token exists
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    // Clone the request because HTTP requests are immutable objects
    // Django DRF expects 'Token <key_string>' format
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Token ${token}`
      }
    });
    return next(clonedRequest);
  }

  // If no token exists, pass the unmodified request
  return next(req);
};
