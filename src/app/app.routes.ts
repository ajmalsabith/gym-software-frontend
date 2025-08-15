import { Routes } from '@angular/router';
import { authGuard } from '@core';
import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin-components/dashboard/dashboard.component';

export const routes: Routes = [

 {
  path: 'client',
  component: AdminLayoutComponent,
  // canActivate: [UserAuthGuard],
  // data: { auth: true }, // needs login
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    {
      path: 'modules',
      loadChildren: () => import('../app/component-sections/client/client.module').then(m => m.ClientModule)
    }
  ]
 },

  {
  path: 'admin',
  component: AdminLayoutComponent,
  // canActivate: [UserAuthGuard],
  // data: { auth: true }, // needs login
  children: [
    { path: 'dashboard', component: DashboardComponent },
    {
      path: 'modules',
      loadChildren: () => import('../app/component-sections/admin/admin.module').then(m => m.AdminModule)
    },
    { path: '**', redirectTo: 'dashboard' },
  ]
 },

  { path: '**', redirectTo: 'admin' },

];
