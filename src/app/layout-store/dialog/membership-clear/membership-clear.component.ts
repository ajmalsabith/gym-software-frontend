import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-membership-clear',
  templateUrl: './membership-clear.component.html',
  styleUrls: ['./membership-clear.component.scss'] // fixed typo
})
export class MembershipClearComponent {

  checkboxValue = false; // stores whether the checkbox is checked

  constructor(
    public dialogRef: MatDialogRef<MembershipClearComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { 
      icon?: string; 
      message: string; 
      checkboxLabel?: string 
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close({ delete: true, checkbox: this.checkboxValue }); 
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
