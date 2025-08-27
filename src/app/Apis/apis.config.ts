import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})



export class ApisConfig{


  // API URLS
  API_LOCAL_URL:string="http://localhost:3400/"
  API_SERVER_URL:string=""

  // login
  ADMIN_LOGIN: string = "admin/login";
  CLIENT_LOGIN: string = "client/login";
  

  // gym
  GET_GYM_LIST:string="client/get-gymlist"
  CREATE_GYM: string = "admin/insertgym";
  UPDATE_GYM: string = "admin/updategym";


  // users or players
  GET_USER_LIST:string="client/get-userlist"
  CREATE_USER: string = "client/insertuser";
  UPDATE_USER: string = "client/updateuser";
  GET_PLYERS_LISTBY_GYMID: string = "client/get-players-listbygymid";


  // membership plans
  INSERT_MEMBERSHIP_PLAN_BY_GYMID:string="client/insert-membership-plans"
  UPDATE_MEMBERSHIP_PLAN_BY_GYMID:string="client/update-membership-plans"
  GET_MEMBERSHIP_PLAN_BY_GYMID:string="client/get-membership-plans"


  //  common apis 
  GET_INDIAN_CITIES_LIST:string="common/india-cities"
  GET_INDIAN_STATES_DIST_LIST:string="common/states-districts"



  // token
  GET_REFRESH_TOKENS:string="client/refresh-token"







 

}