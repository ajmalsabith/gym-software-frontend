import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ClientService } from 'app/component-sections/client/services/client.service';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-plan-dialoge',
  templateUrl: './plan-dialoge.component.html',
  styleUrls: ['./plan-dialoge.component.scss']
})
export class PlanDialogeComponent {

  planForm: FormGroup;
  buttonLabel: string = 'Save'; // default
  loading = false;
  trainers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PlanDialogeComponent>,
    private tokenService:TokenService,
    private clientservice:ClientService,
    private dialoge:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  const sessiondata=  this.tokenService.getAuthData()
  this.planForm = this.fb.group({
  _id: [''],
  subscriptionId: [{ value: '', disabled: true }], // Auto-generated on backend
  planName: ['', Validators.required],
  planType: ['basic', Validators.required],
  price: ['', [Validators.required, Validators.min(0)]],
  duration: ['', [Validators.required, Validators.min(1)]], // in months
  startDate: ['', Validators.required],
  endDate: ['', Validators.required],
  status: ['pending', Validators.required],
  features: this.fb.array([]),   // << FormArray for multiple features
  description: [''],
  isActive: [true],
  paymentStatus: ['pending', Validators.required],
  autoRenew: [false],
  gymId: [sessiondata?.gymId, Validators.required],
  trainerId: ['', Validators.required]
});

  // Initialize with at least one feature field if creating new
  if (!data?.row) {
    this.addFeature();
  }

  if (data?.row) {
    this.buttonLabel = 'Update';
    this.planForm.patchValue({
      _id: data.row._id,
      subscriptionId: data.row.subscriptionId,
      planName: data.row.planName,
      planType: data.row.planType,
      price: data.row.price,
      duration: data.row.duration,
      startDate: data.row.startDate ? new Date(data.row.startDate).toISOString().split('T')[0] : '',
      endDate: data.row.endDate ? new Date(data.row.endDate).toISOString().split('T')[0] : '',
      status: data.row.status,
      description: data.row.description,
  isActive: data.row.isActive !== undefined ? data.row.isActive : true,
      paymentStatus: data.row.paymentStatus,
      autoRenew: data.row.autoRenew,
      gymId: data.row.gymId,
  trainerId: data.row.trainerId
    });

    // Patch features separately
    this.setFeatures(data.row.features || []);
  } else {
    // Set default start date to today for new plans
    const today = new Date().toISOString().split('T')[0];
    this.planForm.patchValue({
      startDate: today
    });
    this.onStartDateChange(today);
  }

  // Load trainers for this gym for selection
  if (sessiondata?.gymId) {
    this.clientservice.getTrainersList(sessiondata.gymId).subscribe({
      next: (res: any) => {
        const data = res.trainers
        this.trainers = data
      },
      error: () => {
        this.trainers = [];
      }
    });
  }
}


// getter for features form array
get features(): FormArray {
  return this.planForm.get('features') as FormArray;
}

addFeature(value: string = '') {
  this.features.push(this.fb.control(value));
}

removeFeature(index: number) {
  this.features.removeAt(index);
}

setFeatures(features: string[]) {
  this.features.clear(); // remove old values
  features.forEach(f => this.addFeature(f));
}

onPlanTypeChange(planType: string) {
  let months = 0;

  switch (planType) {
    case 'basic':
      months = 1;
      break;
    case 'premium':
      months = 3;
      break;
    case 'custom':
      months = 12;
      break;
  }

  this.planForm.get('duration')?.setValue(months);
  
  // Auto-calculate end date if start date is set
  const startDate = this.planForm.get('startDate')?.value;
  if (startDate) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + months);
    this.planForm.get('endDate')?.setValue(end.toISOString().split('T')[0]);
  }
}

onStartDateChange(startDate: string) {
  if (startDate) {
    const duration = this.planForm.get('duration')?.value || 1;
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + duration);
    this.planForm.get('endDate')?.setValue(end.toISOString().split('T')[0]);
  }
}

 savePlan() {
  console.log(this.planForm.value);
  
  if (this.planForm.valid) {
    this.loading = true;

    const formValue = this.planForm.value;

    // If _id exists → update, else → insert
    if (formValue._id) {
      this.clientservice.updateSubscriptionPlan(formValue).subscribe({
        next: (res: any) => {
          console.log("Updated:", res);
          this.loading = false;
                const dialogRef = this.dialoge.open(SaveDailogComponent, {
                  width: '400px',
                  data: { message: "Subscription plan updated successfully" }
                });
                dialogRef.afterClosed().subscribe(() => {        
                });
          this.dialogRef.close(res); // close dialog with result
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      // Remove _id for creation and let backend auto-generate subscriptionId
      const createData = { ...formValue };
      delete createData._id;
      delete createData.subscriptionId;
      
      this.clientservice.createSubscriptionPlan(createData).subscribe({
        next: (res: any) => {
          console.log("Inserted:", res);
          this.loading = false;
           const dialogRef = this.dialoge.open(SaveDailogComponent, {
                  width: '400px',
                  data: { message: "Subscription plan created successfully" }
                });
                dialogRef.afterClosed().subscribe(() => {        
          });
          this.dialogRef.close(res);
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }
}




}
