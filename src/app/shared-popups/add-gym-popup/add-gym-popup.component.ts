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


   fromvalue={
    "name": "Elite Fitness Gym",
    "ownerEmail": "owner@elitefitness.com",
    "subscriptionStatus": "trial",
    "subscriptionStartDate": "2024-02-01T00:00:00.000Z",
    "subscriptionEndDate": "2024-03-02T00:00:00.000Z",
    "daysLeft": 30,
    "isTrial": true,
    "address": {
      "line1": "123 Main Street",
      "city": "Los Angeles",
      "district": "Los Angeles County",
      "state": "California",
      "country": "USA",
      "zip": "90001"
    },
    "logo": "https://elitefitness.com/logo.png",
    "phone": "+1 123-456-7890",
    "website": "https://elitefitness.com"
  }
  



  submit(){
    // if(this.itemForm.invalid){
    //   this.snack.open("Invalid Form Data !","OK",{duration:3000});
    //   return
    // }


    console.log(this.itemForm.value,'form values ...');
    
    this.dbservice.InsertGYm(this.fromvalue).subscribe((res:any)=>{
        this.snack.open(res.message+" "+res.gym.gymId,"OK",{duration:3000});
    },
  (err)=>{
    this.snack.open("Something Went Wrong ! Try Again","OK",{duration:3000});

    // this.snack.open("Server Error!")
  })

  }



}
