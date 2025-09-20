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



   ClearMembershipByid(id:any,incPayment:any): Observable<any> {
    return this.http.put(
      `${this.apiConfig.API_LOCAL_URL}/clearMembership/${id}/${incPayment}`,
      { headers: this.getHeaders() }
    );
  }


  
   DeletePaymentByid(id:any): Observable<any> {
    return this.http.delete(
      `${this.apiConfig.API_LOCAL_URL}/deletepayment/${id}`,
      { headers: this.getHeaders() }
    );
  }



  // dashboard apis

  
  // 1. Balance Due Date Today
  getBalanceDueToday(gymId: string): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}/dueDatetoday/${gymId}`,
      { headers: this.getHeaders() }
    );
  }

  // 2. Expiring Memberships in 5 days
  getExpiringMemberships(gymId: string): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}/expiringMemberships/${gymId}`,
      { headers: this.getHeaders() }
    );
  }

  // 3. Membership Dashboard
  getMembershipDashboard(gymId: string): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}/membershipDashboard/${gymId}`,
      { headers: this.getHeaders() }
    );
  }

  // 4. Most Popular Plans
  getMostPopularPlans(gymId: string): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}/mostePopularplans/${gymId}`,
      { headers: this.getHeaders() }
    );
  }

   GetloadLastPaymentsDashboard(gymId: string): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}/lastpaymentsDashbaord/${gymId}`,
      { headers: this.getHeaders() }
    );
  }

  // 5. Payment Dashboard
  getPaymentDashboard(gymId: string): Observable<any> {
    return this.http.get(
      `${this.apiConfig.API_LOCAL_URL}/paymentDashbaord/${gymId}`,
      { headers: this.getHeaders() }
    );
  }
}
