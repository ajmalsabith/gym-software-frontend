import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from 'app/component-sections/client/services/client.service';
import { ConfirmDailogComponent } from 'app/layout-store/dialog/confirm-dailog/confirm-dailog.component';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { MembershipClearComponent } from 'app/layout-store/dialog/membership-clear/membership-clear.component';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-assign-membership',
  templateUrl: './assign-membership.component.html',
  styleUrl: './assign-membership.component.scss'
})
export class AssignMembershipComponent {

selectedTabIndex=0
fullPaymentSelected = false;

    constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AssignMembershipComponent>,
      private tokenService:TokenService ,
      private clientService: ClientService,
      private dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {

            const authData = this.tokenService.getAuthData();


this.membershipForm = this.fb.group({
  // Membership fields
  _id:[''],
  gymId: [authData?.gymId, Validators.required],
  playerId: [ {value:this.data.PlayerData?._id,disabled:true}, Validators.required],
  planId: ['', Validators.required],
  startDate: [new Date(), Validators.required],
  endDate: ['', Validators.required],
  totalAmount: [0, Validators.required],
  balance: [0],

  // Payment fields
  paidAmount: [0, Validators.required],
  dueDate: [''],
  payAmount:[0,Validators.required],
  paymentType: ['', Validators.required],
  status: ['', Validators.required],
  transactionId: [''],
  notes: [''],
});





this.selectedTabIndex = 0;


 if (this.data?.mode === 'Edit' && this.data?.membership) {
      this.membershipForm.patchValue(this.data.membership);
      this.buttonLabel = 'Update';
      if(this.data?.membership.status=='completed'){
        this.membershipForm.disable()
      }
    } else {
      this.buttonLabel = 'Create';
    }
    }



    membershipForm!: FormGroup;
  players: any[] = []; // will be fetched from backend
  membershipPlans: any[] = []; // will be fetched from backend
  loading = false;
  buttonLabel = 'Save';


  ngOnInit(): void {
    this.GetPlayersList();
    this.GetmemBershipPlanList();
  }


  nextTab() {
  if (
      this.membershipForm.get('planId')?.valid &&
      this.membershipForm.get('startDate')?.valid &&
      this.membershipForm.get('totalAmount')?.value > 0) {
    this.selectedTabIndex = 1;
  } else {
    this.membershipForm.markAllAsTouched();
  }
}

prevTab() {
  this.selectedTabIndex = 0;
}


openConfirmDialog() {
 const dialogRef = this.dialog.open(MembershipClearComponent, {
  width: '350px',
  data: { 
    message: 'Are you sure you want to clear membership for this player?',
    checkboxLabel: 'Also delete payments'
  }
});


  dialogRef.afterClosed().subscribe(result => {
    if (result) {
       this.clearmembership(result.checkbox)
      console.log('Confirmed');
    } 
  });
}


clearmembership(incPayment:any){
 const id= this.membershipForm.get('_id')?.value
        this.clientService.ClearMembershipByid(id,incPayment).subscribe({
          next: (res: any) => {
             const dialogRef = this.dialog.open(SaveDailogComponent, {
        width: '400px',
        data: { message: res.message }
        
      });
             this.dialogRef.close(res);

          },
          error: () => console.log('Failed to Clear Membership'),
    });
}


 
onFullPaymentChange(event:any) {
    const paidAmount = this.membershipForm.get('paidAmount')?.value || 0;
    const total = this.membershipForm.get('totalAmount')?.value || 0;

    const FullTotal = total-paidAmount
    console.log(FullTotal,'==bantototal');
    
    console.log(event.checked);
    
  if (event.checked) {
    this.membershipForm.patchValue({payAmount:FullTotal});
        this.updateBalance()

  } else {
    this.membershipForm.patchValue({ payAmount: 0 });
    this.updateBalance()
  }
}

membershipplanlist:any
   GetmemBershipPlanList(): void {
 const gymId = localStorage.getItem('gymId') 
        this.clientService.getSubscriptionPlans(gymId).subscribe({
          next: (res: any) => {
           this.membershipplanlist = res.subscriptions
          },
          error: () => console.log('Failed to fetch Subscription Plans'),
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


updateBalance(): void {
  const paidAmount = this.membershipForm.get('paidAmount')?.value || 0;
  const payAmount = this.membershipForm.get('payAmount')?.value || 0;
  const total = this.membershipForm.get('totalAmount')?.value || 0;

  const newPaid = paidAmount + payAmount;
  const balance = total - newPaid;

  let status: string = 'pending';
  if (balance === 0 && newPaid > 0) {
    status = 'paid';
  } else if (balance > 0 && newPaid > 0) {
    status = 'partially_paid';
  }

  this.membershipForm.patchValue({
    balance: balance,
    status: status
  });

  // Clear due date if final payment done or payment not expected
  if (['paid', 'failed', 'refunded'].includes(status)) {
    this.membershipForm.patchValue({ dueDate: null });
  }
}


onPlanChange(planId: string): void {
  const plan = this.membershipplanlist.find((p: any) => p._id === planId);
  if (plan) {
    const startDate: Date = this.membershipForm.get('startDate')?.value || new Date();

    // calculate end date based on plan duration (months)
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + plan.duration);

    this.membershipForm.patchValue({
      endDate,
      totalAmount: plan.price,
      paidAmount: 0,
      balanceAmount: plan.price,
      status: 'pending',
      dueDate: null
    });
  }
}

onStartDateChange(event: any): void {
  const startDate: Date = event.value || new Date();
  const planId = this.membershipForm.get('planId')?.value;

  if (planId) {
    const plan = this.membershipplanlist.find((p: any) => p._id === planId);
    if (plan) {
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + plan.duration);

      this.membershipForm.patchValue({
        startDate,
        endDate
      });
    }
  }
}


 saveMembership(): void {
  if (this.membershipForm.invalid) {
    this.membershipForm.markAllAsTouched();
    return;
  }

  const paidAmount = this.membershipForm.get('paidAmount')?.value || 0;
  const payAmount = this.membershipForm.get('payAmount')?.value || 0;
  this.membershipForm.patchValue({paidAmount:paidAmount+payAmount})

  this.loading = true;
  const payload = {
    ...this.membershipForm.getRawValue(), // includes disabled fields
    _id: this.data?.membership?._id // keep id if edit mode
  };

  if (this.data?.membership?._id) {
    // ✅ Update existing payment
    this.clientService.updateMembership(payload._id, payload).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Membership updated:', res);
      const dialogRef = this.dialog.open(SaveDailogComponent, {
        width: '400px',
        data: { message: res.message }
      });
       this.dialogRef.close(res);
      },
      error: (err) => {
        this.loading = false;
        const dialogRef = this.dialog.open(ErrorDailogComponent, {
        width: '400px',
        data: { message: err.error.message }
      });
        console.error('Update failed:', err);
      }
    });
  } else {
    // ✅ Create new payment
    this.clientService.createMembership(payload).subscribe({
      next: (res) => {
        this.loading = false;
         console.log('Membership updated:', res);
      const dialogRef = this.dialog.open(SaveDailogComponent, {
        width: '400px',
        data: { message: res.message }
      });
       this.dialogRef.close(res);
      },
      error: (err) => {
        this.loading = false;
        console.error('Create failed:', err);
         const dialogRef = this.dialog.open(ErrorDailogComponent, {
        width: '400px',
        data: { message: err.error.message }
      });
      }
    });
  }
}

  onCancel(): void {
    this.dialogRef.close();
  }

}
