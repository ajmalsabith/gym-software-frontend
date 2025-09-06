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

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
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

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  logout(): void {
    this.clearAuthData();
    this.clearSession();
    this.router.navigate(['/auth/login']);
  }

  Clientlogout(): void {
    this.clearAuthData();
    this.clearSession();
    this.router.navigate(['/client-login']);
  }

  private storageKey = 'UserSession';

  // Save full object to sessionStorage
  setUserSession(userData: { role: string; userId: string; gymId: string }) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(userData));
  }

  // Get full object from sessionStorage
  getUserSession(): { role: string; userId: string; gymId: string } | null {
    const data = sessionStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  clearSession() {
    sessionStorage.removeItem(this.storageKey);
  }
}
