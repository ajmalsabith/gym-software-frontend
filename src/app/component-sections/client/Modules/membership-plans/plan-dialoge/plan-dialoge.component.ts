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

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PlanDialogeComponent>,
    private tokenService:TokenService,
    private clientservice:ClientService,
    private dialoge:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

  const sessiondata=  this.tokenService.getUserSession()
  this.planForm = this.fb.group({
  _id: [''],
  planName: ['', Validators.required],
  planType: ['', Validators.required],
  durationInMonths: ['', Validators.required],
  price: ['', Validators.required],
  features: this.fb.array([]),   // << FormArray for multiple features
  status: ['Active', Validators.required],
  gymId: [sessiondata?.gymId,Validators.required]
});

  if (data?.row) {
    this.buttonLabel = 'Update';
    this.planForm.patchValue({
      _id: data.row._id,
      planName: data.row.planName,
      planType: data.row.planType,
      durationInMonths: data.row.durationInMonths,
      price: data.row.price,
      status: data.row.status,
      gymId: data.row.gymId
    });

    // Patch features separately
    this.setFeatures(data.row.features);
  }
}


// getter for features form array
get features(): FormArray {
  return this.planForm.get('features') as FormArray;
}

addFeature(value: string = '') {
  this.features.push(this.fb.control(value, Validators.required));
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
    case 'Monthly':
      months = 1;
      break;
    case 'Quarterly':
      months = 3;
      break;
    case 'Yearly':
      months = 12;
      break;
  }

  this.planForm.get('durationInMonths')?.setValue(months);
}

 savePlan() {
  console.log(this.planForm.value);
  
  if (this.planForm.valid) {
    this.loading = true;

    const formValue = this.planForm.value;

    // If _id exists → update, else → insert
    if (formValue._id) {
      this.clientservice.UpdateMembershipPlansByGymID(formValue).subscribe({
        next: (res: any) => {
          console.log("Updated:", res);
          this.loading = false;
                const dialogRef = this.dialoge.open(SaveDailogComponent, {
                  width: '400px',
                  data: { message: "Plan updated successfully" }
                });
                dialogRef.afterClosed().subscribe(() => {        
                });
          this.dialogRef.close(res.plan); // close dialog with result
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    } else {
      this.clientservice.InsertMembershipPlansByGymID(formValue).subscribe({
        next: (res: any) => {
          console.log("Inserted:", res);
          this.loading = false;
           const dialogRef = this.dialoge.open(SaveDailogComponent, {
                  width: '400px',
                  data: { message: "Plan created successfully" }
                });
                dialogRef.afterClosed().subscribe(() => {        
          });
          this.dialogRef.close(res.plan);
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
