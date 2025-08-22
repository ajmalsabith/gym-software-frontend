import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApisConfig } from 'app/Apis/apis.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

 constructor(private http: HttpClient,private apiConfig:ApisConfig) {}


  private getHeaders(): HttpHeaders {
    
  const token = localStorage.getItem('access_token');
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

   return headers;
  }

    ClientLogin(data: any): Observable<any> {
      return this.http.post(
        `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.CLIENT_LOGIN}`,
        data,
      );
    }



  getRefreshTokens(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.GET_REFRESH_TOKENS}`,
      data,
    )
  }
  
}
