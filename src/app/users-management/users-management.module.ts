import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersManagementRoutingModule } from './users-management-routing.module';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { PageHeaderComponent } from '@shared';
import { UserListComponent } from './user-list/user-list.component';


@NgModule({
  declarations: [
    UserListComponent
  ],
  imports: [
    CommonModule,
    UsersManagementRoutingModule,
      FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MtxGridModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        PageHeaderComponent,
  ]
})
export class UsersManagementModule { }
