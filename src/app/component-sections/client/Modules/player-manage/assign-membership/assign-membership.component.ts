import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from 'app/component-sections/client/services/client.service';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-assign-membership',
  templateUrl: './assign-membership.component.html',
  styleUrl: './assign-membership.component.scss'
})
export class AssignMembershipComponent {


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
  playerId:[{ value:this.data?.PlayerData?._id, disabled: true },Validators.required],
  gymId: [authData?.gymId, Validators.required],
  planId: ['', Validators.required],
  startDate: [new Date(), Validators.required],
  endDate: ['', Validators.required],

  // Payment related
  totalAmount: [{ value: 0, disabled: true }, Validators.required],
  paidAmount: [0, [Validators.required, Validators.min(0)]],
  balanceAmount: [{ value: 0, disabled: true }],

  dueDate: [''],
  paymentType: ['', Validators.required],
  paymentStatus: ['pending', Validators.required],
  transactionId: [''],
  notes: ['']
});

 if (this.data?.mode === 'Edit' && this.data?.membership) {
      this.membershipForm.patchValue(this.data.membership);
      this.buttonLabel = 'Update';
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
    this.initForm();
    this.GetPlayersList();
    this.GetmemBershipPlanList();

   
  }

  private initForm(): void {
   

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
  const total = this.membershipForm.get('totalAmount')?.value || 0;
  const paid = this.membershipForm.get('paidAmount')?.value || 0;
  const balance = total - paid;

  let status = 'pending';
  if (balance === 0 && paid > 0) {
    status = 'paid';
  } else if (balance > 0 && paid > 0) {
    status = 'partially_paid';
  }

  this.membershipForm.patchValue({
    balanceAmount: balance,
    paymentStatus: status
  });

  // If paid/failed/refunded → clear due date
  if (status === 'paid' || status === 'failed' || status === 'refunded') {
    this.membershipForm.patchValue({ dueDate: null });
  }
}



  // Mock data loaders (replace with service calls)
 


 onPlanChange(planId: number): void {
  const plan = this.membershipplanlist.find((p:any) => p._id === planId);
  if (plan) {
    const startDate: Date = this.membershipForm.get('startDate')?.value || new Date();

    // calculate end date based on plan duration
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + plan.duration);

    // patch values
    this.membershipForm.patchValue({
      endDate,
      totalAmount: plan.price,
      paidAmount: 0,
      balanceAmount: plan.price,
      paymentStatus: 'pending',
      dueDate: null
    });
  }

}

onStartDateChange(event: any): void {
  const startDate: Date = event.value || new Date();
  const planId = this.membershipForm.get('planId')?.value;

  if (planId) {
    const plan = this.membershipPlans.find(p => p.id === planId);
    if (plan) {
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + plan.duration);

      this.membershipForm.patchValue({
        endDate,
        startDate
      });
    }
  }
}



 saveMembership(): void {
  if (this.membershipForm.invalid) {
    this.membershipForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  const payload = {
    ...this.membershipForm.getRawValue(), // includes disabled fields
    _id: this.data?.membership?._id // keep id if edit mode
  };

  if (this.data?.mode === 'edit') {
    // ✅ Update existing payment
    this.clientService.updatePayment(payload._id, payload).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Payment updated:', res);
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.loading = false;
        console.error('Update failed:', err);
      }
    });
  } else {
    // ✅ Create new payment
    this.clientService.createPayment(payload).subscribe({
      next: (res) => {
        this.loading = false;
        console.log('Payment created:', res);
        this.dialogRef.close(res);
      },
      error: (err) => {
        this.loading = false;
        console.error('Create failed:', err);
      }
    });
  }
}

  onCancel(): void {
    this.dialogRef.close();
  }

}
