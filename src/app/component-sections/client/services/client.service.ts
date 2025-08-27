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

 
// admin apis
  createUser(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.CREATE_USER}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  updateUser(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.UPDATE_USER}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  getUserList(): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.GET_USER_LIST}`,
      { headers: this.getHeaders() }
    );
  }

  getPlayersListByGymId(gymId:any): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.GET_PLYERS_LISTBY_GYMID}?gymId=${gymId}`,
      { headers: this.getHeaders() }
    );
  }


  getGymList(): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.GET_GYM_LIST}`,
      { headers: this.getHeaders() }
    );
  }

  getMembershipPlansByGymID(gymId:any): Observable<any> {
  return this.http.get(
    `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.GET_MEMBERSHIP_PLAN_BY_GYMID}?gymId=${gymId}`,
    { headers: this.getHeaders() }
  );
}


  UpdateMembershipPlansByGymID(data:any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.UPDATE_MEMBERSHIP_PLAN_BY_GYMID}`,data,
      { headers: this.getHeaders() }
    );
  }

  InsertMembershipPlansByGymID(data:any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.INSERT_MEMBERSHIP_PLAN_BY_GYMID}`,data,
      { headers: this.getHeaders() }
    );
  }


}
