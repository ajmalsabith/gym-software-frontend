import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-user-popup',
  template: `
    <div class="popup-container">
      <h2 mat-dialog-title>Add User</h2>
      <mat-dialog-content>
        <p>Add user form coming soon...</p>
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
export class AddUserPopupComponent {

  constructor(
    private dialogRef: MatDialogRef<AddUserPopupComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Save logic here
    this.dialogRef.close();
  }
}
