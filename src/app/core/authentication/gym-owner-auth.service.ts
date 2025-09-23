import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TokenService } from 'app/service/token.service';
import { ApisConfig } from 'app/Apis/apis.config';
import { AuthData, GymOwnerLoginResponse, User } from '@core/authentication/interface';

@Injectable({
  providedIn: 'root'
})
export class GymOwnerAuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    private apisConfig: ApisConfig
  ) {
    // Initialize authentication state
    this.initializeAuthState();
  }

  private initializeAuthState(): void {
    const authData = this.tokenService.getAuthData();
    if (authData && this.tokenService.isAuthenticated()) {
      this.isAuthenticatedSubject.next(true);
      this.loadUserProfile();
    }
  }

  /**
   * Login gym owner
   */
  login(email: string, password: string): Observable<{ success: boolean; data?: AuthData; message?: string }> {
    const loginUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_LOGIN}`;
    
    return this.http.post<GymOwnerLoginResponse>(loginUrl, { email, password }).pipe(
      map(response => {
        if (response.success) {
          // Store authentication data
          const authData: AuthData = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            userId: response.user.id,
            gymId: response.user.gym._id,
            gymData: {
              _id: response.user.gym._id,
              gymId: response.user.gym.gymId,
              name: response.user.gym.name,
              city: response.user.gym.city,
              state: response.user.gym.state,
              logo: response.user.gym.logo
            },
            userEmail: response.user.email,
            userRole: response.user.role
          };


          this.tokenService.setAuthData(authData);
          
          // Update authentication state
          this.isAuthenticatedSubject.next(true);
          
          // Set current user
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role,
            gym: response.user.gym
          };
          this.currentUserSubject.next(user);

          return { success: true, data: authData };
        } else {
          return { success: false, message: 'Login failed' };
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => ({ success: false, message: error.error?.message || 'Network error occurred' }));
      })
    );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<{ success: boolean; accessToken?: string; message?: string }> {
    const refreshToken = this.tokenService.getAuthData()?.refreshToken;
    
    if (!refreshToken) {
      return throwError(() => ({ success: false, message: 'No refresh token available' }));
    }

    const refreshUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_REFRESH_TOKEN}`;
    
    return this.http.post<{ success: boolean; accessToken: string }>(refreshUrl, { refreshToken }).pipe(
      map(response => {
        if (response.success) {
          // Update access token in storage
          const authData = this.tokenService.getAuthData();
          if (authData) {
            authData.accessToken = response.accessToken;
            this.tokenService.setAuthData(authData);
          }
          return { success: true, accessToken: response.accessToken };
        } else {
          // Refresh token is invalid, logout user
          this.logout();
          return { success: false, message: 'Token refresh failed' };
        }
      }),
      catchError(error => {
        console.error('Token refresh error:', error);
        this.logout();
        return throwError(() => ({ success: false, message: 'Token refresh failed' }));
      })
    );
  }

  /**
   * Logout gym owner
   */
  logout(): Observable<boolean> {
    const refreshToken = this.tokenService.getAuthData()?.refreshToken;
    const logoutUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_LOGOUT}`;

    // If we have a refresh token, call logout API
    if (refreshToken) {
      return this.http.post<{ success: boolean; message: string }>(logoutUrl, { refreshToken }).pipe(
        tap(() => this.performLogout()),
        map(() => true),
        catchError(error => {
          console.error('Logout error:', error);
          // Even if API call fails, clear local storage
          this.performLogout();
          return throwError(() => false);
        })
      );
    } else {
      // No refresh token, just clear local storage
      this.performLogout();
      return new Observable(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  private performLogout(): void {
    this.tokenService.clearAuthData();
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get user profile from API
   */
  getProfile(): Observable<{ success: boolean; user?: User; message?: string }> {
    const profileUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_PROFILE}`;
    
    return this.http.get<{ success: boolean; user: any }>(profileUrl).pipe(
      map(response => {
        if (response.success) {
          const user: User = {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role,
            gym: response.user.gymId
          };
          this.currentUserSubject.next(user);
          return { success: true, user };
        } else {
          return { success: false, message: 'Failed to get profile' };
        }
      }),
      catchError(error => {
        console.error('Get profile error:', error);
        return throwError(() => ({ success: false, message: 'Failed to get profile' }));
      })
    );
  }

  private loadUserProfile(): void {
    this.getProfile().subscribe({
      next: (result) => {
        if (!result.success) {
          console.warn('Failed to load user profile');
        }
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  /**
   * Check authentication status
   */
  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  /**
   * Get current user data from storage
   */
  getCurrentUser(): AuthData | null {
    return this.tokenService.getAuthData();
  }

  /**
   * Get gym ID
   */
  getGymId(): string | null {
    return this.tokenService.getGymId();
  }

  /**
   * Get user ID
   */
  getUserId(): string | null {
    return this.tokenService.getUserId();
  }

  /**
   * Get gym data
   */
  getGymData() {
    return this.tokenService.getGymData();
  }

  /**
   * Get access token for API calls
   */
  getAccessToken(): string | null {
    const authData = this.tokenService.getAuthData();
    return authData?.accessToken || null;
  }
}
