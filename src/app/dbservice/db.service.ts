import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApisConfig } from 'app/Apis/apis.config';

const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'x-api-key': 'GYM_SOFT_43'
});


@Injectable({
  providedIn: 'root'
})
export class DbService {


  constructor(
    private http:HttpClient,
    private globalapis:ApisConfig
  ) { }





  InsertGYm(data:any){
    return this.http.post(this.globalapis.BACKEND_NODE_LOCAL_API+this.globalapis.GYM_INSERT_API,data,{ headers });
  }

  InsertGymUser(data:any){
    return this.http.post(this.globalapis.BACKEND_NODE_LOCAL_API+this.globalapis.GYM_INSERT_API,data,{ headers });
  }



}
