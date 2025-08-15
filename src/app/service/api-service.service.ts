import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApisConfig } from 'app/Apis/apis.config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {
  constructor(private http: HttpClient,private apiConfig:ApisConfig) {}

  private getHeaders(): HttpHeaders {
    
  const token = localStorage.getItem('access_token');
  let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

    return headers;
  }

  // ------------------ POST METHODS ------------------

  login(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_SERVER_URL}${this.apiConfig.USER_LOGIN_}`,
      data,
    );
  }

  createClient(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_SERVER_URL}${this.apiConfig.CLIENT_CREATE}`,
      data,
      { headers: this.getHeaders() }
    );
  }
  

  RefreshTokens(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_SERVER_URL}${this.apiConfig.REFRESH_TOKENS}`,
      data,
    );
  }
  



  


  assignPermissions(data: any): Observable<any> {
  return this.http.post(
    `${this.apiConfig.API_SERVER_URL}${this.apiConfig.ASIGN_PERMISSIONS}`,
    data,
    { headers: this.getHeaders() }
  );
}

  createModule(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_SERVER_URL}${this.apiConfig.CREATE_MODULE}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  createRole(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_SERVER_URL}${this.apiConfig.CREATE_ROLE}`,
      data,
      { headers: this.getHeaders() }
    );
  }
  

  createStaff(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_SERVER_URL}${this.apiConfig.CREATE_STAFF}`,
      data,
      { headers: this.getHeaders() }
    );
  }


  createCanType(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_SERVER_URL}${this.apiConfig.CREATE_CANTYPE}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  createBatch(data: any): Observable<any> {
      return this.http.post(
        `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.CREATE_BATCH}`, 
        data,
        { headers: this.getHeaders() }
      );
    }


  // ------------------ GET METHODS ------------------

  getModules(): Observable<any> {
  return this.http.get(
    `${this.apiConfig.API_SERVER_URL}${this.apiConfig.GET_MODULES}`,
    { headers: this.getHeaders() }
  );
}




  getClients(): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_SERVER_URL}${this.apiConfig.GET_CLIENTS}`,
      { headers: this.getHeaders() }
    );
  }

  getStaffs(): Observable<any> {
    return this.http.get(
        `${this.apiConfig.API_SERVER_URL}api/staff/`,
        { headers: this.getHeaders() }
    );
  }

  getCanTypes(): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.CANTYPE_LIST}`,
      { headers: this.getHeaders() }
    );
  }
  getBatches(): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.GET_BATCHES}`,
      { headers: this.getHeaders() }
    );
  }

  getRoles(): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_SERVER_URL}${this.apiConfig.GET_ROLES}`,
      { headers: this.getHeaders() }
    );
  }

  getModulesWithPermissions(roleId: number): Observable<any> {
  return this.http.get(
    `${this.apiConfig.API_SERVER_URL}${this.apiConfig.GET_PERMISSION}${roleId}/modules/`,
    { headers: this.getHeaders() }
  );
}

  // ------------------ PUT METHODS ------------------

  
  updateClient(id: number, data: any): Observable<any> {
    return this.http.put(
        `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.CLIENT_UPDATE}${id}/update/`,
      data,
      { headers: this.getHeaders() }
    );
  }
  updateStaff(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.apiConfig.API_SERVER_URL}${this.apiConfig.STAFF_UPDATE}${id}/update/`,
      data,
      { headers: this.getHeaders() }
    );
  }

  updateCanType(id: number, data: any): Observable<any> {
  return this.http.put(
    `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.CANTYPE_UPDATE}${id}/update/`,
    data,
    { headers: this.getHeaders() }
  );
}
  updateBatch(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.BATCH_UPDATE}${id}/update/`,
      data,
      { headers: this.getHeaders() }
    );
  }



}