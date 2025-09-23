import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from 'app/component-sections/client/services/client.service';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-mark-attendance-dailog',
  templateUrl: './mark-attendance-dailog.component.html',
  styleUrl: './mark-attendance-dailog.component.scss'
})
export class MarkAttendanceDailogComponent {


  attendanceForm:FormGroup
    constructor(
          public dialogRef: MatDialogRef<MarkAttendanceDailogComponent>,private clientService:ClientService,private fb:FormBuilder,
          @Inject(MAT_DIALOG_DATA) public data: { icon?: string; message: string },private dailoge:MatDialog,private tokenservice:TokenService,
        ) {
  const sessionData = this.tokenservice.getAuthData();

    this.attendanceForm = this.fb.group({
      gymId: [sessionData?.gymId, Validators.required],        // Gym selection
      playerId: ['', Validators.required],     // Player selection
      markedBy: ['admin', Validators.required],     // e.g., 'admin', 'trainer'
      date: [new Date(), Validators.required],   // Default today
      lat: [null],                               // optional latitude
      lng: [null],                               // optional longitude
      notes: ['']                                // optional notes
    });
          this.GetPlayersList()
        }

    onCancel(): void {
    this.dialogRef.close(false); // return false if No clicked
  }


  submitAttendance() {
  if (this.attendanceForm.invalid) {
    this.attendanceForm.markAllAsTouched();
    return;
  }

  const formData = this.attendanceForm.value;

  // Example: mark as present (you can switch to markAbsent if needed)
  this.clientService.markPresent(formData).subscribe({
    next: (res: any) => {
      if (res.success) {
        console.log('', res.data);
         const dialogRef = this.dailoge.open(SaveDailogComponent, {
                width: '400px',
                data: { message:"Attendance marked successfully" }
          });
        this.dialogRef.close(res);
      }
    },
    error: (err) => {
        const dialogRef = this.dailoge.open(ErrorDailogComponent, {
              width: '400px',
              data: { message: err.error.message }
        });
      console.error('Error marking attendance:', err);
    }
  });
}




    playerslist:any

   GetPlayersList(): void {
 const gymId = localStorage.getItem('gymId') 
        this.clientService.getPlayersListByGymId(gymId).subscribe({
          next: (res: any) => {
            console.log(res,'==userlist');
            
            this.playerslist = res.players;
          },
          error: () => console.log('Failed to fetch Players List'),
        });
      }
}
