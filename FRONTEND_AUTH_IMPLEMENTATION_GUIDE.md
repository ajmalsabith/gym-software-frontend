# Gym Owner Frontend Authentication Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing gym owner authentication in your Angular frontend application, including login, token management, and secure storage.

## Table of Contents
1. [API Endpoints](#api-endpoints)
2. [Angular Implementation](#angular-implementation)
3. [Token Storage Strategy](#token-storage-strategy)
4. [Authentication Services](#authentication-services)
5. [HTTP Client Setup](#http-client-setup)
6. [Angular Components Example](#angular-components-example)
7. [Security Best Practices](#security-best-practices)
8. [Usage Summary](#usage-summary)

## API Endpoints

### Base URL
```
http://localhost:3400/api/gym-owner
```

### 1. Login API
**Endpoint**: `POST /login`

**Request:**
```typescript
{
  "email": "trainer@example.com",
  "password": "password123"
}
```

**Response:**
```typescript
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "email": "trainer@example.com",
    "role": "trainer",
    "gym": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "gymId": "GYM001",
      "name": "Elite Fitness Center",
      "city": "New York",
      "state": "NY"
    }
  }
}
```

### 2. Refresh Token API
**Endpoint**: `POST /refresh-token`

**Request:**
```typescript
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```typescript
{
  "success": true,
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 3. Logout API
**Endpoint**: `POST /logout`

**Request:**
```typescript
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```typescript
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 4. Get Profile API
**Endpoint**: `GET /profile`

**Headers:**
```typescript
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```typescript
{
  "success": true,
  "user": {
    "id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "email": "trainer@example.com",
    "role": "trainer",
    "gymId": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "gymId": "GYM001",
      "name": "Elite Fitness Center",
      "city": "New York",
      "state": "NY"
    }
  }
}
```

## Angular Implementation

### 1. Interfaces (`src/app/core/authentication/interface.ts`)

```typescript
export interface User {
  [prop: string]: any;
  id?: number | string | null;
  name?: string;
  email?: string;
  avatar?: string;
  roles?: any[];
  permissions?: any[];
  role?: string;
  gym?: GymInfo;
}

export interface GymInfo {
  _id: string;
  gymId: string;
  name: string;
  city: string;
  state: string;
}

export interface AuthData {
  accessToken: string;
  refreshToken: string;
  userId: string;
  gymId: string;
  gymData: GymInfo;
  userEmail: string;
  userRole: string;
}

export interface GymOwnerLoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    gym: GymInfo;
  };
}
```

### 2. Token Storage Service (`src/app/service/token.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthData, GymInfo } from '@core/authentication/interface';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private router: Router) { }

  // Gym Owner Authentication Data Management
  setAuthData(authData: AuthData): void {
    localStorage.setItem('accessToken', authData.accessToken);
    localStorage.setItem('refreshToken', authData.refreshToken);
    localStorage.setItem('userId', authData.userId);
    localStorage.setItem('gymId', authData.gymId);
    localStorage.setItem('gymData', JSON.stringify(authData.gymData));
    localStorage.setItem('userEmail', authData.userEmail);
    localStorage.setItem('userRole', authData.userRole);
  }

  getAuthData(): AuthData | null {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!accessToken || !refreshToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      userId: localStorage.getItem('userId') || '',
      gymId: localStorage.getItem('gymId') || '',
      gymData: JSON.parse(localStorage.getItem('gymData') || '{}'),
      userEmail: localStorage.getItem('userEmail') || '',
      userRole: localStorage.getItem('userRole') || ''
    };
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  getGymId(): string | null {
    return localStorage.getItem('gymId');
  }

  getGymData(): GymInfo | null {
    const gymData = localStorage.getItem('gymData');
    return gymData ? JSON.parse(gymData) : null;
  }

  clearAuthData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('gymId');
    localStorage.removeItem('gymData');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  gymOwnerLogout(): void {
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }
}
```

### 3. Gym Owner Authentication Service (`src/app/core/authentication/gym-owner-auth.service.ts`)

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TokenService } from 'app/service/token.service';
import { ApisConfig } from 'app/Apis/apis.config';
import { AuthData, GymOwnerLoginResponse, User } from './interface';

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
    this.initializeAuthState();
  }

  login(email: string, password: string): Observable<{ success: boolean; data?: AuthData; message?: string }> {
    const loginUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_LOGIN}`;
    
    return this.http.post<GymOwnerLoginResponse>(loginUrl, { email, password }).pipe(
      map(response => {
        if (response.success) {
          const authData: AuthData = {
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            userId: response.user.id,
            gymId: response.user.gym._id,
            gymData: response.user.gym,
            userEmail: response.user.email,
            userRole: response.user.role
          };

          this.tokenService.setAuthData(authData);
          this.isAuthenticatedSubject.next(true);
          
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

  refreshToken(): Observable<{ success: boolean; accessToken?: string; message?: string }> {
    const refreshToken = this.tokenService.getAuthData()?.refreshToken;
    
    if (!refreshToken) {
      return throwError(() => ({ success: false, message: 'No refresh token available' }));
    }

    const refreshUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_REFRESH_TOKEN}`;
    
    return this.http.post<{ success: boolean; accessToken: string }>(refreshUrl, { refreshToken }).pipe(
      map(response => {
        if (response.success) {
          const authData = this.tokenService.getAuthData();
          if (authData) {
            authData.accessToken = response.accessToken;
            this.tokenService.setAuthData(authData);
          }
          return { success: true, accessToken: response.accessToken };
        } else {
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

  logout(): Observable<boolean> {
    const refreshToken = this.tokenService.getAuthData()?.refreshToken;
    const logoutUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_LOGOUT}`;

    if (refreshToken) {
      return this.http.post<{ success: boolean; message: string }>(logoutUrl, { refreshToken }).pipe(
        tap(() => this.performLogout()),
        map(() => true),
        catchError(error => {
          console.error('Logout error:', error);
          this.performLogout();
          return throwError(() => false);
        })
      );
    } else {
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

  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  getCurrentUser(): AuthData | null {
    return this.tokenService.getAuthData();
  }

  getGymId(): string | null {
    return this.tokenService.getGymId();
  }

  getUserId(): string | null {
    return this.tokenService.getUserId();
  }

  getAccessToken(): string | null {
    const authData = this.tokenService.getAuthData();
    return authData?.accessToken || null;
  }
}
```

### 4. HTTP Client Setup with Interceptor (`src/app/interceptor/auth.interceptor.ts`)

```typescript
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { GymOwnerAuthService } from '@core/authentication/gym-owner-auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private gymOwnerAuthService: GymOwnerAuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isGymOwnerAPI = req.url.includes('/api/gym-owner/');
    
    let authReq = req;
    
    if (isGymOwnerAPI) {
      const accessToken = this.gymOwnerAuthService.getAccessToken();
      if (accessToken) {
        authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${accessToken}` }
        });
      }
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if ((error.status === 401 || error.status === 403) && isGymOwnerAPI) {
          return this.handleGymOwnerTokenRefresh(req, next, error);
        }
        return throwError(() => error);
      })
    );
  }

  private handleGymOwnerTokenRefresh(req: HttpRequest<any>, next: HttpHandler, originalError: HttpErrorResponse): Observable<HttpEvent<any>> {
    return this.gymOwnerAuthService.refreshToken().pipe(
      switchMap(response => {
        if (response.success && response.accessToken) {
          const retryReq = req.clone({
            setHeaders: { Authorization: `Bearer ${response.accessToken}` }
          });
          return next.handle(retryReq);
        } else {
          this.gymOwnerAuthService.logout();
          return throwError(() => originalError);
        }
      }),
      catchError(refreshError => {
        this.gymOwnerAuthService.logout();
        return throwError(() => refreshError);
      })
    );
  }
}
```

### 5. Authentication Guard (`src/app/core/authentication/gym-owner-auth.guard.ts`)

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { GymOwnerAuthService } from './gym-owner-auth.service';

@Injectable({
  providedIn: 'root'
})
export class GymOwnerAuthGuard implements CanActivate {

  constructor(
    private authService: GymOwnerAuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/auth/login']);
    return false;
  }
}
```

## Angular Components Example

### Login Component Usage

```typescript
// In your login component
import { GymOwnerAuthService } from '@core/authentication/gym-owner-auth.service';

export class LoginComponent {
  constructor(private authService: GymOwnerAuthService) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (result) => {
        if (result.success) {
          console.log('Login successful:', result.data);
          console.log('Gym ID:', result.data?.gymId);
          console.log('User ID:', result.data?.userId);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('Login error:', error);
      }
    });
  }
}
```

### Dashboard Component Usage

```typescript
// In your dashboard component
import { GymOwnerAuthService } from '@core/authentication/gym-owner-auth.service';

export class DashboardComponent implements OnInit {
  currentUser: AuthData | null = null;

  constructor(private authService: GymOwnerAuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Current User:', this.currentUser);
    console.log('Gym ID:', this.currentUser?.gymId);
    console.log('Gym Data:', this.currentUser?.gymData);
  }

  logout() {
    this.authService.logout().subscribe(() => {
      console.log('Logout successful');
    });
  }
}
```

### Route Protection

```typescript
// In your routing module
import { GymOwnerAuthGuard } from '@core/authentication/gym-owner-auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [GymOwnerAuthGuard]
  }
];
```

## Security Best Practices

### 1. Environment Configuration

```typescript
// environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3400/api',
  tokenStorageKey: 'gym_auth_data'
};
```

### 2. Token Expiry Handling

The authentication service automatically handles token refresh through the HTTP interceptor. When a 401/403 error is received, it:

1. Attempts to refresh the access token
2. Retries the original request with the new token
3. Logs out the user if refresh fails

### 3. Secure Storage Considerations

For production environments, consider:

- Using `httpOnly` cookies instead of localStorage
- Implementing token encryption
- Adding CSP (Content Security Policy) headers
- Using HTTPS only

## Usage Summary

### 1. **Login**: 
```typescript
this.authService.login(email, password).subscribe(result => {
  if (result.success) {
    // User logged in, data automatically stored
  }
});
```

### 2. **Access User Data**:
```typescript
const currentUser = this.authService.getCurrentUser();
const gymId = this.authService.getGymId();
const userId = this.authService.getUserId();
```

### 3. **Make Authenticated API Calls**:
```typescript
// The HTTP interceptor automatically adds the Bearer token
this.http.get('/api/gym-owner/players').subscribe(players => {
  // Handle response
});
```

### 4. **Logout**:
```typescript
this.authService.logout().subscribe(() => {
  // User logged out, redirected to login
});
```

### 5. **Check Authentication Status**:
```typescript
const isLoggedIn = this.authService.isAuthenticated();
```

The implementation automatically handles:
- Token refresh when access token expires
- Logout when refresh token is invalid
- Storage and retrieval of user and gym data
- Secure API communication with authentication headers
- Route protection with authentication guards

This setup provides a complete, production-ready authentication system for your Angular gym owner frontend application.

```javascript
// AuthService.js
class AuthService {
  constructor() {
    this.baseURL = 'http://localhost:3400/api/gym-owner';
  }

  // Login function
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Store authentication data
        const authData = {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userId: data.user.id,
          gymId: data.user.gym._id,
          gymData: {
            gymId: data.user.gym.gymId,
            name: data.user.gym.name,
            city: data.user.gym.city,
            state: data.user.gym.state
          },
          userEmail: data.user.email,
          userRole: data.user.role
        };

        TokenStorage.setAuthData(authData);
        return { success: true, data: authData };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error occurred' };
    }
  }

  // Refresh token function
  async refreshToken() {
    try {
      const refreshToken = TokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success) {
        // Update access token
        localStorage.setItem('accessToken', data.accessToken);
        return { success: true, accessToken: data.accessToken };
      } else {
        // Refresh token is invalid, logout user
        this.logout();
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return { success: false, message: 'Token refresh failed' };
    }
  }

  // Logout function
  async logout() {
    try {
      const refreshToken = TokenStorage.getRefreshToken();
      
      if (refreshToken) {
        await fetch(`${this.baseURL}/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      TokenStorage.clearAuthData();
    }
  }

  // Get user profile
  async getProfile() {
    try {
      const accessToken = TokenStorage.getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(`${this.baseURL}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, message: 'Failed to get profile' };
    }
  }

  // Check authentication status
  isAuthenticated() {
    return TokenStorage.isAuthenticated();
  }

  // Get current user data from storage
  getCurrentUser() {
    return TokenStorage.getAuthData();
  }
}

export default new AuthService();
```

## HTTP Client Setup with Axios

```javascript
// httpClient.js - Axios configuration with auto token refresh
import axios from 'axios';
import AuthService from './AuthService';

// Create axios instance
const httpClient = axios.create({
  baseURL: 'http://localhost:3400/api',
  timeout: 10000,
});

// Request interceptor to add token
httpClient.interceptors.request.use(
  (config) => {
    const token = TokenStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const original = error.config;

    if (error.response?.status === 403 && !original._retry) {
      original._retry = true;

      try {
        const refreshResult = await AuthService.refreshToken();
        
        if (refreshResult.success) {
          // Retry original request with new token
          original.headers.Authorization = `Bearer ${refreshResult.accessToken}`;
          return httpClient(original);
        } else {
          // Refresh failed, redirect to login
          AuthService.logout();
          window.location.href = '/login';
        }
      } catch (refreshError) {
        AuthService.logout();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
```

## React Implementation Example

### Login Component

```jsx
// LoginComponent.jsx
import React, { useState } from 'react';
import AuthService from '../services/AuthService';

const LoginComponent = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await AuthService.login(formData.email, formData.password);
      
      if (result.success) {
        // Login successful - redirect to dashboard
        console.log('Login successful:', result.data);
        console.log('Gym ID:', result.data.gymId);
        console.log('User ID:', result.data.userId);
        console.log('Gym Data:', result.data.gymData);
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Gym Owner Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginComponent;
```

### Dashboard Component

```jsx
// Dashboard.jsx
import React, { useEffect, useState } from 'react';
import AuthService from '../services/AuthService';
import httpClient from '../services/httpClient';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [gymPlayers, setGymPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get current user data from storage
      const currentUser = AuthService.getCurrentUser();
      console.log('Current User:', currentUser);
      console.log('Gym ID:', currentUser.gymId);
      console.log('User ID:', currentUser.userId);

      // Get updated profile from API
      const profileResult = await AuthService.getProfile();
      if (profileResult.success) {
        setUserProfile(profileResult.user);
      }

      // Get gym players using the authenticated HTTP client
      const playersResponse = await httpClient.get('/gym-owner/players');
      setGymPlayers(playersResponse.data.players || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await AuthService.logout();
    window.location.href = '/login';
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="dashboard">
      <header>
        <h1>Gym Owner Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="user-info">
        <h2>Welcome, {currentUser.userEmail}</h2>
        <p>Gym: {currentUser.gymData.name}</p>
        <p>Gym ID: {currentUser.gymData.gymId}</p>
        <p>Location: {currentUser.gymData.city}, {currentUser.gymData.state}</p>
      </div>

      <div className="gym-players">
        <h3>Gym Players ({gymPlayers.length})</h3>
        {/* Render gym players list */}
      </div>
    </div>
  );
};

export default Dashboard;
```

### Protected Route Component

```jsx
// ProtectedRoute.jsx
import React from 'react';
import AuthService from '../services/AuthService';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    window.location.href = '/login';
    return null;
  }

  return children;
};

export default ProtectedRoute;
```

## Security Best Practices

### 1. Token Storage Security
```javascript
// For higher security, consider using httpOnly cookies
// or implementing token encryption for localStorage

// Example: Encrypted storage (requires crypto library)
const EncryptedStorage = {
  setItem: (key, value) => {
    const encrypted = CryptoJS.AES.encrypt(value, 'secret-key').toString();
    localStorage.setItem(key, encrypted);
  },
  
  getItem: (key) => {
    const encrypted = localStorage.getItem(key);
    if (encrypted) {
      const bytes = CryptoJS.AES.decrypt(encrypted, 'secret-key');
      return bytes.toString(CryptoJS.enc.Utf8);
    }
    return null;
  }
};
```

### 2. Auto-logout on Token Expiry
```javascript
// Add to AuthService
startTokenExpiryCheck() {
  setInterval(() => {
    const token = this.getAccessToken();
    if (token) {
      try {
        const decoded = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          this.refreshToken();
        }
      } catch (error) {
        this.logout();
      }
    }
  }, 60000); // Check every minute
}
```

### 3. Environment Configuration
```javascript
// config.js
const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3400/api',
  TOKEN_STORAGE_KEY: process.env.REACT_APP_TOKEN_STORAGE_KEY || 'gym_auth_token',
};

export default config;
```

## Usage Summary

1. **Login**: Use `AuthService.login(email, password)` to authenticate
2. **Token Storage**: All tokens and user data are automatically stored
3. **Accessing Data**: Use `TokenStorage.getUserId()`, `TokenStorage.getGymId()`, etc.
4. **API Calls**: Use the configured `httpClient` for automatic token handling
5. **Logout**: Use `AuthService.logout()` to clear all data

The implementation automatically handles:
- Token refresh when access token expires
- Logout when refresh token is invalid
- Storage and retrieval of user and gym data
- Secure API communication with authentication headers

This setup provides a complete, production-ready authentication system for your gym owner frontend application.
