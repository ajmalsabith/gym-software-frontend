# Angular Gym Owner Authentication - Quick Start Guide

## Installation & Setup

### 1. Import Required Modules

In your `app.module.ts` or relevant feature module:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { 
  GymOwnerAuthService, 
  GymOwnerAuthGuard, 
  GymOwnerHttpClient 
} from '@core/authentication';

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    GymOwnerAuthService,
    GymOwnerAuthGuard,
    GymOwnerHttpClient
  ]
})
export class AppModule { }
```

### 2. Configure Routes with Guards

```typescript
import { GymOwnerAuthGuard } from '@core/authentication';

const routes: Routes = [
  { path: 'login', component: GymOwnerLoginComponent },
  { 
    path: 'dashboard', 
    component: GymOwnerDashboardComponent,
    canActivate: [GymOwnerAuthGuard] 
  },
  { 
    path: 'players', 
    component: PlayersComponent,
    canActivate: [GymOwnerAuthGuard] 
  }
];
```

## Quick Usage Examples

### 1. Login Component

```typescript
import { Component } from '@angular/core';
import { GymOwnerAuthService } from '@core/authentication';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="login()">
      <input [(ngModel)]="email" type="email" placeholder="Email" />
      <input [(ngModel)]="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: GymOwnerAuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: (result) => {
        if (result.success) {
          console.log('Logged in successfully!');
          console.log('Gym ID:', result.data?.gymId);
          console.log('User ID:', result.data?.userId);
          // Navigation handled automatically
        }
      },
      error: (error) => console.error('Login failed:', error)
    });
  }
}
```

### 2. Dashboard Component

```typescript
import { Component, OnInit } from '@angular/core';
import { GymOwnerAuthService, GymOwnerHttpClient } from '@core/authentication';

@Component({
  selector: 'app-dashboard',
  template: `
    <div *ngIf="currentUser">
      <h1>Welcome to {{ currentUser.gymData.name }}</h1>
      <p>Email: {{ currentUser.userEmail }}</p>
      <p>Gym ID: {{ currentUser.gymId }}</p>
      <p>Total Players: {{ players.length }}</p>
      <button (click)="logout()">Logout</button>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  currentUser: any = null;
  players: any[] = [];

  constructor(
    private authService: GymOwnerAuthService,
    private httpClient: GymOwnerHttpClient
  ) {}

  ngOnInit() {
    // Get current user data
    this.currentUser = this.authService.getCurrentUser();
    
    // Load gym players
    this.httpClient.getGymPlayers().subscribe({
      next: (response) => this.players = response.players || [],
      error: (error) => console.error('Failed to load players:', error)
    });
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
```

### 3. Making API Calls

```typescript
import { Component } from '@angular/core';
import { GymOwnerHttpClient } from '@core/authentication';

@Component({
  selector: 'app-players'
})
export class PlayersComponent {
  
  constructor(private httpClient: GymOwnerHttpClient) {}

  // Get all gym players
  loadPlayers() {
    this.httpClient.get('api/gym-owner/players').subscribe({
      next: (players) => console.log('Players:', players),
      error: (error) => console.error('Error:', error)
    });
  }

  // Add new player
  addPlayer(playerData: any) {
    this.httpClient.post('api/gym-owner/players', playerData).subscribe({
      next: (result) => console.log('Player added:', result),
      error: (error) => console.error('Error:', error)
    });
  }

  // Update player
  updatePlayer(playerId: string, playerData: any) {
    this.httpClient.put(`api/gym-owner/players/${playerId}`, playerData).subscribe({
      next: (result) => console.log('Player updated:', result),
      error: (error) => console.error('Error:', error)
    });
  }
}
```

### 4. Check Authentication Status

```typescript
import { Component } from '@angular/core';
import { GymOwnerAuthService } from '@core/authentication';

@Component({
  selector: 'app-header'
})
export class HeaderComponent {
  
  constructor(private authService: GymOwnerAuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }

  get gymName(): string {
    const user = this.authService.getCurrentUser();
    return user?.gymData?.name || 'Unknown Gym';
  }
}
```

## Key Features

✅ **Automatic Token Management**: Tokens are automatically stored and retrieved  
✅ **Auto Token Refresh**: Expired tokens are automatically refreshed  
✅ **Route Protection**: Guards prevent unauthorized access  
✅ **HTTP Interceptor**: Automatically adds auth headers to API calls  
✅ **Logout Handling**: Clears all auth data and redirects to login  
✅ **User Data Access**: Easy access to gym and user information  

## Available Methods

### GymOwnerAuthService
- `login(email, password)` - Login user
- `logout()` - Logout user
- `isAuthenticated()` - Check auth status
- `getCurrentUser()` - Get user data
- `getGymId()` - Get gym ID
- `getUserId()` - Get user ID
- `getAccessToken()` - Get access token

### GymOwnerHttpClient
- `get(endpoint)` - GET request with auth
- `post(endpoint, data)` - POST request with auth
- `put(endpoint, data)` - PUT request with auth
- `delete(endpoint)` - DELETE request with auth
- `getGymPlayers()` - Get gym players specifically

### TokenService
- `setAuthData(data)` - Store auth data
- `getAuthData()` - Get auth data
- `clearAuthData()` - Clear auth data
- `isAuthenticated()` - Check auth status

## Data Structure

When you call `getCurrentUser()`, you get:

```typescript
{
  accessToken: "eyJhbGciOiJIUzI1NiIs...",
  refreshToken: "eyJhbGciOiJIUzI1NiIs...",
  userId: "60f7b3b3b3b3b3b3b3b3b3b3",
  gymId: "60f7b3b3b3b3b3b3b3b3b3b4",
  gymData: {
    _id: "60f7b3b3b3b3b3b3b3b3b3b4",
    gymId: "GYM001",
    name: "Elite Fitness Center",
    city: "New York",
    state: "NY"
  },
  userEmail: "trainer@example.com",
  userRole: "trainer"
}
```

This implementation provides a complete, secure, and easy-to-use authentication system for your Angular gym management application!
