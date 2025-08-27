import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router:Router) { }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }



  Clientlogout(): void {
    this.clearTokens();
    this.clearSession()
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
