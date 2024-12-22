import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddGymPopupComponent } from './add-gym-popup/add-gym-popup.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    AddGymPopupComponent
  ],
  imports: [
    CommonModule,
    // MatButtonModule,
     MatCardModule,
     MatDialogModule,
     MatFormFieldModule
  ]
})
export class SharedPopupsModule { }
