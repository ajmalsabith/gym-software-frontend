import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { TokenService } from 'app/service/token.service';
import { ClientService } from 'app/component-sections/client/services/client.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private clienservice: ClientService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.tokenService.getAccessToken();

    // Add token to request if available
    let authReq = req;
    if (accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // If unauthorized and refresh token exists
        if (error.status === 401 && this.tokenService.getRefreshToken()) {
          const refreshData = { refresh: this.tokenService.getRefreshToken() };

          return this.clienservice.getRefreshTokens(refreshData).pipe(
            switchMap(response => {
              const newAccessToken = response.access;

              // Save new token
              this.tokenService.setTokens(newAccessToken, this.tokenService.getRefreshToken()!);

              // Retry original request with new token
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newAccessToken}` }
              });

              return next.handle(retryReq);
            }),
            catchError(refreshError => {
              // Refresh token invalid → clear tokens and redirect to login
              this.tokenService.clearTokens();
              // Optionally redirect to login here
              return throwError(() => refreshError);
            })
          );
        }

        return throwError(() => error);
      })
    );
  }
}
