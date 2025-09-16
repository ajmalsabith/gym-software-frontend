import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';



import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { PageHeaderComponent } from '@shared';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';



import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterLink } from '@angular/router';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from 'app/layout-store/store.module';
import { ClientLoginComponent } from './Modules/login/login.component';
import { PlayerManageComponent } from './Modules/player-manage/player-manage.component';
import { MembershipPlansComponent } from './Modules/membership-plans/membership-plans.component';
import { PlanDialogeComponent } from './Modules/membership-plans/plan-dialoge/plan-dialoge.component';
import { TrainerManageComponent } from './Modules/trainer-manage/trainer-manage.component';
import { TrainerDialogComponent } from './Modules/trainer-manage/trainer-dialog/trainer-dialog.component';
import { AssignMembershipComponent } from './Modules/player-manage/assign-membership/assign-membership.component';
import { PaymentBillingComponent } from './Modules/payment-billing/payment-billing.component';

@NgModule({
  declarations: [
  ClientLoginComponent ,
  PlayerManageComponent,
  MembershipPlansComponent,
  PlanDialogeComponent,
  TrainerManageComponent,
  TrainerDialogComponent,
  AssignMembershipComponent,
  PaymentBillingComponent
  ],
  imports: [
    CommonModule,
     ClientRoutingModule,
     FormsModule,
     ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MtxGridModule,
        MatInputModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatSelectModule,
        PageHeaderComponent,
            MatTabsModule,
            MatIconModule,
            MatCardModule,
            MatDatepickerModule,
            MatNativeDateModule,
            MatDialogModule,
             MatSlideToggleModule,
             MatTableModule,
             MatCheckboxModule,
             MatTooltipModule,
            MatProgressSpinnerModule,
            MatPaginator,
                RouterLink,
                MtxButtonModule,
                TranslateModule,
                StoreModule,
  ]
})
export class ClientModule { }
