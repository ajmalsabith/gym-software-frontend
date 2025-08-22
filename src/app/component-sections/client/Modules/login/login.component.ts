import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { ClientService } from '../../services/client.service';
import { MatDialog } from '@angular/material/dialog';
import { TokenService } from 'app/service/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class ClientLoginComponent {


  constructor( private fb:FormBuilder,private router:Router,private tokenservice:TokenService,
   private adminservice:ClientService,private dailog:MatDialog){
  
      
      const rememberName= localStorage.getItem('clientUsername')
      this.toggleSide=localStorage.getItem('UserRememberMe')
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
  
  
      this.adminservice.ClientLogin(this.loginForm.value).subscribe((res:any)=>{
        console.log(res,'==login response');
  
        this.tokenservice.SetRole(res.Role)
        this.tokenservice.setTokens(res.tokens.accessToken,res.tokens.refreshToken)

  
            if(this.loginForm.get('rememberMe')?.value)
                {
                  localStorage.setItem('UserRememberMe',this.loginForm.get('rememberMe')?.value)
                  localStorage.setItem('clientUsername',this.loginForm.get('email')?.value)
                }
                else
                {
                  localStorage.setItem('UserRememberMe',this.loginForm.get('rememberMe')?.value)
                  localStorage.setItem('clientUsername','') 
                }
               this.isSubmitting = false;
  
                 this.router.navigateByUrl('client/dashboard');
        
      },(err:any)=>{
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
