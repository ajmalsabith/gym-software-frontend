import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from 'app/component-sections/client/services/client.service';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-createpayment',
  templateUrl: './createpayment.component.html',
  styleUrl: './createpayment.component.scss'
})
export class CreatepaymentComponent {


  
   paymentForm: FormGroup;
  loading = false;
  buttonLabel = 'Save';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreatepaymentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientserice:ClientService,
    private dailoge:MatDialog,
    private tokenservice:TokenService
  ) {

    const userSession= this.tokenservice.getAuthData()

    this.paymentForm = this.fb.group({
      gymId: [userSession?.gymId,Validators.required],
      playerId: ['',Validators.required],
      payAmount: [null, Validators.required],
      paymentType: [null, Validators.required],
      paymentFor: [null, Validators.required],
      status: ['paid'],
      transactionId: [''],
      notes: ['']
    });
  }

    playerslist:any


    ngOnInit(){
      this.GetPlayersList()
    }

   GetPlayersList(): void {
 const gymId = localStorage.getItem('gymId') 
        this.clientserice.getPlayersListByGymId(gymId).subscribe({
          next: (res: any) => {
            console.log(res,'==userlist');
            
            this.playerslist = res.players;
          },
          error: () => console.log('Failed to fetch Players List'),
        });
      }



  onFullPaymentChange(event: any) {
    if (event.checked) {
      this.paymentForm.patchValue({ status: 'paid' });
    }
  }

  savePayment() {
    if (this.paymentForm.valid) {
      this.loading = true;

      this.clientserice.CreateCusotmPayment(this.paymentForm.value).subscribe((res:any)=>{
        console.log(res,'response');

         const dialogRef = this.dailoge.open(SaveDailogComponent, {
                width: '400px',
                data: { message: res.message }
              });
               this.dialogRef.close(res);
        
      },(err)=>{
        console.log(err);
        this.loading=false
                const dialogRef = this.dailoge.open(ErrorDailogComponent, {
                width: '400px',
                data: { message: err.error.message }
              });
      })
      // send form data back to parent
    }
  }

}
