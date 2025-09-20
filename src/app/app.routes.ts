import { Routes } from '@angular/router';
import { authGuard } from '@core';
import { AdminLayoutComponent } from '@theme/admin-layout/admin-layout.component';
import { ClientAuthGuard } from './guards/client-route-guard';
import { DashboardComponentClient } from './component-sections/client/Modules/dashboard/dashboard.component';
import { ClientLoginComponent } from './component-sections/client/Modules/login/login.component';

export const routes: Routes = [

 {
  path: 'client',
  component: AdminLayoutComponent,
  canActivate: [ClientAuthGuard],
  data: { auth: true }, // needs login
  children: [
    { path: '', redirectTo: 'client/modules/dashboard', pathMatch: 'full' },
    {
      path: 'modules',
      loadChildren: () => import('../app/component-sections/client/client.module').then(m => m.ClientModule)
    }
  ]
 },
 { path:'client-login', component: ClientLoginComponent, canActivate:[ClientAuthGuard], data: { auth: false } },

 { path: '**', redirectTo: 'client/modules/dashboard' },

];
