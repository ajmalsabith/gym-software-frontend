import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { TranslateModule } from '@ngx-translate/core';

import { SaveDailogComponent } from './dialog/save-dailog/save-dailog.component';
import { ErrorDailogComponent } from './dialog/error-dailog/error-dailog.component';
import { ConfirmDailogComponent } from './dialog/confirm-dailog/confirm-dailog.component';
import { MembershipClearComponent } from './dialog/membership-clear/membership-clear.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SaveDailogComponent,
    ErrorDailogComponent,
    ConfirmDailogComponent,
    MembershipClearComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MtxButtonModule,
    TranslateModule,
  ]
})
export class StoreModule { }
