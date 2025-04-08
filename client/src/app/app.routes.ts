import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleCheckGuard } from './guards/role-check.guard';
import { UserRoles } from './enums/userRoles';

export const routes: Routes = [
    {path: "", redirectTo: "login", pathMatch: "full"},
    {path: "login", loadComponent: () => import('./user-login/user-login.component').then((c) => c.UserLoginComponent)},
    {path: "register", loadComponent: () => import('./user-register/user-register.component').then((c) => c.UserRegisterComponent)},
    {path: "home", loadComponent: () => import('./homepage/homepage.component').then((c) => c.HomepageComponent), canActivate: [authGuard]},
    {path: "courses", loadComponent: () => import('./course/course.component').then((c) => c.CourseComponent), canActivate: [authGuard]},
    {path: "users", loadComponent: () => import('./user-page/user-page.component').then((c) => c.UserPageComponent), canActivate: [authGuard, roleCheckGuard(UserRoles.Admin)]},
    {path: "**", redirectTo: 'login'}
];
