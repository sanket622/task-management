import { Routes } from '@angular/router';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
  {
    path:'',
    redirectTo:'loginsignup',
    pathMatch:'full'
  },
  {
    path:'loginsignup',
    component:LoginSignupComponent
  },
  {
    path:'',
    component:LayoutComponent,
    children:
    [
      {
        path:'dashboard',
        component:DashboardComponent
      }
    ]
  }
];
