import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { TokenService } from 'app/service/token.service';
import { GymOwnerAuthService } from '@core/authentication/gym-owner-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth for translation files and certain URLs to avoid circular dependencies
    if (this.shouldSkipAuth(req.url)) {
      return next.handle(req);
    }

    // Use injector to get TokenService to avoid circular dependency
    const tokenService = this.injector.get(TokenService);
    let authReq = req;
    const accessToken = tokenService.getAccessToken();
    
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(authReq).pipe(
      // Handle the case where backend returns 200 with { success:false, message:'Token expired' }
      switchMap(event => {
        if (event instanceof HttpResponse) {
          const body = event.body as any;
          if (
            body && body.success === false &&
            typeof body.message === 'string' &&
            body.message.toLowerCase().includes('token expired') &&
            !req.url.includes('/refresh-token')
          ) {
            return this.handleTokenRefresh(authReq, next);
          }
        }
        return of(event);
      }),
      catchError((error: HttpErrorResponse) => {
        // Handle 401/403 errors for token refresh
        const tokenExpiredBody = typeof error?.error?.message === 'string' &&
          error.error.message.toLowerCase().includes('token expired');
        if ((error.status === 401 || error.status === 403 || tokenExpiredBody) && !req.url.includes('/refresh-token')) {
          return this.handleTokenRefresh(authReq, next, error);
        }
        return throwError(() => error);
      })
    );
  }

  private shouldSkipAuth(url: string): boolean {
    const skipUrls = [
      '/i18n/',           // Translation files
      '/assets/',         // Static assets
      '.json',           // JSON files (like translations)
      '/refresh-token'    // Refresh token endpoint
    ];
    
    return skipUrls.some(skipUrl => url.includes(skipUrl));
  }

  private handleTokenRefresh(
    req: HttpRequest<any>,
    next: HttpHandler,
    originalError?: HttpErrorResponse
  ): Observable<HttpEvent<any>> {
    const tokenService = this.injector.get(TokenService);
    const authService = this.injector.get(GymOwnerAuthService);

    const refreshToken = tokenService.getAuthData()?.refreshToken;
    if (!refreshToken) {
      tokenService.logout();
      return throwError(() => originalError ?? new Error('No refresh token'));
    }

    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return authService.refreshToken().pipe(
        switchMap(result => {
          this.isRefreshing = false;
          if (result.success && result.accessToken) {
            this.refreshTokenSubject.next(result.accessToken);
            const cloned = this.addToken(req, result.accessToken);
            return next.handle(cloned);
          }
          tokenService.logout();
          return throwError(() => originalError ?? new Error('Token refresh failed'));
        }),
        catchError(err => {
          this.isRefreshing = false;
          tokenService.logout();
          return throwError(() => err);
        })
      );
    } else {
      // Wait until the token is refreshed and then retry
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => next.handle(this.addToken(req, token!)))
      );
    }
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
}
