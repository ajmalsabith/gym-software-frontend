import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorDailogComponent } from 'app/layout-store/dialog/error-dailog/error-dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GymOwnerAuthService } from '@core/authentication/gym-owner-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class ClientLoginComponent {

  constructor( 
    private fb: FormBuilder,
    private router: Router,
    private dailog: MatDialog,
    private gymOwnerAuthService: GymOwnerAuthService
  ){
    const rememberName = localStorage.getItem('clientUsername');
    const rememberMe = localStorage.getItem('UserRememberMe');
    
    this.loginForm = this.fb.group({
      email: [rememberName, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [rememberMe === 'true' ? true : false]
    });
  }

  isSubmitting = false;
  loginForm: FormGroup;

  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  submitLogin() {
    this.isSubmitting = true;

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      this.gymOwnerAuthService.login(email, password).subscribe({
        next: (result) => {
          if (result.success && result.data) {
            console.log('Login successful:', result.data);
            console.log('Gym ID:', result.data.gymId);
            console.log('User ID:', result.data.userId);
            console.log('Gym Data:', result.data.gymData);

            this.handleRememberMe();
            this.isSubmitting = false;
            
            // Navigate to dashboard
            this.router.navigateByUrl('client/modules/dashboard');
          } else {
            this.showErrorDialog({ error: { message: result.message || 'Login failed' } });
            this.isSubmitting = false;
          }
        },
        error: (error) => {
          console.log(error.message, '=login error');
          this.showErrorDialog({ error: { message: error.message || 'Login failed' } });
          this.isSubmitting = false;
        }
      });
    } else {
      this.isSubmitting = false;
      this.loginForm.markAllAsTouched();
      return;
    }
  }

  private handleRememberMe() {
    if (this.loginForm.get('rememberMe')?.value) {
      localStorage.setItem('UserRememberMe', 'true');
      localStorage.setItem('clientUsername', this.loginForm.get('email')?.value);
    } else {
      localStorage.setItem('UserRememberMe', 'false');
      localStorage.setItem('clientUsername', '');
    }
  }

  private showErrorDialog(err: any) {
    this.dailog.open(ErrorDailogComponent, {
      width: '350px',
      data: {
        message: err.error?.message || "Server connection failed"
      }
    });
  }

  // Method to get current user info after successful login
  getCurrentUserInfo() {
    const currentUser = this.gymOwnerAuthService.getCurrentUser();
    if (currentUser) {
      return {
        email: currentUser.userEmail,
        role: currentUser.userRole,
        gymName: currentUser.gymData?.name,
        gymId: currentUser.gymData?.gymId,
        location: `${currentUser.gymData?.city}, ${currentUser.gymData?.state}`
      };
    }
    return null;
  }
}

