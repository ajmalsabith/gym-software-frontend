import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DbService } from 'app/dbservice/db.service';

@Component({
  selector: 'app-add-gym-popup',
  standalone:true,
  imports:[MatButtonModule,MatCheckboxModule,MatSnackBarModule],
  templateUrl: './add-gym-popup.component.html',
  styleUrl: './add-gym-popup.component.scss'
})
export class AddGymPopupComponent implements OnInit {

  itemForm!:FormGroup

  constructor(
   public dialogRef:MatDialogRef<AddGymPopupComponent>,
   private fb:FormBuilder,
   private snack:MatSnackBar,
   private dbservice:DbService
  ){}

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm(){
    this.itemForm = this.fb.group({
      _id:[''],
      name:["",[Validators.required]],
      owner:['',[Validators.required]],
      state:[''],
      district:[''],
      city:['',[Validators.required]],
      mobile:[''],
      website:[''],
      email:[''],
      active:[false]
    })
  }




  submit(){
    if(this.itemForm.invalid){
      this.snack.open("Invalid Form Data !","OK",{duration:3000});
      return
    }

//  service 


    this.dbservice.methodPost("gym/add-gym",this.itemForm.value).subscribe((res:any)=>{
      if(res.success==1){
        this.snack.open("Gym Created Successfull!","OK",{duration:3000});
      }else{
        this.snack.open("Something Went Wrong ! Try Again","OK",{duration:3000});
      }
    },
  (err)=>{
    this.snack.open("Server Error!")
  })

  }



}
