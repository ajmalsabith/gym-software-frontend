import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GymOwnerAuthService } from './gym-owner-auth.service';
import { ApisConfig } from 'app/Apis/apis.config';

@Injectable({
  providedIn: 'root'
})
export class GymOwnerHttpClient {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private authService: GymOwnerAuthService,
    private apisConfig: ApisConfig
  ) {
    this.baseUrl = this.apisConfig.API_LOCAL_URL;
  }

  /**
   * GET request with automatic authentication
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, { headers, params });
  }

  /**
   * POST request with automatic authentication
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }

  /**
   * PUT request with automatic authentication
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }

  /**
   * DELETE request with automatic authentication
   */
  delete<T>(endpoint: string): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, { headers });
  }

  /**
   * PATCH request with automatic authentication
   */
  patch<T>(endpoint: string, body: any): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, body, { headers });
  }

  /**
   * Get gym players
   */
  getGymPlayers(): Observable<any> {
    return this.get(this.apisConfig.GYM_OWNER_PLAYERS);
  }

  /**
   * Get authenticated headers
   */
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
