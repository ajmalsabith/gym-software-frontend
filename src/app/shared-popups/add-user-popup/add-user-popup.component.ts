import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DbService } from 'app/dbservice/db.service';

@Component({
  selector: 'app-add-user-popup',
  standalone: true,
  imports: [MatButtonModule,MatCheckboxModule,MatSnackBarModule,ReactiveFormsModule,
      FormsModule,],
  templateUrl: './add-user-popup.component.html',
  styleUrl: './add-user-popup.component.scss'
})
export class AddUserPopupComponent  implements OnInit{
  itemForm!:FormGroup
constructor(
  public dialogRef:MatDialogRef<AddUserPopupComponent>,
  private fb:FormBuilder,
  private snack:MatSnackBar,
  private dbservice:DbService
){}

ngOnInit(): void {
  this.buildForm()
}


buildForm(){
  this.itemForm = this.fb.group({
    role: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    phone: ['', Validators.required],
    gender: ['', Validators.required],
    dob: ['', Validators.required],
    address: this.fb.group({
      line1: ['', Validators.required],
      city: ['', Validators.required],
      district: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      zip: ['', Validators.required]
    })
  });
}



submit(){
  if(this.itemForm.invalid){
   this.snack.open("Invalid FormData","OK",{duration:3000});
    return
  }

  this.dbservice.InsertGymUser(this.itemForm.value)
  .subscribe((res:any)=>{
    if(res.success==true){
      this.snack.open("User Created Successfull !","OK",{duration:3000});
    }
  })


}


}
