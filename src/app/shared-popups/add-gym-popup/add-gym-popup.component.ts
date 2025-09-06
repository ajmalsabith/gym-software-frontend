import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-gym-popup',
  template: `
    <div class="popup-container">
      <h2 mat-dialog-title>Add Gym</h2>
      <mat-dialog-content>
        <p>Add gym form coming soon...</p>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSave()">Save</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .popup-container {
      min-width: 300px;
    }
  `]
})
export class AddGymPopupComponent {

  constructor(
    private dialogRef: MatDialogRef<AddGymPopupComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Save logic here
    this.dialogRef.close();
  }
}
