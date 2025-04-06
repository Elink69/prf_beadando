import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: "full"},
    {path: "login", loadComponent: () => import('./user-login/user-login.component').then((c) => c.UserLoginComponent)},
    {path: "register", loadComponent: () => import('./user-register/user-register.component').then((c) => c.UserRegisterComponent)},
    {path: "home", loadComponent: () => import('./homepage/homepage.component').then((c) => c.HomepageComponent), canActivate: [authGuard]},
    {path: "**", redirectTo: 'login'}
];
