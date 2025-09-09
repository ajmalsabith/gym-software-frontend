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
    }



    membershipForm!: FormGroup;
  players: any[] = []; // will be fetched from backend
  membershipPlans: any[] = []; // will be fetched from backend
  loading = false;
  buttonLabel = 'Save';


  ngOnInit(): void {
    this.initForm();
    this.loadPlayers();
    this.loadPlans();

    if (this.data?.mode === 'edit' && this.data?.membership) {
      this.membershipForm.patchValue(this.data.membership);
      this.buttonLabel = 'Update';
    } else {
      this.buttonLabel = 'Assign';
    }
  }

  private initForm(): void {
    this.membershipForm = this.fb.group({
      playerId: [null, Validators.required],
      planId: [null, Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [null, Validators.required],

      amount: [null, [Validators.required, Validators.min(1)]],
      paymentType: [null, Validators.required],
      paymentStatus: ['pending', Validators.required],
      transactionId: [''],

      notes: ['']
    });
  }

  // Mock data loaders (replace with service calls)
  private loadPlayers(): void {
    this.players = [
      { id: 1, name: 'John Player' },
      { id: 2, name: 'Alice Smith' },
      { id: 3, name: 'David Miller' }
    ];
  }

  private loadPlans(): void {
    this.membershipPlans = [
      { id: 1, name: 'Monthly Plan', duration: 1 },
      { id: 2, name: 'Quarterly Plan', duration: 3 },
      { id: 3, name: 'Half-Yearly Plan', duration: 6 },
      { id: 4, name: 'Yearly Plan', duration: 12 }
    ];
  }

  onPlanChange(planId: number): void {
    const plan = this.membershipPlans.find(p => p.id === planId);
    if (plan) {
      const startDate: Date = this.membershipForm.get('startDate')?.value || new Date();
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + plan.duration);
      this.membershipForm.patchValue({ endDate });
    }
  }

  saveMembership(): void {
    if (this.membershipForm.invalid) {
      this.membershipForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const payload = this.membershipForm.value;

    // Simulate API call
    setTimeout(() => {
      this.loading = false;
      console.log('Membership Saved:', payload);
      this.dialogRef.close(payload);
    }, 1200);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
