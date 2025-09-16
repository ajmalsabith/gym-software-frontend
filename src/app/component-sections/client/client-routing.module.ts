import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerManageComponent } from './Modules/player-manage/player-manage.component';
import { MembershipPlansComponent } from './Modules/membership-plans/membership-plans.component';
import { TrainerManageComponent } from './Modules/trainer-manage/trainer-manage.component';
import { PaymentBillingComponent } from './Modules/payment-billing/payment-billing.component';

const routes: Routes = [
  { path:'players-manage', component: PlayerManageComponent },
  { path:'membership-plans', component: MembershipPlansComponent },
  { path:'trainer-manage', component: TrainerManageComponent },
  { path:'payment-billing', component: PaymentBillingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
