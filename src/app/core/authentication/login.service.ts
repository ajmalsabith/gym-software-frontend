import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Menu } from '@core';
import { GymOwnerLoginResponse } from './interface';
import { ApisConfig } from 'app/Apis/apis.config';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private apisConfig: ApisConfig
  ) {}

  // Gym owner login
  gymOwnerLogin(email: string, password: string): Observable<GymOwnerLoginResponse> {
    const loginUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_LOGIN}`;
    return this.http.post<GymOwnerLoginResponse>(loginUrl, { email, password });
  }

  // Gym owner refresh token
  gymOwnerRefresh(refreshToken: string): Observable<{ success: boolean; accessToken: string }> {
    const refreshUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_REFRESH_TOKEN}`;
    return this.http.post<{ success: boolean; accessToken: string }>(refreshUrl, { refreshToken });
  }

  // Gym owner logout
  gymOwnerLogout(refreshToken: string): Observable<{ success: boolean; message: string }> {
    const logoutUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_LOGOUT}`;
    return this.http.post<{ success: boolean; message: string }>(logoutUrl, { refreshToken });
  }

  // Get gym owner profile
  gymOwnerProfile(): Observable<{ success: boolean; user: any }> {
    const profileUrl = `${this.apisConfig.API_LOCAL_URL}${this.apisConfig.GYM_OWNER_PROFILE}`;
    return this.http.get<{ success: boolean; user: any }>(profileUrl);
  }

  // Menu services
  menu() {
    return this.http.get<{ menu: Menu[] }>('data/menu.json').pipe(map(res => res.menu));
  }

  clientmenu() {
    return this.http.get<{ menu: Menu[] }>('data/clientmenu.json').pipe(map(res => res.menu));
  }
}
