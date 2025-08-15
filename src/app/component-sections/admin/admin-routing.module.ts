import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from 'app/login/login.component';
import { GymComponent } from './Modules/gym/gym.component';
import { UsersComponent } from './Modules/users/users.component';

const routes: Routes = [
  {path:'admin-login',component:LoginComponent},
  {path:'gym-manage',component:GymComponent},
  {path:'user-manage',component:UsersComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
