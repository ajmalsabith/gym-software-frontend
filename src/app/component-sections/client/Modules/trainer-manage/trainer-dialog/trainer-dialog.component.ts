import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ClientService } from 'app/component-sections/client/services/client.service';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-trainer-dialog',
  templateUrl: './trainer-dialog.component.html',
  styleUrls: ['./trainer-dialog.component.scss']
})
export class TrainerDialogComponent {
  trainerForm: FormGroup;
  buttonLabel: string = 'Save';
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TrainerDialogComponent>,
    private tokenService: TokenService,
    private clientService: ClientService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const authData = this.tokenService.getAuthData();
    
    this.trainerForm = this.fb.group({
      _id: [''],
  name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: [this.data?.mode === 'create' ? 'defaultPassword123' : '', this.data?.mode === 'create' ? [Validators.required, Validators.minLength(8)] : []],
  phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
  age: [null],
  gender: [''],
  dob: [null],
  line1: [''],
  city: [''],
  district: [''],
  state: [''],
  country: [''],
  zip: [''],
  gymId: [authData?.gymId, Validators.required],
  IsStatus: ['active'],
  photo: ['']
    });

    // If editing, populate form and change button label
    if (this.data?.row && this.data?.mode === 'edit') {
      this.buttonLabel = 'Update';
      this.trainerForm.patchValue({
        _id: this.data.row._id,
        name: this.data.row.name || `${this.data.row.firstName || ''} ${this.data.row.lastName || ''}`.trim(),
        email: this.data.row.email,
        phone: this.data.row.phone,
        age: this.data.row.age,
        gender: this.data.row.gender,
        dob: this.data.row.dob ? new Date(this.data.row.dob) : null,
        line1: this.data.row.line1,
        city: this.data.row.city,
        district: this.data.row.district,
        state: this.data.row.state,
        country: this.data.row.country,
        zip: this.data.row.zip,
        gymId: this.data.row.gymId,
        IsStatus: this.data.row.IsStatus || (this.data.row.isActive ? 'active' : 'inactive'),
        photo: this.data.row.photo
      });
      
      // For edit mode, make password optional
      this.trainerForm.get('password')?.clearValidators();
      this.trainerForm.get('password')?.updateValueAndValidity();
    }

    // Auto-calc age from dob when dob changes
    this.trainerForm.get('dob')?.valueChanges.subscribe((val) => {
      if (val) {
        const date = val instanceof Date ? val : new Date(val);
        const age = this.calculateAge(date);
        if (!isNaN(age)) {
          this.trainerForm.get('age')?.setValue(age, { emitEvent: false });
        }
      }
    });
  }


  onLogoSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = (e: any) => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // ✅ Resize image if too large (optional)
      const maxWidth = 800;   // adjust as needed
      const maxHeight = 800;  // adjust as needed
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height *= maxWidth / width;
          width = maxWidth;
        } else {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // ✅ Convert to compressed base64 (JPEG, quality 0.7)
      let base64String = canvas.toDataURL('image/jpeg', 0.7);

      // Ensure it's within 1 MB (retry with lower quality if needed)
      let quality = 0.7;
      while (base64String.length / 1024 > 1024 && quality > 0.2) {
        quality -= 0.1;
        base64String = canvas.toDataURL('image/jpeg', quality);
      }

      this.trainerForm.patchValue({
        photo: base64String
      });

      this.trainerForm.get('photo')?.markAsDirty();
    };
  };

  reader.readAsDataURL(file);
}
  saveTrainer() {
    if (this.trainerForm.valid) {
      this.loading = true;
      const formValue = { ...this.trainerForm.value };

      // Normalize dob to ISO if Date object
      if (formValue.dob instanceof Date && !isNaN(formValue.dob.getTime())) {
        formValue.dob = formValue.dob.toISOString();
      }
      // If age missing but dob provided, compute age
      if ((!formValue.age || isNaN(Number(formValue.age))) && this.trainerForm.get('dob')?.value) {
        const d = this.trainerForm.get('dob')?.value;
        const date = d instanceof Date ? d : new Date(d);
        const age = this.calculateAge(date);
        if (!isNaN(age)) {
          formValue.age = age;
        }
      }

      // Remove empty password for updates
      if (this.data?.mode === 'edit' && !formValue.password) {
        delete formValue.password;
      }

      if (this.data?.mode === 'edit' && formValue._id) {
        // Update existing trainer
  this.clientService.updateTrainer(formValue).subscribe({
          next: (res: any) => {
            console.log("Updated:", res);
            this.loading = false;
            const dialogRef = this.dialog.open(SaveDailogComponent, {
              width: '400px',
              data: { message: "Trainer updated successfully" }
            });
            dialogRef.afterClosed().subscribe(() => {
              this.dialogRef.close(res);
            });
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
            const dialogRef = this.dialog.open(ErrorDailogComponent, {
              width: '400px',
              data: { message: err.error?.message || "Error updating trainer. Please try again." }
            });
          }
        });
      } else {
        // Create new trainer
  const createData = { ...formValue };
        delete createData._id; // Remove _id for creation
        
        this.clientService.createTrainer(createData).subscribe({
          next: (res: any) => {
            console.log("Created:", res);
            this.loading = false;
            const dialogRef = this.dialog.open(SaveDailogComponent, {
              width: '400px',
              data: { message: "Trainer created successfully" }
            });
            dialogRef.afterClosed().subscribe(() => {
              this.dialogRef.close(res);
            });
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
            const dialogRef = this.dialog.open(ErrorDailogComponent, {
              width: '400px',
              data: { message: err.error?.message || "Error creating trainer. Please try again." }
            });
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.trainerForm.controls).forEach(key => {
        this.trainerForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  // Helper method to get form control errors
  getErrorMessage(fieldName: string): string {
    const control = this.trainerForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }

  private calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
}
