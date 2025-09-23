import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerManageComponent } from './Modules/player-manage/player-manage.component';
import { MembershipPlansComponent } from './Modules/membership-plans/membership-plans.component';
import { TrainerManageComponent } from './Modules/trainer-manage/trainer-manage.component';
import { PaymentBillingComponent } from './Modules/payment-billing/payment-billing.component';
import { DashboardComponentClient } from './Modules/dashboard/dashboard.component';
import { AttendanceComponent } from './Modules/attendance/attendance.component';

const routes: Routes = [
  { path:'dashboard', component: DashboardComponentClient },
  { path:'players-manage', component: PlayerManageComponent },
  { path:'membership-plans', component: MembershipPlansComponent },
  { path:'trainer-manage', component: TrainerManageComponent },
  { path:'payment-billing', component: PaymentBillingComponent },
  { path:'attendance', component: AttendanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
