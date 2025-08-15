import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { AuthService } from '@core/authentication';
import { ApiServiceService } from 'app/service/api-service.service';
import { SaveDailogComponent } from 'app/layout-store/dialog/save-dailog/save-dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { StoreModule } from 'app/layout-store/store.module';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { TokenService } from 'app/service/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MtxButtonModule,
    TranslateModule,
    StoreModule,

  ],
})
export class LoginComponent {

  constructor( private fb:FormBuilder,private router:Router,private tokenservice:TokenService,
    private auth:AuthService,private apiservcie:ApiServiceService,private dailog:MatDialog){

    
    const rememberName= localStorage.getItem('email')
    this.toggleSide=localStorage.getItem('rememberMe')
  this.loginForm = this.fb.group({
    email: [rememberName, [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe:[this.toggleSide=='true'?true:false]

  });
  }

  toggleSide:string | null =''
  isSubmitting = false;

  loginForm:FormGroup


  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }


  submitLogin(){

    this.isSubmitting = true;

    if(this.loginForm.valid){


    this.apiservcie.login(this.loginForm.value).subscribe((res:any)=>{
      console.log(res,'==login response');

      this.tokenservice.setTokens(res.access,res.refresh)
      localStorage.setItem('user_email', res.user.email);

          if(this.loginForm.get('rememberMe')?.value)
              {
                localStorage.setItem('rememberMe',this.loginForm.get('rememberMe')?.value)
                localStorage.setItem('email',this.loginForm.get('email')?.value)
              }
              else
              {
                localStorage.setItem('rememberMe',this.loginForm.get('rememberMe')?.value)
                localStorage.setItem('email','') 
              }
             this.isSubmitting = false;

               this.router.navigateByUrl('/');
      
    },(err)=>{
      console.log(err.error.message,'=error');

      this.dailog.open(ErrorDailogComponent, {
    width: '350px',
    data: {
      message:err.error?.message|| "Invalid email or password"
    }

    });
      this.isSubmitting = false;
  })

  }else{
    this.isSubmitting = false;

    this.loginForm.markAllAsTouched();
    return;

  }

  }

  
}
