import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})



export class ApisConfig{


  API_LOCAL_URL:string="http://localhost:3400/"
  API_SERVER_URL:string=""

  // Method POST
  ADMIN_LOGIN_: string = "";
  CLIENT_LOGIN: string = "";
  
  CREATE_GYM: string = "admin/insertgym";
  UPDATE_GYM: string = "admin/updategym";
  CREATE_USER: string = "";
  UPDATE_USER: string = "";


  // Method GET

  GET_GYM_LIST:string="admin/get-gymlist"
  GET_USER_LIST:string=""

  GET_INDIAN_CITIES_LIST:string="common/india-cities"
  GET_INDIAN_STATES_DIST_LIST:string="common/states-districts"







 

}