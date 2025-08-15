import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})



export class ApisConfig{


  API_LOCAL_URL:string=""
  API_SERVER_URL:string=""

  // Method POST
  USER_LOGIN_: string = "api/login/";
  CLIENT_CREATE: string = "/api/clients/create/";
  ASIGN_PERMISSIONS: string = "api/assign-permission/";
  
  CREATE_MODULE: string = "/api/create-module/";
  CREATE_ROLE: string = "api/create-role/";
  CREATE_STAFF: string = "/api/staff/create/";
  CREATE_CANTYPE: string = "api/can-types/create/";
  CREATE_BATCH: string ="/api/batch/create/";


  REFRESH_TOKENS:string="api/refresh/"

  // Method GET

  GET_MODULES:string="api/modules/"
  GET_ROLES:string="/api/roles/"

  GET_CLIENTS:string="api/clients/"
  CANTYPE_LIST:string="api/can-details-list/"
  GET_BATCHES :string = 'api/batch/list/';
  GET_PERMISSION :string = 'api/roles/';
  //Method PUT

  CLIENT_UPDATE: string = "api/clients/";
  STAFF_UPDATE: string = "api/staff/";
  CANTYPE_UPDATE: string = 'api/can-types/';
  BATCH_UPDATE: string="api/batch/";





 

}