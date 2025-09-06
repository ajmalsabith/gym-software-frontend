import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GymOwnerAuthService } from '@core/authentication/gym-owner-auth.service';

@Component({
  selector: 'app-gym-owner-login',
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Gym Owner Login</h2>
          <p>Access your gym management dashboard</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          
          <!-- Error Message -->
          <div *ngIf="errorMessage" class="alert alert-danger">
            {{ errorMessage }}
          </div>

          <!-- Email Field -->
          <div class="form-group">
            <label for="email">Email Address</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="Enter your email"
            />
            <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="invalid-feedback">
              <small *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</small>
              <small *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</small>
            </div>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              formControlName="password"
              class="form-control"
              [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              placeholder="Enter your password"
            />
            <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="invalid-feedback">
              <small *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</small>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary btn-block"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>

        </form>

        <!-- User Info Display (after login) -->
        <div *ngIf="currentUser" class="user-info mt-4">
          <h4>Welcome, {{ currentUser.userEmail }}!</h4>
          <div class="gym-info">
            <p><strong>Gym:</strong> {{ currentUser.gymData.name }}</p>
            <p><strong>Gym ID:</strong> {{ currentUser.gymData.gymId }}</p>
            <p><strong>Location:</strong> {{ currentUser.gymData.city }}, {{ currentUser.gymData.state }}</p>
            <p><strong>Role:</strong> {{ currentUser.userRole }}</p>
          </div>
          <button (click)="onLogout()" class="btn btn-secondary">Logout</button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-header h2 {
      color: #333;
      margin-bottom: 0.5rem;
    }

    .login-header p {
      color: #666;
      margin: 0;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .btn {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-block {
      width: 100%;
    }

    .alert {
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }

    .alert-danger {
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      color: #721c24;
    }

    .spinner-border {
      width: 1rem;
      height: 1rem;
      border: 0.125em solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spinner-border 0.75s linear infinite;
    }

    .spinner-border-sm {
      width: 0.875rem;
      height: 0.875rem;
      border-width: 0.125em;
    }

    @keyframes spinner-border {
      to { transform: rotate(360deg); }
    }

    .user-info {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 4px;
      border: 1px solid #e9ecef;
    }

    .gym-info p {
      margin: 0.25rem 0;
    }

    .me-2 {
      margin-right: 0.5rem;
    }

    .mt-4 {
      margin-top: 1.5rem;
    }
  `]
})
export class GymOwnerLoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  currentUser: any = null;
  returnUrl = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: GymOwnerAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Get return URL from route parameters or default to dashboard
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.currentUser = this.authService.getCurrentUser();
      // Optionally redirect to dashboard
      // this.router.navigate([this.returnUrl]);
    }

    // Subscribe to authentication state changes
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUser = this.authService.getCurrentUser();
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result.success) {
            console.log('Login successful:', result.data);
            console.log('Gym ID:', result.data?.gymId);
            console.log('User ID:', result.data?.userId);
            console.log('Gym Data:', result.data?.gymData);
            
            this.currentUser = result.data;
            
            // Redirect to dashboard or return URL
            this.router.navigate([this.returnUrl]);
          } else {
            this.errorMessage = result.message || 'Login failed';
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'An error occurred during login';
          console.error('Login error:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.currentUser = null;
        this.loginForm.reset();
        console.log('Logout successful');
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Clear local data even if API call fails
        this.currentUser = null;
        this.loginForm.reset();
      }
    });
  }
}
