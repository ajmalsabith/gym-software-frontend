import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  API_URL = 'http://localhost:3000/'

  constructor(
    private http:HttpClient
  ) { }



  MethodGet(url:string){
    return this.http.get(this.API_URL+url);
  }

  methodPost(url:string,body:any){
    return this.http.post(this.API_URL+url,body);
  }



}
