import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})

export class ApisConfig{

  // API URLS
  API_LOCAL_URL:string="http://localhost:3400/api/admin"
  API_SERVER_URL:string=""

  // login - Using gym owner login for all authentication
  ADMIN_LOGIN: string = "/login";
  GYM_OWNER_LOGIN: string = "/login";
  
  // gym owner APIs
  GYM_OWNER_REFRESH_TOKEN: string = "/refresh-token";
  GYM_OWNER_LOGOUT: string = "/logout";
  GYM_OWNER_PROFILE: string = "/profile";
  GYM_OWNER_PLAYERS: string = "/players";


  // users or players
  GET_USER_LIST:string="/get-userlist"
  CREATE_USER: string = "/insertuser";
  UPDATE_USER: string = "/updateuser";
  GET_PLYERS_LISTBY_GYMID: string = "/get-players-listbygymid";
  
  // New player APIs as per documentation
  PLAYERS: string = "/players"; // For both GET and POST operations
  PLAYER_BYID: string = "/playerbyid"; // For both GET and POST operations
  PLAYERS_UPDATE: string = "/playersupdate"; // For both GET and POST operations
  PLAYERS_INSERT: string = "/playersinsert"; // For both GET and POST operations

  // membership plans
  INSERT_MEMBERSHIP_PLAN_BY_GYMID:string="/insert-membership-plans"
  UPDATE_MEMBERSHIP_PLAN_BY_GYMID:string="/update-membership-plans"
  GET_MEMBERSHIP_PLAN_BY_GYMID:string="/subscriptions"

  //  common apis 
  GET_INDIAN_CITIES_LIST:string="common/india-cities"
  GET_INDIAN_STATES_DIST_LIST:string="common/states-districts"


  // payment history

  GET_PAYMENT_HISTORY_BY_GYMID:string="/getpayments"
  GET_MEMBERSHIP_BY_PLAYER:string="/getmembership"
  INSERT_MEMBERSHIP_WITH_PAYMENT:string="/insertmembershipAndpayment"
  UPDATE_MEMBERSHIP_WITH_PAYMENT:string="/UpdatemembershipAndpayment"
  UPDATE_PAYMENT_:string="/Updatepayment"



  MEMBERSHIP_DASHBOARDS:string="/membershipDashboard"









 

}