import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApisConfig } from 'app/Apis/apis.config';
import { Observable } from 'rxjs';
import { GymOwnerAuthService } from '@core/authentication/gym-owner-auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

 constructor(
   private http: HttpClient,
   private apiConfig: ApisConfig,
   private gymOwnerAuthService: GymOwnerAuthService
 ) {}

  private getHeaders(): HttpHeaders {
    // Use the new gym owner auth service to get the access token
    const token = this.gymOwnerAuthService.getAccessToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }



  getPlayersListByGymId(gymId:any): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.PLAYERS}?gymId=${gymId}`,
      { headers: this.getHeaders() }
    );
  }

   getPlayerById(gymId:any): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.PLAYER_BYID}?id=${gymId}`,
      { headers: this.getHeaders() }
    );
  }

  // New method to add/create a player
  createPlayer(playerData: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.PLAYERS_INSERT}`,
      playerData,
      { headers: this.getHeaders() }
    );
  }

 // client.service.ts
UpdatePlayer(playerData: any): Observable<any> {
  return this.http.put(
    `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.PLAYERS_UPDATE}/${playerData._id}`,
    playerData,
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

  // New subscription methods based on backend schema
  createSubscriptionPlan(data:any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_LOCAL_URL}/subscriptions`,data,
      { headers: this.getHeaders() }
    );
  }

  getSubscriptionPlans(gymId:any): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}/subscriptions?gymId=${gymId}`,
      { headers: this.getHeaders() }
    );
  }

  updateSubscriptionPlan(data:any): Observable<any> {
    return this.http.put(
      `${this.apiConfig.API_LOCAL_URL}/subscriptions/${data._id}`,data,
      { headers: this.getHeaders() }
    );
  }

  // Trainer management methods
  getTrainersList(gymId: any): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}/trainers?gymId=${gymId}`,
      { headers: this.getHeaders() }
    );
  }

  createTrainer(trainerData: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_LOCAL_URL}/trainers`,
      trainerData,
      { headers: this.getHeaders() }
    );
  }

  updateTrainer(trainerData: any): Observable<any> {
    return this.http.put(
      `${this.apiConfig.API_LOCAL_URL}/trainers/${trainerData._id}`,
      trainerData,
      { headers: this.getHeaders() }
    );
  }

  deleteTrainer(trainerId: string): Observable<any> {
    return this.http.delete(
      `${this.apiConfig.API_LOCAL_URL}/trainers/${trainerId}`,
      { headers: this.getHeaders() }
    );
  }



   // ✅ Create new payment record
  createMembership(data: any): Observable<any> {
    return this.http.post(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.INSERT_MEMBERSHIP_WITH_PAYMENT}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // ✅ Update existing payment record
  updateMembership(id: string, data: any): Observable<any> {
    return this.http.put(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.UPDATE_MEMBERSHIP_WITH_PAYMENT}/${id}`,
      data,
      { headers: this.getHeaders() }
    );
  }

  // ✅ Get all payments for a gym
  getPaymentsByGym(gymId: string): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.GET_PAYMENT_HISTORY_BY_GYMID}/${gymId}`,
      { headers: this.getHeaders() }
    );
  }

   getMembershipByPlayerId(playerid: string): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}${this.apiConfig.GET_MEMBERSHIP_BY_PLAYER}/${playerid}`,
      { headers: this.getHeaders() }
    );
  }
}
