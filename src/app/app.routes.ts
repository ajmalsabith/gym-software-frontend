import { Routes } from '@angular/router';
import { authGuard } from '@core';
import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from '@theme/auth-layout/auth-layout.component';
import { DashboardComponent } from './admin-components/dashboard/dashboard.component';
import { LoginComponent } from './admin-components/sessions/login/login.component';
import { RegisterComponent } from './admin-components/sessions/register/register.component';

export const routes: Routes = [

//Admin Layout After Login

  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
    
      {
        path: 'design',
        loadChildren: () => import('./admin-components/design/design.routes').then(m => m.routes),
      },
      {
        path: 'material',
        loadChildren: () => import('./admin-components/material/material.routes').then(m => m.routes),
      },
      {
        path: 'media',
        loadChildren: () => import('./admin-components/media/media.routes').then(m => m.routes),
      },
    ],
  },
  {

   path:'user',
   loadChildren:()=> import('./user-components/user-components.module').then(m=>m.UserComponentsModule)

  },


//Login And Register Route

  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
