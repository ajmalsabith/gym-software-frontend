import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dailog',
  templateUrl: './confirm-dailog.component.html',
  styleUrl: './confirm-dailog.component.scss'
})
export class ConfirmDailogComponent {


   constructor(
        public dialogRef: MatDialogRef<ConfirmDailogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { icon?: string; message: string }
      ) {}
    
    
       onConfirm(): void {
    this.dialogRef.close(true); // return true if Yes clicked
  }

  onCancel(): void {
    this.dialogRef.close(false); // return false if No clicked
  }
}
